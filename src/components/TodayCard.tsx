"use client";

import { Doc } from "../../convex/_generated/dataModel";
import { EmptyState } from "./EmptyState";
import styles from "./TodayCard.module.css";

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
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.label}>Next Actions</span>
                </div>
                <div className={styles.skeleton} />
            </div>
        );
    }

    // Empty state - no evening call yet
    if (!plan) {
        return (
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.label}>Next Actions</span>
                </div>
                <EmptyState
                    message="Your next actions will be defined during your evening call. We focus on clarity first, then execution."
                    hint={nextCallTime ? `Next call at ${nextCallTime}` : undefined}
                />
            </div>
        );
    }

    // Plan exists
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.label}>
                    {isForTomorrow ? "Tomorrow" : "Today"}
                </span>
                <span className={styles.date}>{formatDate(plan.date)}</span>
            </div>

            <div className={styles.content}>
                <ul className={styles.actionList}>
                    {plan.actions.map((action, i) => (
                        <li key={i} className={styles.actionItem}>
                            <div className={`${styles.checkbox} ${action.completed ? styles.completed : ""}`}>
                                {action.completed && "✓"}
                            </div>
                            <span className={action.completed ? styles.completedText : ""}>
                                {action.text}
                            </span>
                        </li>
                    ))}
                </ul>

                {plan.actions.length < 3 && (
                    <p className={styles.note}>
                        {3 - plan.actions.length} more action{3 - plan.actions.length !== 1 ? "s" : ""} will be set in your next call
                    </p>
                )}
            </div>
        </div>
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
