"use client";

// Force dynamic rendering - Convex queries run client-side
export const dynamic = "force-dynamic";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
    const user = useQuery(api.users.viewer);
    const schedule = useQuery(api.schedules.getSchedule);

    const updateUser = useMutation(api.users.updateUser);
    const updateSchedule = useMutation(api.schedules.updateSchedule);

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");

    const handleUserUpdate = async (field: string, value: string | boolean) => {
        setIsSaving(true);
        setSaveMessage("");
        try {
            await updateUser({ [field]: value });
            setSaveMessage("Saved!");
            setTimeout(() => setSaveMessage(""), 2000);
        } catch (error) {
            console.error("Failed to save:", error);
            setSaveMessage("Failed to save");
        }
        setIsSaving(false);
    };

    const handleScheduleUpdate = async (field: string, value: string | string[] | boolean | number) => {
        setIsSaving(true);
        setSaveMessage("");
        try {
            await updateSchedule({ [field]: value });
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
        <div className="min-h-screen bg-background">


            <main className="container max-w-2xl mx-auto py-10 px-4 space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
                    </div>
                    {saveMessage && (
                        <span className="text-sm font-medium text-emerald-500 animate-in fade-in slide-in-from-right-5">
                            {saveMessage}
                        </span>
                    )}
                </header>

                {isLoading ? (
                    <div className="space-y-4">
                        <div className="h-48 rounded-xl bg-muted animate-pulse" />
                        <div className="h-96 rounded-xl bg-muted animate-pulse" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* User Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>
                                    Manage your timezone and coaching preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <div className="relative">
                                        <select
                                            id="timezone"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="coachingTone">Coaching Tone</Label>
                                    <div className="relative">
                                        <select
                                            id="coachingTone"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={user?.coachingTone || "supportive"}
                                            onChange={(e) => handleUserUpdate("coachingTone", e.target.value)}
                                            disabled={isSaving}
                                        >
                                            <option value="supportive">Supportive</option>
                                            <option value="direct">Direct</option>
                                            <option value="intense">Intense</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Schedule Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Call Schedule</CardTitle>
                                <CardDescription>
                                    {onboardingCompleted
                                        ? "Manage when you receive your coaching calls."
                                        : "You can adjust this anytime. For now, we'll guide you through it during your first call."
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="weeklyDay">Weekly Planning Day</Label>
                                        <select
                                            id="weeklyDay"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

                                    <div className="space-y-2">
                                        <Label htmlFor="weeklyTime">Weekly Call Time</Label>
                                        <Input
                                            id="weeklyTime"
                                            type="time"
                                            value={schedule?.weeklyTime || "10:00"}
                                            onChange={(e) => handleScheduleUpdate("weeklyTime", e.target.value)}
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="eveningTime">Evening Recap Time</Label>
                                    <Input
                                        id="eveningTime"
                                        type="time"
                                        className="md:w-1/2"
                                        value={schedule?.eveningTime || "17:00"}
                                        onChange={(e) => handleScheduleUpdate("eveningTime", e.target.value)}
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base" htmlFor="includeSaturday">
                                            Saturday Recap
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive a recap call on Saturdays.
                                        </p>
                                    </div>
                                    <Switch
                                        id="includeSaturday"
                                        checked={schedule?.includeSaturday || false}
                                        onChange={(e) => handleScheduleUpdate("includeSaturday", e.target.checked)}
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base" htmlFor="includeSundayRecap">
                                            Sunday Recap
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive a recap call on Sundays.
                                        </p>
                                    </div>
                                    <Switch
                                        id="includeSundayRecap"
                                        checked={schedule?.includeSundayRecap || false}
                                        onChange={(e) => handleScheduleUpdate("includeSundayRecap", e.target.checked)}
                                        disabled={isSaving}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>
                                    Choose how you want to be notified.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base" htmlFor="smsEnabled">
                                            SMS Reminders
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive reminders via text message.
                                        </p>
                                    </div>
                                    <Switch
                                        id="smsEnabled"
                                        checked={user?.smsEnabled || false}
                                        onChange={(e) => handleUserUpdate("smsEnabled", e.target.checked)}
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base" htmlFor="whatsappEnabled">
                                            WhatsApp Notifications
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive notifications via WhatsApp.
                                        </p>
                                    </div>
                                    <Switch
                                        id="whatsappEnabled"
                                        checked={user?.whatsappEnabled || false}
                                        onChange={(e) => handleUserUpdate("whatsappEnabled", e.target.checked)}
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="whatsappPhone">WhatsApp Number</Label>
                                    <Input
                                        id="whatsappPhone"
                                        type="tel"
                                        placeholder="+1234567890"
                                        value={user?.whatsappPhone || ""}
                                        onChange={(e) => handleUserUpdate("whatsappPhone", e.target.value)}
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base" htmlFor="pushEnabled">
                                            Push Notifications
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive push notifications on your device.
                                        </p>
                                    </div>
                                    <Switch
                                        id="pushEnabled"
                                        checked={user?.pushEnabled || false}
                                        onChange={(e) => handleUserUpdate("pushEnabled", e.target.checked)}
                                        disabled={isSaving}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}

