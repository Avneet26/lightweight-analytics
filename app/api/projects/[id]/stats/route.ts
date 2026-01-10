import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, events, dailyStats } from "@/lib/db/schema";
import { eq, and, sql, desc, gte } from "drizzle-orm";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET /api/projects/[id]/stats - Get project statistics
export async function GET(request: Request, context: RouteContext) {
    try {
        const session = await auth();
        const { id } = await context.params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership
        const [project] = await db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.id, id),
                    eq(projects.userId, session.user.id)
                )
            )
            .limit(1);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Get query params for date range
        const url = new URL(request.url);
        const period = url.searchParams.get("period") || "7d";

        // Calculate date range
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case "24h":
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case "7d":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "30d":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "90d":
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        const startDateStr = startDate.toISOString().split("T")[0];

        // Get total pageviews and visitors from daily stats
        const statsResult = await db
            .select({
                totalPageviews: sql<number>`COALESCE(SUM(${dailyStats.pageviews}), 0)`,
                totalVisitors: sql<number>`COALESCE(SUM(${dailyStats.uniqueVisitors}), 0)`,
            })
            .from(dailyStats)
            .where(
                and(
                    eq(dailyStats.projectId, id),
                    gte(dailyStats.date, startDateStr)
                )
            );

        // Get total events
        const eventsResult = await db
            .select({
                totalEvents: sql<number>`COUNT(*)`,
            })
            .from(events)
            .where(
                and(
                    eq(events.projectId, id),
                    gte(events.createdAt, startDate)
                )
            );

        // Get top pages
        const topPagesResult = await db
            .select({
                page: dailyStats.page,
                views: sql<number>`SUM(${dailyStats.pageviews})`,
            })
            .from(dailyStats)
            .where(
                and(
                    eq(dailyStats.projectId, id),
                    gte(dailyStats.date, startDateStr)
                )
            )
            .groupBy(dailyStats.page)
            .orderBy(desc(sql`SUM(${dailyStats.pageviews})`))
            .limit(10);

        // Get daily breakdown for chart
        const dailyBreakdown = await db
            .select({
                date: dailyStats.date,
                pageviews: sql<number>`SUM(${dailyStats.pageviews})`,
                visitors: sql<number>`SUM(${dailyStats.uniqueVisitors})`,
            })
            .from(dailyStats)
            .where(
                and(
                    eq(dailyStats.projectId, id),
                    gte(dailyStats.date, startDateStr)
                )
            )
            .groupBy(dailyStats.date)
            .orderBy(dailyStats.date);

        // Get browsers breakdown
        const browsersResult = await db
            .select({
                browser: events.browser,
                count: sql<number>`COUNT(*)`,
            })
            .from(events)
            .where(
                and(
                    eq(events.projectId, id),
                    gte(events.createdAt, startDate)
                )
            )
            .groupBy(events.browser)
            .orderBy(desc(sql`COUNT(*)`))
            .limit(5);

        // Get devices breakdown
        const devicesResult = await db
            .select({
                device: events.device,
                count: sql<number>`COUNT(*)`,
            })
            .from(events)
            .where(
                and(
                    eq(events.projectId, id),
                    gte(events.createdAt, startDate)
                )
            )
            .groupBy(events.device)
            .orderBy(desc(sql`COUNT(*)`))
            .limit(5);

        // Get countries breakdown
        const countriesResult = await db
            .select({
                country: events.country,
                count: sql<number>`COUNT(*)`,
            })
            .from(events)
            .where(
                and(
                    eq(events.projectId, id),
                    gte(events.createdAt, startDate)
                )
            )
            .groupBy(events.country)
            .orderBy(desc(sql`COUNT(*)`))
            .limit(10);

        // Calculate previous period for growth comparison
        let previousStartDate: Date;
        let previousEndDate: Date = startDate;
        const periodDuration = now.getTime() - startDate.getTime();
        previousStartDate = new Date(startDate.getTime() - periodDuration);

        const previousStartDateStr = previousStartDate.toISOString().split("T")[0];
        const previousEndDateStr = previousEndDate.toISOString().split("T")[0];

        // Get previous period stats for comparison
        const previousStatsResult = await db
            .select({
                totalPageviews: sql<number>`COALESCE(SUM(${dailyStats.pageviews}), 0)`,
                totalVisitors: sql<number>`COALESCE(SUM(${dailyStats.uniqueVisitors}), 0)`,
            })
            .from(dailyStats)
            .where(
                and(
                    eq(dailyStats.projectId, id),
                    gte(dailyStats.date, previousStartDateStr),
                    sql`${dailyStats.date} < ${previousEndDateStr}`
                )
            );

        // Get previous period events
        const previousEventsResult = await db
            .select({
                totalEvents: sql<number>`COUNT(*)`,
            })
            .from(events)
            .where(
                and(
                    eq(events.projectId, id),
                    gte(events.createdAt, previousStartDate),
                    sql`${events.createdAt} < ${previousEndDate}`
                )
            );

        // Calculate growth percentages
        const currentPageviews = Number(statsResult[0]?.totalPageviews || 0);
        const previousPageviews = Number(previousStatsResult[0]?.totalPageviews || 0);
        const currentVisitors = Number(statsResult[0]?.totalVisitors || 0);
        const previousVisitors = Number(previousStatsResult[0]?.totalVisitors || 0);
        const currentEvents = Number(eventsResult[0]?.totalEvents || 0);
        const previousEvents = Number(previousEventsResult[0]?.totalEvents || 0);

        const calculateGrowth = (current: number, previous: number): number => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const pageviewsGrowth = calculateGrowth(currentPageviews, previousPageviews);
        const visitorsGrowth = calculateGrowth(currentVisitors, previousVisitors);
        const eventsGrowth = calculateGrowth(currentEvents, previousEvents);

        return NextResponse.json({
            totalPageviews: currentPageviews,
            totalVisitors: currentVisitors,
            totalEvents: currentEvents,
            growth: {
                pageviews: pageviewsGrowth,
                visitors: visitorsGrowth,
                events: eventsGrowth,
            },
            topPages: topPagesResult.map(p => ({ page: p.page, views: Number(p.views) })),
            dailyBreakdown: dailyBreakdown.map(d => ({
                date: d.date,
                pageviews: Number(d.pageviews),
                visitors: Number(d.visitors),
            })),
            browsers: browsersResult.map(b => ({ browser: b.browser, count: Number(b.count) })),
            devices: devicesResult.map(d => ({ device: d.device, count: Number(d.count) })),
            countries: countriesResult.map(c => ({ country: c.country, count: Number(c.count) })),
            period,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
