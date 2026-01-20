"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PlayCircle, Activity, Calendar, Clock, BarChart3, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Code2 } from "lucide-react";


interface CallDetailsProps {
    call: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CallDetails({ call, open, onOpenChange }: CallDetailsProps) {
    const callSessionId = call?.callSessionId as Id<"callSessions"> | undefined;

    const callSummary = useQuery(api.callSummaries.getCallSummaryBySession,
        callSessionId ? { sessionId: callSessionId } : "skip"
    );

    const agentData = useQuery(api.agent.getAgentData,
        callSessionId ? { callSessionId } : "skip"
    );

    if (!call) return null;


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-primary/5 px-6 py-8 border-b">
                    <DialogHeader className="opacity-100">
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 text-primary capitalize">
                                {call.direction} Session
                            </Badge>
                            <Badge className={cn(
                                "capitalize",
                                call.status === "completed" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                            )}>
                                {call.status}
                            </Badge>
                        </div>
                        <DialogTitle className="text-3xl font-bold tracking-tight">Session Details</DialogTitle>
                        <DialogDescription className="text-base flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1.5 outline-none">
                                <Calendar className="h-4 w-4 text-primary" />
                                {call.startedAt ? format(new Date(call.startedAt), "MMMM d, yyyy") : "Unknown Date"}
                            </span>
                            <span className="flex items-center gap-1.5 outline-none">
                                <Clock className="h-4 w-4 text-primary" />
                                {call.startedAt ? format(new Date(call.startedAt), "h:mm a") : ""}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
                        {/* Audio Player Section */}
                        <div className="rounded-2xl bg-card border shadow-sm overflow-hidden">
                            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <PlayCircle className="h-4 w-4 text-primary" /> Recording
                                </h3>
                                {call.durationSeconds && (
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {Math.floor(call.durationSeconds / 60)}:{(call.durationSeconds % 60).toString().padStart(2, "0")}
                                    </span>
                                )}
                            </div>
                            <div className="p-6">
                                {call.recordingUrl ? (
                                    <audio src={call.recordingUrl} controls className="w-full accent-primary" />
                                ) : (
                                    <div className="py-4 text-center text-sm text-muted-foreground italic">
                                        Recording currently unavailable for this session.
                                    </div>
                                )}
                            </div>
                        </div>

                        <Tabs defaultValue="transcript" className="flex-1 flex flex-col overflow-hidden">
                            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl">
                                <TabsTrigger value="transcript" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    <MessageSquare className="h-4 w-4 mr-2" /> Transcript
                                </TabsTrigger>
                                <TabsTrigger value="summary" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    <FileText className="h-4 w-4 mr-2" /> AI Summary
                                </TabsTrigger>
                                <TabsTrigger value="data" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                    <Code2 className="h-4 w-4 mr-2" /> Data
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="transcript" className="flex-1 overflow-hidden mt-4 ring-offset-background focus-visible:outline-none">
                                <div className="h-full rounded-2xl border bg-card/50">
                                    <ScrollArea className="h-[40vh] md:h-full p-6">
                                        {call.transcription ? (
                                            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                                                {call.transcription}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                                                <Activity className="h-10 w-10 opacity-20" />
                                                <p>No transcript generated yet.</p>
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            </TabsContent>

                            <TabsContent value="summary" className="flex-1 overflow-hidden mt-4 ring-offset-background focus-visible:outline-none">
                                <div className="h-full rounded-2xl border bg-card/50">
                                    <ScrollArea className="h-[40vh] md:h-full p-6">
                                        {callSummary?.summaryText || call.summary ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
                                                {callSummary?.summaryText || call.summary}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                                                <BarChart3 className="h-10 w-10 opacity-20" />
                                                <p>AI Summary is being processed.</p>
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            </TabsContent>

                            <TabsContent value="data" className="flex-1 overflow-hidden mt-4 ring-offset-background focus-visible:outline-none">
                                <div className="h-full rounded-2xl border bg-card/50">
                                    <ScrollArea className="h-[40vh] md:h-full p-6">
                                        <div className="space-y-6">
                                            {callSummary?.extractedData && (
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Final Analysis</h4>
                                                    <div className="bg-muted/30 p-4 rounded-lg font-mono text-xs overflow-auto border">
                                                        <pre>{JSON.stringify(callSummary.extractedData, null, 2)}</pre>
                                                    </div>
                                                </div>
                                            )}

                                            {agentData && agentData.length > 0 && (
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Collected Data Events</h4>
                                                    {agentData.map((data, i) => (
                                                        <div key={i} className="space-y-2">
                                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                <span className="font-medium text-primary">{data.agentType}</span>
                                                                <span>{format(new Date(data.timestamp), "h:mm:ss a")}</span>
                                                            </div>
                                                            <div className="bg-muted/30 p-4 rounded-lg font-mono text-xs overflow-auto border">
                                                                <pre>{JSON.stringify(data.data, null, 2)}</pre>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {(!callSummary?.extractedData && (!agentData || agentData.length === 0)) && (
                                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                                                    <Activity className="h-10 w-10 opacity-20" />
                                                    <p>No data collected for this session.</p>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

