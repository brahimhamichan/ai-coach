"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Target, List } from "lucide-react";

export default function HistoryPage() {
    const [view, setView] = useState<"list" | "calendar">("list");
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: ""
    });

    const plans = useQuery(api.history.getPastPlans, {
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
        limit: 20
    });

    const stats = useQuery(api.history.getCompletionStats, {
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined
    });

    return (
        <div className="min-h-screen bg-background">
            <main className="container max-w-2xl mx-auto py-10 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">History</h1>
                    <p className="text-muted-foreground mb-6">
                        Track your progress and review your coaching journey.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats?.totalPlans || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats?.completedPlans || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {stats?.completionRate || 0}%
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {stats?.currentStreak || 0} days
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Date Range Filter */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Filter by Date</CardTitle>
                        <CardDescription>
                            View your progress over specific time periods.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border rounded-md"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setDateRange({ startDate: "", endDate: "" })}
                            >
                                Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* View Toggle */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={view === "list" ? "default" : "outline"}
                        onClick={() => setView("list")}
                    >
                        <List className="h-4 w-4" />
                        List View
                    </Button>
                    <Button
                        variant={view === "calendar" ? "default" : "outline"}
                        onClick={() => setView("calendar")}
                    >
                        <Calendar className="h-4 w-4" />
                        Calendar View
                    </Button>
                </div>

                {/* Plans List/Calendar */}
                {plans && plans.length > 0 ? (
                    <div className="space-y-4">
                        {plans.map((plan, index) => (
                            <Card key={plan._id} className="p-6">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">{plan.date}</CardTitle>
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                                            plan.actions.every(action => action.completed) 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {plan.actions.every(action => action.completed) ? 'Complete' : 'Incomplete'}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <h4 className="font-medium mb-2">Daily Actions:</h4>
                                        <ul className="space-y-1">
                                            {plan.actions.map((action, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <span className={`w-3 h-3 rounded-full ${
                                                        action.completed 
                                                            ? 'bg-green-500' 
                                                            : 'bg-gray-300'
                                                    }`}></span>
                                                    <span className={
                                                        action.completed ? 'line-through text-gray-500' : ''
                                                    }>
                                                        {action.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="text-muted-foreground">
                                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium mb-2">No plans found</h3>
                                <p className="text-sm">
                                    {dateRange.startDate || dateRange.endDate 
                                        ? "No plans found in the selected date range." 
                                        : "Start planning to see your progress here."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}