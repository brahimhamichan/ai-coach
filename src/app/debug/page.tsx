"use client";

// Force dynamic rendering - Convex queries run client-side
export const dynamic = "force-dynamic";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Navigation } from "@/components/Navigation";
import styles from "./page.module.css";

export default function DebugPage() {
    const user = useQuery(api.users.getStubUser);
    const callSessions = useQuery(
        api.callSessions.getCallSessions,
        user ? { userId: user._id } : "skip"
    );
    const callSummaries = useQuery(
        api.callSummaries.getCallSummaries,
        user ? { userId: user._id } : "skip"
    );

    const createTestSession = useMutation(api.callSessions.createTestCallSession);
    const createTestSummary = useMutation(api.callSummaries.createTestCallSummary);

    const [isCreating, setIsCreating] = useState(false);

    const handleTriggerTestWebhook = async () => {
        if (!user) return;
        setIsCreating(true);

        try {
            // Create a test session
            const sessionId = await createTestSession({
                userId: user._id,
                callType: "evening",
            });

            // Create a test summary for that session
            await createTestSummary({
                userId: user._id,
                callSessionId: sessionId,
                callType: "evening",
                summaryText: "This is a test summary created from the debug page. In a real call, this would contain the full transcript and extracted action items.",
            });

            alert("Test data created!");
        } catch (error) {
            console.error("Failed to create test data:", error);
            alert("Failed to create test data");
        }

        setIsCreating(false);
    };

    const isLoading = user === undefined;
    const hasNoData = callSessions?.length === 0;

    const statusColors: Record<string, string> = {
        scheduled: styles.statusScheduled,
        in_progress: styles.statusInProgress,
        completed: styles.statusCompleted,
        missed: styles.statusMissed,
        failed: styles.statusFailed,
    };

    return (
        <div className={styles.page}>
            <Navigation />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Debug</h1>
                    <button
                        className={styles.testButton}
                        onClick={handleTriggerTestWebhook}
                        disabled={isCreating || !user}
                    >
                        {isCreating ? "Creating..." : "Trigger test webhook write"}
                    </button>
                </header>

                {isLoading ? (
                    <div className={styles.skeleton} />
                ) : hasNoData ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyMessage}>No calls yet.</p>
                        <p className={styles.emptyHint}>
                            Once calls begin, you'll see the full timeline here.
                        </p>
                    </div>
                ) : (
                    <div className={styles.sections}>
                        {/* Call Sessions Timeline */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Call Sessions</h2>
                            <div className={styles.timeline}>
                                {callSessions?.map((session) => (
                                    <div key={session._id} className={styles.timelineItem}>
                                        <div className={styles.timelineMeta}>
                                            <span className={styles.callType}>{session.callType}</span>
                                            <span className={`${styles.status} ${statusColors[session.status]}`}>
                                                {session.status}
                                            </span>
                                        </div>
                                        <div className={styles.timelineDetails}>
                                            <span>Scheduled: {formatDate(session.scheduledFor)}</span>
                                            <span>Attempts: {session.attemptsCount}</span>
                                            {session.vapiCallId && (
                                                <span className={styles.vapiId}>Vapi: {session.vapiCallId.slice(0, 8)}...</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Call Summaries */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Call Summaries</h2>
                            <div className={styles.summariesList}>
                                {callSummaries?.map((summary) => (
                                    <div key={summary._id} className={styles.summaryItem}>
                                        <div className={styles.summaryMeta}>
                                            <span className={styles.callType}>{summary.callType}</span>
                                            <span className={styles.timestamp}>{formatDate(summary.timestamp)}</span>
                                            {summary.locked && <span className={styles.locked}>🔒</span>}
                                        </div>
                                        <p className={styles.summaryPreview}>
                                            {summary.summaryText.slice(0, 150)}...
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* User Info */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>User Data</h2>
                            <pre className={styles.json}>
                                {JSON.stringify(user, null, 2)}
                            </pre>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}
