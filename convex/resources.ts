import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all resources with optional filtering
export const getResources = query({
    args: {
        category: v.optional(v.union(
            v.literal("productivity"),
            v.literal("mindset"),
            v.literal("strategy"),
            v.literal("technical")
        )),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        let resourcesQuery: any = ctx.db.query("resources");

        // Apply category filter if provided
        if (args.category) {
            resourcesQuery = resourcesQuery.withIndex("by_category", (q: any) =>
                q.eq("category", args.category)
            );
        }

        // Apply featured filter if provided
        if (args.featured !== undefined) {
            resourcesQuery = resourcesQuery.filter((q: any) =>
                q.eq("featured", args.featured)
            );
        }

        const resources = await resourcesQuery.order("desc").collect();
        return resources;
    },
});