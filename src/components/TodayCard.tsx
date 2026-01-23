"use client";

import { Doc } from "../../convex/_generated/dataModel";
import { EmptyState } from "./EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface TodayCardProps {
    todayPlan: Doc<"dailyPlans"> | null | undefined;
    tomorrowPlan: Doc<"dailyPlans"> | null | undefined;
    nextCallTime?: string;
    isLoading?: boolean;
}

export function TodayCard({ todayPlan, tomorrowPlan, nextCallTime, isLoading }: TodayCardProps) {
    // Use tomorrow's plan if it exists, otherwise today's
    const plan = tomorrowPlan || todayPlan;
    const isForTomorrow = !!tomorrowPlan;

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Next Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        );
    }

    // Empty state - no evening call yet
    if (!plan) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Next Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        message="Your next actions will be defined during your evening call. We focus on clarity first, then execution."
                        hint={nextCallTime ? `Next call at ${nextCallTime}` : undefined}
                    />
                </CardContent>
            </Card>
        );
    }

    // Plan exists
    return (
        <Card className="h-full shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold tracking-tight">
                    {isForTomorrow ? "Tomorrow" : "Today"}
                </CardTitle>
                <Badge variant="outline" className="font-normal text-muted-foreground">
                    {formatDate(plan.date)}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
                <ul className="space-y-3">
                    {plan.actions.map((action, i) => (
                        <li key={i} className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${action.completed ? "bg-muted/50 border-transparent text-muted-foreground" : "bg-card hover:bg-accent/50"}`}>
                            <div className="mt-0.5 shrink-0 text-primary">
                                {action.completed ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <Circle className="h-5 w-5 opacity-40" />
                                )}
                            </div>
                            <span className={`leading-snug ${action.completed ? "line-through decoration-muted-foreground/50" : "font-medium text-foreground"}`}>
                                {action.text}
                            </span>
                        </li>
                    ))}
                </ul>

                {plan.actions.length < 3 && (
                    <p className="text-center text-xs text-muted-foreground italic">
                        {3 - plan.actions.length} more action{3 - plan.actions.length !== 1 ? "s" : ""} will be set in your next call
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateStr === today.toISOString().split("T")[0]) {
        return "Today";
    }
    if (dateStr === tomorrow.toISOString().split("T")[0]) {
        return "Tomorrow";
    }
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
