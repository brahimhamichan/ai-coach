"use client";

// Force dynamic rendering - Convex queries run client-side
export const dynamic = "force-dynamic";

import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Navigation } from "@/components/Navigation";
import styles from "./page.module.css";

export default function SummaryPage() {
    const params = useParams();
    const router = useRouter();
    const summaryId = params.id as string;

    // Try to fetch the summary
    const summary = useQuery(
        api.callSummaries.getCallSummary,
        summaryId ? { summaryId: summaryId as Id<"callSummaries"> } : "skip"
    );

    const updateSummary = useMutation(api.callSummaries.updateCallSummary);

    const [editText, setEditText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Handle invalid/missing summary ID
    if (summary === null) {
        return (
            <div className={styles.page}>
                <Navigation />
                <main className={styles.main}>
                    <div className={styles.emptyState}>
                        <p className={styles.emptyMessage}>Nothing to review here.</p>
                        <p className={styles.emptyHint}>Summaries appear automatically after calls.</p>
                        <button
                            className={styles.backButton}
                            onClick={() => router.push("/")}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // Loading state
    if (summary === undefined) {
        return (
            <div className={styles.page}>
                <Navigation />
                <main className={styles.main}>
                    <div className={styles.skeleton} />
                </main>
            </div>
        );
    }

    const handleStartEdit = () => {
        setEditText(summary.userEditsText || summary.summaryText);
        setIsEditing(true);
    };

    const handleSave = async (lock: boolean) => {
        setIsSaving(true);
        try {
            await updateSummary({
                summaryId: summary._id,
                userEditsText: editText,
                lock,
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save:", error);
        }
        setIsSaving(false);
    };

    const callTypeLabels = {
        onboarding: "Onboarding Call",
        weekly: "Weekly Planning",
        evening: "Evening Recap",
    };

    return (
        <div className={styles.page}>
            <Navigation />

            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.meta}>
                        <span className={styles.type}>{callTypeLabels[summary.callType]}</span>
                        <span className={styles.date}>
                            {new Date(summary.timestamp).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                    <button
                        className={styles.backLink}
                        onClick={() => router.push("/")}
                    >
                        ← Back
                    </button>
                </header>

                <div className={styles.content}>
                    {isEditing ? (
                        <div className={styles.editor}>
                            <textarea
                                className={styles.textarea}
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                placeholder="Edit your summary..."
                                disabled={isSaving}
                            />
                            <div className={styles.editorActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.saveButton}
                                    onClick={() => handleSave(false)}
                                    disabled={isSaving}
                                >
                                    Save Draft
                                </button>
                                <button
                                    className={styles.lockButton}
                                    onClick={() => handleSave(true)}
                                    disabled={isSaving}
                                >
                                    Save & Lock
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.summaryText}>
                                {summary.userEditsText || summary.summaryText}
                            </div>

                            {!summary.locked && (
                                <button
                                    className={styles.editButton}
                                    onClick={handleStartEdit}
                                >
                                    Edit Summary
                                </button>
                            )}

                            {summary.locked && (
                                <p className={styles.lockedNote}>
                                    This summary has been locked and cannot be edited.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
