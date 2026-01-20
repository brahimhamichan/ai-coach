import { createToolDef } from "./utils";

export const saveDailyDataTool = createToolDef(
    "saveDailyData",
    "Save the daily closeout review (wins/misses) and the plan for tomorrow.",
    {
        wins: {
            type: "array",
            items: { type: "string" },
            description: "List of 1-3 wins from today.",
        },
        misses: {
            type: "array",
            items: { type: "string" },
            description: "List of top 1-3 things that didn't happen today.",
        },
        blockers: {
            type: "string",
            description: "The real blocker underneath the misses (time, energy, avoidance, etc.).",
        },
        actions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    text: { type: "string", description: "The action to take." },
                    why: { type: "string", description: "Why this action matters tomorrow (one sentence)." },
                },
                required: ["text", "why"],
            },
            description: "Exactly 3 actions for tomorrow.",
        },
        startTime: {
            type: "string",
            description: "The specific time the user commits to starting action #1 tomorrow.",
        },
    },
    ["wins", "misses", "blockers", "actions", "startTime"]
);
