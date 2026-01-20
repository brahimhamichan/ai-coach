"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    const convex = useMemo(() => {
        const url = process.env.NEXT_PUBLIC_CONVEX_URL;

        // During build or if URL is not configured, don't create client
        if (!url || url === "https://placeholder.convex.cloud") {
            return null;
        }

        return new ConvexReactClient(url);
    }, []);

    // Show a placeholder during build/when Convex is not configured
    if (!convex) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0f0f14",
                color: "#9999aa"
            }}>
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ color: "#f0f0f5", marginBottom: "8px" }}>⚡ Coach</h1>
                    <p>Run <code>npx convex dev</code> to start</p>
                </div>
            </div>
        );
    }

    return (
        <ConvexAuthNextjsProvider client={convex}>
            {children}
        </ConvexAuthNextjsProvider>
    );
}
