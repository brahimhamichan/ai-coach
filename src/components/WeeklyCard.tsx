"use client";

import { Doc } from "../../convex/_generated/dataModel";
import { EmptyState } from "./EmptyState";
import styles from "./WeeklyCard.module.css";

interface WeeklyCardProps {
    objective: Doc<"weeklyObjectives"> | null | undefined;
    isLoading?: boolean;
}

export function WeeklyCard({ objective, isLoading }: WeeklyCardProps) {
    if (isLoading) {
        return (
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.label}>This Week</span>
                </div>
                <div className={styles.skeleton} />
            </div>
        );
    }

    // Empty state - no weekly call yet
    if (!objective) {
        return (
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.label}>This Week</span>
                </div>
                <EmptyState
                    message="Your weekly objective will be set during your Sunday call. Once it's set, everything else revolves around it."
                    hint="You don't need to plan this manually."
                />
            </div>
        );
    }

    // Objective exists
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.label}>This Week</span>
                <span className={styles.weekDate}>{formatWeekDate(objective.weekStartDate)}</span>
            </div>

            <div className={styles.content}>
                <div className={styles.objective}>
                    <h3 className={styles.objectiveText}>{objective.objective}</h3>
                </div>

                {objective.actions.length > 0 && (
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Key Actions</h4>
                        <ul className={styles.actionList}>
                            {objective.actions.map((action, i) => (
                                <li key={i} className={styles.actionItem}>
                                    <span className={styles.actionNumber}>{i + 1}</span>
                                    <span>{action}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {objective.bottlenecks.length > 0 && (
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Watch Out For</h4>
                        <ul className={styles.bottleneckList}>
                            {objective.bottlenecks.map((bottleneck, i) => (
                                <li key={i}>{bottleneck}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

function formatWeekDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `Week of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}
