"use client";

import Link from "next/link";
import { Doc } from "../../convex/_generated/dataModel";
import { ArrowRight, FileText, Sparkles } from "lucide-react";

interface SummaryBannerProps {
    summary: Doc<"callSummaries"> | null | undefined;
}

export function SummaryBanner({ summary }: SummaryBannerProps) {
    // Per PRD: No banner when no summaries exist. Silence is preferred.
    if (!summary) {
        return null;
    }

    const callTypeLabels: Record<string, string> = {
        "onboarding-agent": "Onboarding Call",
        "weekly-agent": "Weekly Planning",
        "daily-agent": "Daily Recap",
    };

    return (
        <Link
            href={`/summary/${summary._id}`}
            className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-4 transition-all hover:border-primary/40 hover:from-primary/15 hover:via-primary/10"
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border border-primary/20 text-primary shadow-sm group-hover:scale-105 transition-transform">
                    {summary.callType === "weekly-agent" ? (
                        <Sparkles className="h-5 w-5" />
                    ) : (
                        <FileText className="h-5 w-5" />
                    )}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                            {callTypeLabels[summary.callType] || summary.callType}
                        </span>
                        <span className="text-xs text-muted-foreground/80">
                            • {formatTime(summary.timestamp)}
                        </span>
                    </div>
                    <p className="text-sm text-foreground/80 truncate pr-4">
                        {summary.summaryText}
                    </p>
                </div>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/50 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2">
                <ArrowRight className="h-4 w-4 text-primary" />
            </div>
        </Link>
    );
}

function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) {
        return "Just now";
    }
    if (diffHours < 24) {
        return `${Math.floor(diffHours)}h ago`;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length).trim() + "...";
}
