import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects, events } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET /api/projects/[id]/events - Get recent events for a project
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

        // Get query params for pagination
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get("limit") || "50");
        const offset = parseInt(url.searchParams.get("offset") || "0");

        // Fetch recent events
        const recentEvents = await db
            .select()
            .from(events)
            .where(eq(events.projectId, id))
            .orderBy(desc(events.createdAt))
            .limit(limit)
            .offset(offset);

        // Get total count
        const [{ count }] = await db
            .select({ count: db.$count(events) })
            .from(events)
            .where(eq(events.projectId, id));

        return NextResponse.json({
            events: recentEvents,
            total: count,
            limit,
            offset,
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}
