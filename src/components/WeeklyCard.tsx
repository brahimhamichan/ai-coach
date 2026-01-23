"use client";

import { Doc } from "../../convex/_generated/dataModel";
import { EmptyState } from "./EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface WeeklyCardProps {
    objective: Doc<"weeklyObjectives"> | null | undefined;
    isLoading?: boolean;
}

export function WeeklyCard({ objective, isLoading }: WeeklyCardProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>This Week</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        );
    }

    // Empty state - no weekly call yet
    if (!objective) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>This Week</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        message="Your weekly objective will be set during your Sunday call. Once it's set, everything else revolves around it."
                        hint="You don't need to plan this manually."
                    />
                </CardContent>
            </Card>
        );
    }

    // Objective exists
    return (
        <Card className="h-full shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold tracking-tight">This Week</CardTitle>
                <Badge variant="secondary" className="font-normal text-muted-foreground">
                    {formatWeekDate(objective.weekStartDate)}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
                <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
                    <h3 className="text-lg font-semibold leading-tight text-foreground">{objective.objective}</h3>
                </div>

                {objective.actions.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Actions</h4>
                        <ul className="space-y-2">
                            {objective.actions.map((action, i) => (
                                <li key={i} className="flex items-start gap-3 rounded-md border bg-card p-3 text-sm shadow-sm transition-colors hover:bg-accent/50">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                        {i + 1}
                                    </span>
                                    <span className="leading-snug text-foreground/90">{action}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {objective.bottlenecks.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-destructive">
                            Watch Out For
                        </h4>
                        <ul className="space-y-2">
                            {objective.bottlenecks.map((bottleneck, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                                    <span>{bottleneck}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function formatWeekDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `Week of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}
