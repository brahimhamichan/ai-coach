"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Target, TrendingUp } from "lucide-react";

export default function WeeklyReviewPage() {
    const [weekStartDate, setWeekStartDate] = useState(getCurrentWeekStart());
    const [objective, setObjective] = useState("");
    const [bottlenecks, setBottlenecks] = useState(["", ""]);
    const [actions, setActions] = useState(["", "", ""]);
    const [stopList, setStopList] = useState([""]);
    const [startList, setStartList] = useState([""]);
    const [continueList, setContinueList] = useState([""]);
    const [isSaving, setIsSaving] = useState(false);

    const createManualWeeklyObjective = useMutation(api.weeklyObjectives.createManualWeeklyObjective);
    const currentObjective = useQuery(api.weeklyObjectives.getCurrentWeekObjective);

    const handleBottleneckChange = (index: number, value: string) => {
        const newBottlenecks = [...bottlenecks];
        newBottlenecks[index] = value;
        setBottlenecks(newBottlenecks);
    };

    const handleActionChange = (index: number, value: string) => {
        const newActions = [...actions];
        newActions[index] = value;
        setActions(newActions);
    };

    const handleStopListChange = (index: number, value: string) => {
        const newStopList = [...stopList];
        newStopList[index] = value;
        setStopList(newStopList);
    };

    const handleStartListChange = (index: number, value: string) => {
        const newStartList = [...startList];
        newStartList[index] = value;
        setStartList(newStartList);
    };

    const handleContinueListChange = (index: number, value: string) => {
        const newContinueList = [...continueList];
        newContinueList[index] = value;
        setContinueList(newContinueList);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await createManualWeeklyObjective({
                weekStartDate,
                objective,
                bottlenecks: bottlenecks.filter(b => b.trim() !== ""),
                actions: actions.filter(a => a.trim() !== ""),
                stopList: stopList.filter(s => s.trim() !== ""),
                startList: startList.filter(s => s.trim() !== ""),
                continueList: continueList.filter(c => c.trim() !== ""),
            });
            // Reset form
            setObjective("");
            setBottlenecks(["", ""]);
            setActions(["", "", ""]);
            setStopList([""]);
            setStartList([""]);
            setContinueList([""]);
            setWeekStartDate(getCurrentWeekStart());
        } catch (error) {
            console.error("Failed to save weekly objective:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="container max-w-2xl mx-auto py-10 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Weekly Review</h1>
                    <p className="text-muted-foreground">
                        Set your objective and key actions for the week.
                    </p>
                </div>

                {currentObjective && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                This Week's Objective
                            </CardTitle>
                            <CardDescription>
                                Objective set during your weekly call.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="font-medium">{currentObjective.objective}</p>
                                </div>
                                {currentObjective.actions.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2">Key Actions:</h4>
                                        <ul className="space-y-1">
                                            {currentObjective.actions.map((action, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                    {action}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Set Next Week's Objective</CardTitle>
                        <CardDescription>
                            Define your focus areas and commitment for next week.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="weekStartDate">Week Starting</Label>
                            <Input
                                id="weekStartDate"
                                type="date"
                                value={weekStartDate}
                                onChange={(e) => setWeekStartDate(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="objective">Weekly Objective</Label>
                            <Input
                                id="objective"
                                placeholder="What's your main focus this week?"
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label>Current Bottlenecks (Top 2)</Label>
                            {bottlenecks.map((bottleneck, i) => (
                                <Input
                                    key={i}
                                    placeholder={`Bottleneck ${i + 1}`}
                                    value={bottleneck}
                                    onChange={(e) => handleBottleneckChange(i, e.target.value)}
                                    className="w-full mb-2"
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <Label>Key Actions (Top 3)</Label>
                            {actions.map((action, i) => (
                                <Input
                                    key={i}
                                    placeholder={`Action ${i + 1}`}
                                    value={action}
                                    onChange={(e) => handleActionChange(i, e.target.value)}
                                    className="w-full mb-2"
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Stop Doing</Label>
                                <Input
                                    placeholder="What will you stop?"
                                    value={stopList[0]}
                                    onChange={(e) => handleStopListChange(0, e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Start Doing</Label>
                                <Input
                                    placeholder="What will you start?"
                                    value={startList[0]}
                                    onChange={(e) => handleStartListChange(0, e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Continue Doing</Label>
                                <Input
                                    placeholder="What will you continue?"
                                    value={continueList[0]}
                                    onChange={(e) => handleContinueListChange(0, e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !objective.trim()}
                            className="w-full"
                        >
                            {isSaving ? "Saving..." : "Set Weekly Objective"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

function getCurrentWeekStart(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString().split("T")[0];
}