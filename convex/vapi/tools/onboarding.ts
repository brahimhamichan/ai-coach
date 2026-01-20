import { createToolDef } from "./utils";

export const saveOnboardingDataTool = createToolDef(
    "saveOnboardingData",
    "Save the user's vision, motivations, cost of inaction, and commitment declaration from the onboarding call.",
    {
        visionSummary: {
            type: "string",
            description: "One clear sentence describing what the user is building or focused on for the next 12 months.",
        },
        motivations: {
            type: "array",
            items: { type: "string" },
            description: "List of reasons why this matters to the user (the 'real' reasons).",
        },
        costOfInaction: {
            type: "string",
            description: "Description of what life looks like in 12 months if nothing changes (the pain point).",
        },
        commitmentDeclaration: {
            type: "string",
            description: "The short commitment sentence spoken by the user to fix their execution.",
        },
    },
    ["visionSummary", "motivations", "costOfInaction", "commitmentDeclaration"]
);
