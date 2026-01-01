import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, events, dailyStats } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { parseUserAgent } from "@/lib/utils";

// Allow CORS for tracking from any domain
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// POST /api/track - Receive tracking events
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { apiKey, type, name, page, referrer, sessionId } = body;

        if (!apiKey) {
            return NextResponse.json(
                { error: "API key is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        // Find project by API key
        const [project] = await db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.apiKey, apiKey),
                    eq(projects.isActive, true)
                )
            )
            .limit(1);

        if (!project) {
            return NextResponse.json(
                { error: "Invalid API key" },
                { status: 401, headers: corsHeaders }
            );
        }

        // Parse user agent
        const userAgent = request.headers.get("user-agent") || "";
        const { browser, device } = parseUserAgent(userAgent);

        // Get country from headers (works on Vercel/Cloudflare)
        const country = request.headers.get("x-vercel-ip-country") ||
            request.headers.get("cf-ipcountry") ||
            "Unknown";

        // Create event (id is auto-increment, don't include it)
        await db.insert(events).values({
            projectId: project.id,
            type: type || "pageview",
            name: name || null,
            page: page || "/",
            referrer: referrer || null,
            country,
            device,
            browser,
            sessionId: sessionId || null,
        });

        // Only update daily stats for pageview events
        const eventType = type || "pageview";

        if (eventType === "pageview") {
            const today = new Date().toISOString().split("T")[0];

            // Try to find existing stats for today + page
            const [existingStat] = await db
                .select()
                .from(dailyStats)
                .where(
                    and(
                        eq(dailyStats.projectId, project.id),
                        eq(dailyStats.date, today),
                        eq(dailyStats.page, page || "/")
                    )
                )
                .limit(1);

            if (existingStat) {
                // Update existing stats
                await db
                    .update(dailyStats)
                    .set({
                        pageviews: sql`${dailyStats.pageviews} + 1`,
                    })
                    .where(eq(dailyStats.id, existingStat.id));
            } else {
                // Create new daily stat (id is auto-increment, don't include it)
                await db.insert(dailyStats).values({
                    projectId: project.id,
                    date: today,
                    page: page || "/",
                    pageviews: 1,
                    uniqueVisitors: 1,
                });
            }
        }

        return NextResponse.json(
            { success: true },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error("Tracking error:", error);
        return NextResponse.json(
            { error: "Tracking failed" },
            { status: 500, headers: corsHeaders }
        );
    }
}
