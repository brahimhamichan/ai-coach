"use client";

import { Doc } from "../../convex/_generated/dataModel";
import { EmptyState } from "./EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface VisionCardProps {
    vision: Doc<"visionProfiles"> | null | undefined;
    isLoading?: boolean;
}

export function VisionCard({ vision, isLoading }: VisionCardProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Your Vision</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-32 w-full" />
                </CardContent>
            </Card>
        );
    }

    // Empty state - pre-onboarding
    if (!vision) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Your Vision</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        message="We'll build this together during your onboarding call. This becomes your anchor when motivation drops."
                        hint="Nothing to do right now."
                    />
                </CardContent>
            </Card>
        );
    }

    // Vision exists
    return (
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg tracking-tight text-primary">Your Vision</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{vision.visionSummary}</p>

                {vision.motivations.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What Drives You</h4>
                        <ul className="space-y-1.5">
                            {vision.motivations.map((m, i) => (
                                <li key={i} className="text-sm font-medium">{m}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {vision.commitmentDeclaration && (
                    <div className="relative rounded-lg bg-background p-4 shadow-sm border">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Commitment</h4>
                        <p className="font-serif text-sm italic text-foreground">"{vision.commitmentDeclaration}"</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


