import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ============================================
// USERS TABLE
// ============================================
export const users = sqliteTable("users", {
    id: text("id").primaryKey(), // UUID
    email: text("email").notNull().unique(),
    name: text("name"),
    passwordHash: text("password_hash").notNull(),
    plan: text("plan").default("free"), // free, pro, enterprise
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// PROJECTS TABLE
// ============================================
export const projects = sqliteTable("projects", {
    id: text("id").primaryKey(), // UUID
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    domain: text("domain"), // e.g., "mysite.com"
    apiKey: text("api_key").notNull().unique(), // For tracking script auth
    isActive: integer("is_active", { mode: "boolean" }).default(true),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// EVENTS TABLE (Raw tracking events)
// ============================================
export const events = sqliteTable("events", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // "pageview", "click", "custom"
    name: text("name"), // Custom event name (e.g., "signup_button_click")
    page: text("page").notNull(), // URL path (e.g., "/about")
    referrer: text("referrer"), // Where they came from
    country: text("country"), // 2-letter country code (from IP)
    device: text("device"), // "desktop", "mobile", "tablet"
    browser: text("browser"), // "Chrome", "Firefox", etc.
    sessionId: text("session_id"), // For session tracking
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// DAILY STATS TABLE (Aggregated for fast queries)
// ============================================
export const dailyStats = sqliteTable("daily_stats", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    date: text("date").notNull(), // YYYY-MM-DD format
    page: text("page").notNull(),
    pageviews: integer("pageviews").default(0),
    uniqueVisitors: integer("unique_visitors").default(0),
});

// ============================================
// SESSIONS TABLE (For auth sessions - NextAuth)
// ============================================
export const sessions = sqliteTable("sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

// ============================================
// RELATIONS
// ============================================
export const usersRelations = relations(users, ({ many }) => ({
    projects: many(projects),
    sessions: many(sessions),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    user: one(users, {
        fields: [projects.userId],
        references: [users.id],
    }),
    events: many(events),
    dailyStats: many(dailyStats),
}));

export const eventsRelations = relations(events, ({ one }) => ({
    project: one(projects, {
        fields: [events.projectId],
        references: [projects.id],
    }),
}));

export const dailyStatsRelations = relations(dailyStats, ({ one }) => ({
    project: one(projects, {
        fields: [dailyStats.projectId],
        references: [projects.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

// ============================================
// TYPE EXPORTS
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type DailyStat = typeof dailyStats.$inferSelect;
export type NewDailyStat = typeof dailyStats.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
