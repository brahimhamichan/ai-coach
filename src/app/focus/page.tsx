"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, ArrowLeft, Loader2, PartyPopper, List, Target, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ViewMode = 'zen' | 'list';

export default function FocusPage() {
    const router = useRouter();
    const todayPlan = useQuery(api.dailyPlans.getTodayPlan);
    const toggleAction = useMutation(api.dailyPlans.toggleActionCompletion);
    const [viewMode, setViewMode] = useState<ViewMode>('zen');

    // Initial loading state
    if (todayPlan === undefined) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground/20" />
            </div>
        );
    }

    // No plan for today
    if (todayPlan === null) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
                <h1 className="mb-4 text-3xl font-light text-foreground/80">Peace of mind.</h1>
                <p className="mb-8 text-muted-foreground">No tasks scheduled for today.</p>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    // Find the first uncompleted action
    const currentActionIndex = todayPlan.actions.findIndex(a => !a.completed);
    const currentAction = currentActionIndex !== -1 ? todayPlan.actions[currentActionIndex] : null;
    const isAllComplete = currentActionIndex === -1 && todayPlan.actions.length > 0;

    const handleToggleAction = async (index: number, completed: boolean) => {
        if (todayPlan) {
            await toggleAction({
                id: todayPlan._id,
                actionIndex: index,
                completed
            });
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background">
            {/* Minimal Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-background/50 backdrop-blur-sm">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium hidden sm:inline-block">Dashboard</span>
                </button>

                {/* View Toggles */}
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-border/50">
                    <button
                        onClick={() => setViewMode('zen')}
                        className={cn(
                            "p-2 rounded-full transition-all duration-200",
                            viewMode === 'zen' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Zen Mode"
                    >
                        <Target className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "p-2 rounded-full transition-all duration-200",
                            viewMode === 'list' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                        title="List Mode"
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto overflow-y-auto">
                <AnimatePresence mode="wait">
                    {isAllComplete ? (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="mb-6 flex justify-center">
                                <div className="rounded-full bg-primary/10 p-6">
                                    <PartyPopper className="h-12 w-12 text-primary" />
                                </div>
                            </div>
                            <h1 className="mb-4 text-4xl md:text-5xl font-light text-foreground">
                                Flow State Complete.
                            </h1>
                            <p className="mb-8 text-xl text-muted-foreground max-w-lg mx-auto">
                                You've finished all your prioritized tasks for today. Enjoy your freedom.
                            </p>
                            <Button size="lg" onClick={() => router.push("/dashboard")}>
                                Back to Dashboard
                            </Button>
                        </motion.div>
                    ) : viewMode === 'zen' ? (
                        <motion.div
                            key={`zen-${currentActionIndex}`}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="text-center w-full max-w-2xl"
                        >
                            <p className="mb-8 text-sm uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                                Current Focus
                            </p>

                            <h1 className="mb-12 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
                                {currentAction?.text}
                            </h1>

                            <div className="flex justify-center">
                                <Button
                                    size="lg"
                                    className="h-16 px-8 text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 gap-3"
                                    onClick={() => handleToggleAction(currentActionIndex, true)}
                                >
                                    <CheckCircle2 className="h-6 w-6" />
                                    Mark as Complete
                                </Button>
                            </div>

                            {/* Subtle future actions preview in Zen mode */}
                            {todayPlan.actions.length > currentActionIndex + 1 && (
                                <div className="mt-16 opacity-30">
                                    <p className="text-sm font-medium mb-2">Up Next</p>
                                    <p className="text-lg">{todayPlan.actions[currentActionIndex + 1].text}</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-lg"
                        >
                            <h2 className="text-2xl font-light mb-8 text-center">Today's Plan</h2>
                            <div className="space-y-4">
                                {todayPlan.actions.map((action, i) => (
                                    <motion.div
                                        key={i}
                                        layout
                                        className={cn(
                                            "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
                                            action.completed
                                                ? "bg-muted/30 border-transparent opacity-50"
                                                : i === currentActionIndex
                                                    ? "bg-card border-primary/20 shadow-lg ring-1 ring-primary/10 scale-105"
                                                    : "bg-card border-border hover:border-primary/20"
                                        )}
                                    >
                                        <button
                                            onClick={() => handleToggleAction(i, !action.completed)}
                                            className={cn(
                                                "shrink-0 transition-colors duration-300",
                                                action.completed ? "text-primary" : "text-muted-foreground hover:text-primary"
                                            )}
                                        >
                                            {action.completed ? (
                                                <CheckCircle2 className="h-6 w-6" />
                                            ) : (
                                                <Circle className="h-6 w-6" />
                                            )}
                                        </button>
                                        <div className="flex-1">
                                            <p className={cn(
                                                "text-lg font-medium transition-all duration-300",
                                                action.completed && "line-through text-muted-foreground",
                                                !action.completed && i === currentActionIndex && "text-foreground",
                                                !action.completed && i !== currentActionIndex && "text-muted-foreground"
                                            )}>
                                                {action.text}
                                            </p>
                                        </div>
                                        {i === currentActionIndex && !action.completed && (
                                            <div className="shrink-0">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                                                    Current
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer / Context */}
            <div className="absolute bottom-6 w-full text-center pointer-events-none">
                {!isAllComplete && viewMode === 'zen' && (
                    <div className="flex justify-center gap-1.5 opacity-50">
                        {todayPlan.actions.map((action, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-1.5 rounded-full transition-colors ${action.completed
                                        ? "bg-primary"
                                        : i === currentActionIndex
                                            ? "bg-foreground"
                                            : "bg-muted-foreground/30"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
