import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateApiKey } from "@/lib/utils";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET /api/projects/[id] - Get a single project
export async function GET(request: Request, context: RouteContext) {
    try {
        const session = await auth();
        const { id } = await context.params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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

        return NextResponse.json({ project });
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(request: Request, context: RouteContext) {
    try {
        const session = await auth();
        const { id } = await context.params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, domain, isActive, regenerateApiKey } = body;

        // Verify ownership
        const [existing] = await db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.id, id),
                    eq(projects.userId, session.user.id)
                )
            )
            .limit(1);

        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const updates: Partial<typeof existing> = {
            updatedAt: new Date(),
        };

        if (name !== undefined) updates.name = name;
        if (domain !== undefined) {
            updates.domain = domain.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
        }
        if (isActive !== undefined) updates.isActive = isActive;
        if (regenerateApiKey) updates.apiKey = generateApiKey();

        await db
            .update(projects)
            .set(updates)
            .where(eq(projects.id, id));

        const [updated] = await db
            .select()
            .from(projects)
            .where(eq(projects.id, id));

        return NextResponse.json({ project: updated });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(request: Request, context: RouteContext) {
    try {
        const session = await auth();
        const { id } = await context.params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership
        const [existing] = await db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.id, id),
                    eq(projects.userId, session.user.id)
                )
            )
            .limit(1);

        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        await db.delete(projects).where(eq(projects.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
