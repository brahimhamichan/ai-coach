"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Plus, Target } from "lucide-react";

export default function DailyPlanPage() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [startTime, setStartTime] = useState("");
    const [actions, setActions] = useState(["", "", ""]);
    const [isSaving, setIsSaving] = useState(false);

    const createManualDailyPlan = useMutation(api.dailyPlans.createManualDailyPlan);
    const todayPlan = useQuery(api.dailyPlans.getTodayPlan);

    const handleActionChange = (index: number, value: string) => {
        const newActions = [...actions];
        newActions[index] = value;
        setActions(newActions);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await createManualDailyPlan({
                date,
                startTime,
                actions: actions.filter(action => action.trim() !== "").map(text => ({ text, completed: false })),
            });
            // Reset form
            setActions(["", "", ""]);
            setStartTime("");
            setDate(new Date().toISOString().split("T")[0]);
        } catch (error) {
            console.error("Failed to save daily plan:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="container max-w-2xl mx-auto py-10 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Plan</h1>
                    <p className="text-muted-foreground">
                        Plan your 3 key actions for tomorrow.
                    </p>
                </div>

                {todayPlan && todayPlan.actions.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Today's Plan
                            </CardTitle>
                            <CardDescription>
                                Actions already set for today from your evening call.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {todayPlan.actions.map((action, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                        <span className="flex-1">{action.text}</span>
                                        <span className={`text-sm px-2 py-1 rounded ${action.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {action.completed ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Plan Tomorrow</CardTitle>
                        <CardDescription>
                            Set your 3 key actions for maximum focus.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                placeholder="e.g., 09:00"
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label>3 Key Actions</Label>
                            {actions.map((action, i) => (
                                <div key={i} className="space-y-2">
                                    <Input
                                        placeholder={`Action ${i + 1}`}
                                        value={action}
                                        onChange={(e) => handleActionChange(i, e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={isSaving || actions.filter(a => a.trim() === "").length > 0}
                            className="w-full"
                        >
                            {isSaving ? "Saving..." : "Save Plan"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}