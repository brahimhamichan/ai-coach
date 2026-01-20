export interface ToolDefinition {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, any>;
            required?: string[];
        };
    };
}

export const createToolDef = (
    name: string,
    description: string,
    properties: Record<string, any>,
    required: string[] = []
): ToolDefinition => {
    return {
        type: "function",
        function: {
            name,
            description,
            parameters: {
                type: "object",
                properties,
                required,
            },
        },
    };
};
