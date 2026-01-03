import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, events } from "@/lib/db/schema";
import { eq, and, desc, asc, gte, lte, inArray, like, sql, SQL } from "drizzle-orm";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// Helper to parse comma-separated query params into arrays
function parseArrayParam(value: string | null): string[] {
    if (!value) return [];
    return value.split(",").map((v) => v.trim()).filter(Boolean);
}

// Helper to parse date string to Date object
function parseDate(dateStr: string | null): Date | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
}

// GET /api/projects/[id]/events - Get events with advanced filtering
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

        // Parse query parameters
        const url = new URL(request.url);

        // Pagination
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 500);
        const offset = parseInt(url.searchParams.get("offset") || "0");

        // Sorting
        const sortBy = url.searchParams.get("sortBy") || "createdAt";
        const sortOrder = url.searchParams.get("sortOrder") || "desc";

        // Date/Time Filters
        const startDate = parseDate(url.searchParams.get("startDate"));
        const endDate = parseDate(url.searchParams.get("endDate"));

        // Event Filters
        const types = parseArrayParam(url.searchParams.get("type"));
        const eventName = url.searchParams.get("name");

        // Page Filters
        const page = url.searchParams.get("page");
        const pageContains = url.searchParams.get("pageContains");

        // Device/Browser Filters
        const devices = parseArrayParam(url.searchParams.get("device"));
        const browsers = parseArrayParam(url.searchParams.get("browser"));

        // Location Filters
        const countries = parseArrayParam(url.searchParams.get("country"));

        // Session Filter
        const sessionId = url.searchParams.get("sessionId");

        // Referrer Filter
        const referrer = url.searchParams.get("referrer");

        // Build filter conditions
        const conditions: SQL[] = [eq(events.projectId, id)];

        // Date range filters
        if (startDate) {
            conditions.push(gte(events.createdAt, startDate));
        }
        if (endDate) {
            // Add 1 day to include the entire end date
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            conditions.push(lte(events.createdAt, endOfDay));
        }

        // Event type filter
        if (types.length > 0) {
            conditions.push(inArray(events.type, types));
        }

        // Event name filter (for custom events)
        if (eventName) {
            conditions.push(like(events.name, `%${eventName}%`));
        }

        // Page filters
        if (page) {
            conditions.push(eq(events.page, page));
        }
        if (pageContains) {
            conditions.push(like(events.page, `%${pageContains}%`));
        }

        // Device filter
        if (devices.length > 0) {
            conditions.push(inArray(events.device, devices));
        }

        // Browser filter
        if (browsers.length > 0) {
            conditions.push(inArray(events.browser, browsers));
        }

        // Country filter
        if (countries.length > 0) {
            conditions.push(inArray(events.country, countries));
        }

        // Session filter
        if (sessionId) {
            conditions.push(eq(events.sessionId, sessionId));
        }

        // Referrer filter
        if (referrer) {
            conditions.push(like(events.referrer, `%${referrer}%`));
        }

        // Determine sort column
        const getSortColumn = () => {
            switch (sortBy) {
                case "type":
                    return events.type;
                case "page":
                    return events.page;
                case "device":
                    return events.device;
                case "browser":
                    return events.browser;
                case "country":
                    return events.country;
                case "createdAt":
                default:
                    return events.createdAt;
            }
        };

        const sortColumn = getSortColumn();
        const orderFn = sortOrder === "asc" ? asc : desc;

        // Fetch filtered events
        const filteredEvents = await db
            .select()
            .from(events)
            .where(and(...conditions))
            .orderBy(orderFn(sortColumn))
            .limit(limit)
            .offset(offset);

        // Get total count with same filters
        const [{ count }] = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(events)
            .where(and(...conditions));

        // Get filter metadata (available options for filters)
        const [filterMeta] = await db
            .select({
                types: sql<string>`GROUP_CONCAT(DISTINCT ${events.type})`,
                devices: sql<string>`GROUP_CONCAT(DISTINCT ${events.device})`,
                browsers: sql<string>`GROUP_CONCAT(DISTINCT ${events.browser})`,
                countries: sql<string>`GROUP_CONCAT(DISTINCT ${events.country})`,
            })
            .from(events)
            .where(eq(events.projectId, id));

        // Build active filters summary
        const activeFilters: Record<string, string | string[] | null> = {};
        if (startDate) activeFilters.startDate = startDate.toISOString().split("T")[0];
        if (endDate) activeFilters.endDate = endDate.toISOString().split("T")[0];
        if (types.length > 0) activeFilters.types = types;
        if (eventName) activeFilters.eventName = eventName;
        if (page) activeFilters.page = page;
        if (pageContains) activeFilters.pageContains = pageContains;
        if (devices.length > 0) activeFilters.devices = devices;
        if (browsers.length > 0) activeFilters.browsers = browsers;
        if (countries.length > 0) activeFilters.countries = countries;
        if (sessionId) activeFilters.sessionId = sessionId;
        if (referrer) activeFilters.referrer = referrer;

        return NextResponse.json({
            events: filteredEvents,
            total: Number(count),
            limit,
            offset,
            sorting: {
                sortBy,
                sortOrder,
            },
            activeFilters,
            filterOptions: {
                types: filterMeta?.types?.split(",").filter(Boolean) || [],
                devices: filterMeta?.devices?.split(",").filter(Boolean) || [],
                browsers: filterMeta?.browsers?.split(",").filter(Boolean) || [],
                countries: filterMeta?.countries?.split(",").filter(Boolean) || [],
            },
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id]/events - Delete all events for a project
export async function DELETE(request: Request, context: RouteContext) {
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

        // Parse request body for confirmation
        const body = await request.json();
        const { confirmation } = body;

        // Require exact confirmation text
        if (confirmation !== "delete the logs") {
            return NextResponse.json(
                { error: "Invalid confirmation. Please type 'delete the logs' to confirm." },
                { status: 400 }
            );
        }

        // Delete all events for this project
        await db
            .delete(events)
            .where(eq(events.projectId, id));

        return NextResponse.json({
            success: true,
            message: "All events have been deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting events:", error);
        return NextResponse.json(
            { error: "Failed to delete events" },
            { status: 500 }
        );
    }
}
