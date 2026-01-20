"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CallHistoryList } from "../../components/dashboard/call-history-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CallsPage() {
    // Get authenticated user
    const user = useQuery(api.users.viewer);

    if (user === undefined) return (
        <div className="container py-12">
            <div className="animate-pulse space-y-4">
                <div className="h-8 w-48 bg-muted rounded" />
                <div className="h-4 w-72 bg-muted rounded" />
            </div>
        </div>
    );

    if (!user) return <div className="p-8">User setup required.</div>;

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-6xl mx-auto py-10 space-y-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Button variant="ghost" size="sm" asChild className="-ml-2 h-8 gap-1 text-muted-foreground hover:text-foreground">
                                <Link href="/">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Dashboard
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                            Call History
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Review your growth journey through past coaching sessions.
                        </p>
                    </div>
                </div>

                <CallHistoryList />
            </div>
        </div>
    );
}

