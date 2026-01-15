"use client";

// Force dynamic rendering - Convex queries run client-side
export const dynamic = "force-dynamic";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Navigation } from "@/components/Navigation";
import styles from "./page.module.css";

const DAYS_OF_WEEK = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const TIMEZONES = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Sao_Paulo",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
];

export default function SettingsPage() {
    const user = useQuery(api.users.getStubUser);
    const schedule = useQuery(
        api.schedules.getSchedule,
        user ? { userId: user._id } : "skip"
    );

    const updateUser = useMutation(api.users.updateUser);
    const updateSchedule = useMutation(api.schedules.updateSchedule);

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    const handleUserUpdate = async (field: string, value: string | boolean) => {
        if (!user) return;
        setIsSaving(true);
        setSaveMessage("");
        try {
            await updateUser({ userId: user._id, [field]: value });
            setSaveMessage("Saved!");
            setTimeout(() => setSaveMessage(""), 2000);
        } catch (error) {
            console.error("Failed to save:", error);
            setSaveMessage("Failed to save");
        }
        setIsSaving(false);
    };

    const handleScheduleUpdate = async (field: string, value: string | string[] | boolean | number) => {
        if (!user) return;
        setIsSaving(true);
        setSaveMessage("");
        try {
            await updateSchedule({ userId: user._id, [field]: value });
            setSaveMessage("Saved!");
            setTimeout(() => setSaveMessage(""), 2000);
        } catch (error) {
            console.error("Failed to save:", error);
            setSaveMessage("Failed to save");
        }
        setIsSaving(false);
    };

    const isLoading = user === undefined || schedule === undefined;

    // Check if onboarding is completed
    const onboardingCompleted = !!schedule?.onboardingTime;

    return (
        <div className={styles.page}>
            <Navigation />

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Settings</h1>
                    {saveMessage && (
                        <span className={styles.saveMessage}>{saveMessage}</span>
                    )}
                </header>

                {isLoading ? (
                    <div className={styles.skeleton} />
                ) : (
                    <div className={styles.sections}>
                        {/* User Settings */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Profile</h2>

                            <div className={styles.field}>
                                <label className={styles.label}>Timezone</label>
                                <select
                                    className={styles.select}
                                    value={user?.timezone || ""}
                                    onChange={(e) => handleUserUpdate("timezone", e.target.value)}
                                    disabled={isSaving}
                                >
                                    {TIMEZONES.map((tz) => (
                                        <option key={tz} value={tz}>
                                            {tz.replace("_", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Coaching Tone</label>
                                <select
                                    className={styles.select}
                                    value={user?.coachingTone || "supportive"}
                                    onChange={(e) => handleUserUpdate("coachingTone", e.target.value)}
                                    disabled={isSaving}
                                >
                                    <option value="supportive">Supportive</option>
                                    <option value="direct">Direct</option>
                                    <option value="intense">Intense</option>
                                </select>
                            </div>
                        </section>

                        {/* Schedule Settings */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Call Schedule</h2>

                            {!onboardingCompleted && (
                                <p className={styles.hint}>
                                    You can adjust this anytime. For now, we'll guide you through it during your first call.
                                </p>
                            )}

                            <div className={styles.field}>
                                <label className={styles.label}>Weekly Planning Day</label>
                                <select
                                    className={styles.select}
                                    value={schedule?.weeklyDay || "Sunday"}
                                    onChange={(e) => handleScheduleUpdate("weeklyDay", e.target.value)}
                                    disabled={isSaving}
                                >
                                    {DAYS_OF_WEEK.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Weekly Call Time</label>
                                <input
                                    type="time"
                                    className={styles.input}
                                    value={schedule?.weeklyTime || "10:00"}
                                    onChange={(e) => handleScheduleUpdate("weeklyTime", e.target.value)}
                                    disabled={isSaving}
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Evening Recap Time</label>
                                <input
                                    type="time"
                                    className={styles.input}
                                    value={schedule?.eveningTime || "17:00"}
                                    onChange={(e) => handleScheduleUpdate("eveningTime", e.target.value)}
                                    disabled={isSaving}
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={schedule?.includeSaturday || false}
                                        onChange={(e) => handleScheduleUpdate("includeSaturday", e.target.checked)}
                                        disabled={isSaving}
                                    />
                                    Include Saturday recap calls
                                </label>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={schedule?.includeSundayRecap || false}
                                        onChange={(e) => handleScheduleUpdate("includeSundayRecap", e.target.checked)}
                                        disabled={isSaving}
                                    />
                                    Include Sunday recap calls
                                </label>
                            </div>
                        </section>

                        {/* Notifications */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Notifications</h2>

                            <div className={styles.field}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={user?.smsEnabled || false}
                                        onChange={(e) => handleUserUpdate("smsEnabled", e.target.checked)}
                                        disabled={isSaving}
                                    />
                                    Enable SMS reminders
                                </label>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={user?.pushEnabled || false}
                                        onChange={(e) => handleUserUpdate("pushEnabled", e.target.checked)}
                                        disabled={isSaving}
                                    />
                                    Enable push notifications
                                </label>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}
