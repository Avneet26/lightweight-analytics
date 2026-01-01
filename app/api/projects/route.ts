import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { generateApiKey, generateId } from "@/lib/utils";
import { eq, and } from "drizzle-orm";

// GET /api/projects - List all projects for current user
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.userId, session.user.id))
            .orderBy(projects.createdAt);

        return NextResponse.json({ projects: userProjects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, domain } = body;

        if (!name || !domain) {
            return NextResponse.json(
                { error: "Name and domain are required" },
                { status: 400 }
            );
        }

        // Check if domain already exists for this user
        const existing = await db
            .select()
            .from(projects)
            .where(
                and(
                    eq(projects.userId, session.user.id),
                    eq(projects.domain, domain)
                )
            )
            .limit(1);

        if (existing.length > 0) {
            return NextResponse.json(
                { error: "A project with this domain already exists" },
                { status: 400 }
            );
        }

        const projectId = generateId();
        const apiKey = generateApiKey();

        await db.insert(projects).values({
            id: projectId,
            userId: session.user.id,
            name,
            domain: domain.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, ""),
            apiKey,
            isActive: true,
        });

        const [newProject] = await db
            .select()
            .from(projects)
            .where(eq(projects.id, projectId));

        return NextResponse.json({ project: newProject }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}
