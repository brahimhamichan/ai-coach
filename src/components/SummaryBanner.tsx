"use client";

import Link from "next/link";
import { Doc } from "../../convex/_generated/dataModel";
import styles from "./SummaryBanner.module.css";

interface SummaryBannerProps {
    summary: Doc<"callSummaries"> | null | undefined;
}

export function SummaryBanner({ summary }: SummaryBannerProps) {
    // Per PRD: No banner when no summaries exist. Silence is preferred.
    if (!summary) {
        return null;
    }

    const callTypeLabels = {
        onboarding: "Onboarding Call",
        weekly: "Weekly Planning",
        evening: "Evening Recap",
    };

    return (
        <Link href={`/summary/${summary._id}`} className={styles.banner}>
            <div className={styles.content}>
                <div className={styles.meta}>
                    <span className={styles.type}>{callTypeLabels[summary.callType]}</span>
                    <span className={styles.time}>{formatTime(summary.timestamp)}</span>
                </div>
                <p className={styles.preview}>
                    {truncate(summary.summaryText, 120)}
                </p>
            </div>
            <div className={styles.arrow}>→</div>
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
