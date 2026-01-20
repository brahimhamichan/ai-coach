"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { format } from "date-fns";
import { PhoneIncoming, PhoneOutgoing, Clock, Play, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { CallDetails } from "./call-details";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CallHistoryList() {
    const { results, status, loadMore, isLoading } = usePaginatedQuery(
        api.calls.getCalls,
        {},
        { initialNumItems: 20 }
    );

    const [selectedCall, setSelectedCall] = useState<any>(null);

    // Initial loading state
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="overflow-hidden border-none shadow-sm bg-muted/30">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                                <Skeleton className="h-8 w-24 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Empty state
    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Card className="w-full max-w-md border-dashed border bg-muted/5 shadow-none">
                    <CardContent className="p-10 text-center flex flex-col items-center justify-center space-y-5">
                        <div className="bg-primary/10 p-5 rounded-full ring-8 ring-primary/5 mb-2">
                            <PhoneIncoming className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold tracking-tight">No calls yet</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Your transformation starts with your first call. When you have a coaching session, it'll appear right here.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="mt-2 min-w-[140px]">
                            <Link href="/">Return to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {results.map((call) => (
                    <CallHistoryItem
                        key={call._id}
                        call={call}
                        onClick={() => setSelectedCall(call)}
                    />
                ))}
            </div>

            {status === "CanLoadMore" && (
                <div className="flex justify-center pt-8">
                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        onClick={() => loadMore(10)}
                    >
                        Load More Sessions
                    </Button>
                </div>
            )}

            <CallDetails
                call={selectedCall}
                open={!!selectedCall}
                onOpenChange={(open) => !open && setSelectedCall(null)}
            />
        </div>
    );
}

function CallHistoryItem({ call, onClick }: { call: any; onClick: () => void }) {
    const isCompleted = call.status === "completed";

    return (
        <Card
            className={cn(
                "group overflow-hidden transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/20 cursor-pointer active:scale-[0.99]",
                "border-none bg-card/50 backdrop-blur-sm"
            )}
            onClick={onClick}
        >
            <CardContent className="p-0">
                <div className="flex items-center gap-4 p-5 md:p-6">
                    {/* Call Type Icon */}
                    <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300",
                        call.direction === "inbound"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40"
                            : "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 group-hover:bg-teal-200 dark:group-hover:bg-teal-800/40"
                    )}>
                        {call.direction === "inbound" ? (
                            <PhoneIncoming className="h-6 w-6" />
                        ) : (
                            <PhoneOutgoing className="h-6 w-6" />
                        )}
                    </div>

                    {/* Main Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg tracking-tight">
                                {call.direction === "inbound" ? "Received Call" : "Outbound Session"}
                            </span>
                            <StatusBadge status={call.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {call.startedAt ? format(new Date(call.startedAt), "MMM d, yyyy • h:mm a") : "-"}
                            </div>
                            {call.durationSeconds && (
                                <div className="flex items-center gap-1.5">
                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30 hidden md:block" />
                                    <span>{formatDuration(call.durationSeconds)} duration</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Action Indicators */}
                    <div className="hidden sm:flex items-center gap-3 pr-2">
                        {call.recordingUrl && (
                            <div className="p-2 rounded-full bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Play className="h-4 w-4 fill-current" />
                            </div>
                        )}
                        {call.transcription && (
                            <div className="p-2 rounded-full bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <FileText className="h-4 w-4" />
                            </div>
                        )}
                        <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        completed: "secondary",
        missed: "destructive",
        failed: "destructive",
        "in-progress": "default",
    };

    const statusColors: Record<string, string> = {
        completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none",
        missed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none",
        failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none",
        "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none animate-pulse",
    };

    return (
        <Badge variant={variants[status] || "outline"} className={cn("capitalize px-2 py-0 text-[10px] font-bold tracking-wider uppercase", statusColors[status])}>
            {status}
        </Badge>
    );
}

function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
}

