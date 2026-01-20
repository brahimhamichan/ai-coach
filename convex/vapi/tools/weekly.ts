import { createToolDef } from "./utils";

export const saveWeeklyDataTool = createToolDef(
    "saveWeeklyData",
    "Save the structured weekly plan including objective, bottlenecks, actions, and behavioral changes.",
    {
        objective: {
            type: "string",
            description: "The single most important objective to complete this week.",
        },
        bottlenecks: {
            type: "array",
            items: { type: "string" },
            description: "The three biggest bottlenecks that could stop the user.",
        },
        actions: {
            type: "array",
            items: { type: "string" },
            description: "The three concrete actions that guarantee completion of the objective.",
        },
        stopList: {
            type: "array",
            items: { type: "string" },
            description: "List of things the user needs to STOP doing this week.",
        },
        startList: {
            type: "array",
            items: { type: "string" },
            description: "List of things the user needs to START doing this week.",
        },
        continueList: {
            type: "array",
            items: { type: "string" },
            description: "List of things the user should CONTINUE doing.",
        },
        commitmentLevel: {
            type: "number",
            description: "User's self-rated commitment level (1-10).",
        },
    },
    ["objective", "bottlenecks", "actions", "stopList", "startList", "continueList", "commitmentLevel"]
);
