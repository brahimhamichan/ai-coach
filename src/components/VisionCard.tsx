"use client";

import { Doc } from "../../convex/_generated/dataModel";
import { EmptyState } from "./EmptyState";
import styles from "./VisionCard.module.css";
import { useState } from "react";

interface VisionCardProps {
    vision: Doc<"visionProfiles"> | null | undefined;
    isLoading?: boolean;
}

export function VisionCard({ vision, isLoading }: VisionCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (isLoading) {
        return (
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.label}>Your Vision</span>
                </div>
                <div className={styles.skeleton} />
            </div>
        );
    }

    // Empty state - pre-onboarding
    if (!vision) {
        return (
            <div className={`${styles.card} ${styles.collapsed}`}>
                <div
                    className={styles.header}
                    onClick={() => setIsExpanded(!isExpanded)}
                    role="button"
                    tabIndex={0}
                >
                    <span className={styles.label}>Your Vision</span>
                    <span className={styles.expandIcon}>{isExpanded ? "−" : "+"}</span>
                </div>
                {isExpanded && (
                    <EmptyState
                        message="We'll build this together during your onboarding call. This becomes your anchor when motivation drops."
                        hint="Nothing to do right now."
                    />
                )}
            </div>
        );
    }

    // Vision exists
    return (
        <div className={styles.card}>
            <div
                className={styles.header}
                onClick={() => setIsExpanded(!isExpanded)}
                role="button"
                tabIndex={0}
            >
                <span className={styles.label}>Your Vision</span>
                <span className={styles.expandIcon}>{isExpanded ? "−" : "+"}</span>
            </div>

            {isExpanded && (
                <div className={styles.content}>
                    <p className={styles.visionText}>{vision.visionSummary}</p>

                    {vision.motivations.length > 0 && (
                        <div className={styles.section}>
                            <h4 className={styles.sectionTitle}>What Drives You</h4>
                            <ul className={styles.list}>
                                {vision.motivations.map((m, i) => (
                                    <li key={i}>{m}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {vision.commitmentDeclaration && (
                        <div className={styles.commitment}>
                            <h4 className={styles.sectionTitle}>Your Commitment</h4>
                            <p className={styles.quote}>"{vision.commitmentDeclaration}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


