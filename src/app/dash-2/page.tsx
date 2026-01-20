"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Dash2Page() {
    const data = useQuery(api.dashboard.getDashboardData);
    const user = useQuery(api.users.viewer);
    const updateVision = useMutation(api.dashboard.updateVision);
    const addNextAction = useMutation(api.dashboard.addNextAction);
    const toggleActionComplete = useMutation(api.dashboard.toggleActionComplete);
    const triggerCall = useAction(api.vapi.triggerOutboundCall);

    const [isEditingVision, setIsEditingVision] = useState(false);
    const [visionText, setVisionText] = useState("");
    const [isAddingAction, setIsAddingAction] = useState(false);
    const [newActionText, setNewActionText] = useState("");
    const [isCalling, setIsCalling] = useState(false);

    const handleEditVision = () => {
        setVisionText(data?.vision?.visionSummary || "");
        setIsEditingVision(true);
    };

    const handleSaveVision = async () => {
        await updateVision({ visionSummary: visionText });
        setIsEditingVision(false);
    };

    const handleAddAction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newActionText.trim()) return;
        await addNextAction({ text: newActionText });
        setNewActionText("");
        setIsAddingAction(false);
    };

    const handleCallMe = async () => {
        if (!user?.phone) {
            alert("Please verify your phone number in settings first.");
            return;
        }
        setIsCalling(true);
        try {
            await triggerCall({ phone: user.phone, type: "daily-agent" });
            alert("Call triggered! Check your phone.");
        } catch (error: any) {
            console.error(error);
            alert(`Failed to trigger call: ${error.message}`);
        } finally {
            setIsCalling(false);
        }
    };

    const vision = data?.vision?.visionSummary ||
        "To build a sustainable business that allows me financial freedom and time with my family.";

    const nextSession = data?.nextSession;
    const nextSessionDate = nextSession ? new Date(nextSession.scheduledFor) : null;

    const today = new Date();
    const isTomorrow = nextSessionDate && nextSessionDate.getDate() === today.getDate() + 1;
    const isToday = nextSessionDate && nextSessionDate.getDate() === today.getDate();

    let sessionDateString = "No session scheduled";
    if (nextSessionDate) {
        if (isTomorrow) sessionDateString = "Tomorrow";
        else if (isToday) sessionDateString = "Today";
        else sessionDateString = nextSessionDate.toLocaleDateString("en-US", { weekday: 'long' });
    }

    const sessionTimeString = nextSessionDate ?
        `at ${nextSessionDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}` : "";

    return (
        <>
            <link
                href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
                rel="stylesheet"
            />
            <div className="dark bg-background-dark text-gray-100 min-h-screen">
                <div className="flex h-screen overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-64 bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark hidden md:flex flex-col flex-shrink-0 transition-colors duration-200">
                        <div className="p-6 flex items-center gap-3">
                            <div className="bg-primary/20 p-2 rounded-lg">
                                <span className="material-icons-outlined text-primary text-2xl">
                                    auto_awesome
                                </span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Coach
                            </span>
                        </div>
                        <nav className="flex-1 px-4 space-y-2 mt-4">
                            <a
                                className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium transition-colors"
                                href="#"
                            >
                                <span className="material-icons-outlined">dashboard</span>
                                Dashboard
                            </a>
                            <a
                                className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg font-medium transition-colors"
                                href="#"
                            >
                                <span className="material-icons-outlined">history</span>
                                History
                            </a>
                            <a
                                className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg font-medium transition-colors"
                                href="#"
                            >
                                <span className="material-icons-outlined">track_changes</span>
                                Goals
                            </a>
                            <a
                                className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg font-medium transition-colors"
                                href="#"
                            >
                                <span className="material-icons-outlined">library_books</span>
                                Resources
                            </a>
                        </nav>
                        <div className="p-4 border-t border-border-light dark:border-border-dark">
                            <button className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
                                {user?.image ? (
                                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                                        <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                        {user?.name?.charAt(0) || "U"}
                                    </div>
                                )}

                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user?.name || "Loading..."}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                        {user?.email || "Coachee"}
                                    </p>
                                </div>
                                <span className="material-icons-outlined text-gray-400 text-lg">
                                    settings
                                </span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto">
                        <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button className="md:hidden p-2 text-gray-600 dark:text-gray-400">
                                    <span className="material-icons-outlined">menu</span>
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Dashboard
                                    </h1>
                                    <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
                                        Good evening, let's make today count.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex flex-col items-end mr-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Emergency Contact
                                    </span>
                                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                        +55 (48) 99154-0000
                                    </span>
                                </div>
                                <button
                                    onClick={handleCallMe}
                                    disabled={isCalling}
                                    className="bg-primary hover:bg-primary_hover text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="material-icons-outlined text-lg">call</span>
                                    <span className="font-medium">{isCalling ? "Calling..." : "Call Me"}</span>
                                </button>
                            </div>
                        </header>

                        <div className="p-6 max-w-7xl mx-auto space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Next Session Card */}
                                <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark shadow-sm flex flex-col justify-between relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-primary/10 text-primary p-1.5 rounded-md material-icons-outlined text-sm">
                                                calendar_today
                                            </span>
                                            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Next Session
                                            </h2>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                                {sessionDateString}
                                            </p>
                                            <p className="text-xl text-primary font-medium">
                                                {sessionTimeString}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-dashed border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Prepare your weekly summary
                                        </span>
                                        <button className="text-primary hover:text-primary_hover transition-colors">
                                            <span className="material-icons-outlined">
                                                arrow_forward
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Vision Card */}
                                <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-border-light dark:border-border-dark shadow-sm group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0">
                                        <img
                                            alt="Mountain landscape representing vision and goals"
                                            className="w-full h-full object-cover opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6E2Cx-0AqWDGLvt_I2_seqZnLczOJcpFhLUV4GobdZAn1qSA_5OlJvfQoRsLkQIO8oefx3I6034Z_zIi8CWtS_U3U_opr-6lYSPQarwkU5fpkLm5489P9MKeNLo00xEqGg3IUTTAPTWsghDKl3RQtSysbi1K9kuuzQtnMetxz9LT07MrBi02cbOwpO91GLvt_I2_seqZnLczOJcpFhLUV4GobdZAn1qSA_5OlJvfQoRsLkQIO8oefx3I6034Z_zIi8CWtS_U3U_opr-6lYSPQarwkU5fpkLm5489P9MKeNLo00xEqGg3IUTTAPTWsghDKl3RQtSysbi1K9kuuzQtnMetxz9LT07MrBi02cbOwpO91GLv8mr2iTsGzf_G88nOeXyF7JwrNjklOXpLCr_0FF7b1g_exyKlSS9Qoxy0JQtXZKxFNFU2UQapcDeXE"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0"></div>
                                    <div className="relative z-10 p-8 h-full flex flex-col justify-end min-h-[280px]">
                                        <div className="absolute top-6 right-6">
                                            <button
                                                onClick={handleEditVision}
                                                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-full transition-all"
                                            >
                                                <span className="material-icons-outlined">edit</span>
                                            </button>
                                        </div>
                                        <h2 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                                            Your Vision
                                        </h2>

                                        {isEditingVision ? (
                                            <div className="mb-3">
                                                <textarea
                                                    value={visionText}
                                                    onChange={(e) => setVisionText(e.target.value)}
                                                    className="w-full bg-black/50 text-white border border-gray-600 rounded p-2 text-xl"
                                                    rows={3}
                                                />
                                                <div className="flex gap-2 mt-2">
                                                    <button onClick={handleSaveVision} className="bg-primary px-3 py-1 rounded text-white text-sm">Save</button>
                                                    <button onClick={() => setIsEditingVision(false)} className="bg-white/10 px-3 py-1 rounded text-white text-sm">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                                                "{vision}"
                                            </h3>
                                        )}

                                        <div className="h-1 w-16 bg-primary rounded-full mb-4"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* This Week Card */}
                                <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm flex flex-col">
                                    <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className="material-icons-outlined text-gray-400">
                                                date_range
                                            </span>
                                            This Week
                                        </h3>
                                        <span className="text-xs font-medium px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                            On Track
                                        </span>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                                        {data?.weeklyObjective ? (
                                            <>
                                                <p className="text-xl font-medium text-white mb-4">"{data.weeklyObjective.objective}"</p>
                                                <div className="w-full text-left">
                                                    <p className="text-sm text-gray-400 mb-2 font-semibold">Priority Actions:</p>
                                                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                                                        {data.weeklyObjective.actions.map((action: string, i: number) => (
                                                            <li key={i}>{action}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                                    <span className="material-icons-outlined text-gray-400 text-3xl">
                                                        psychology
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 max-w-sm mb-2">
                                                    Your weekly objective will be set during your Sunday call.
                                                    Once it's set, everything else revolves around it.
                                                </p>
                                                <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                                                    You don't need to plan this manually.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-b-2xl border-t border-border-light dark:border-border-dark">
                                        <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-1.5 mb-2">
                                            <div
                                                className="bg-primary h-1.5 rounded-full"
                                                style={{ width: "0%" }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>0% Completed</span>
                                            <span>0/1 Goals</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Actions Card */}
                                <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm flex flex-col">
                                    <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className="material-icons-outlined text-gray-400">
                                                check_circle
                                            </span>
                                            Next Actions
                                        </h3>
                                        <button
                                            onClick={() => setIsAddingAction(true)}
                                            className="text-primary hover:text-primary_hover text-sm font-medium transition-colors"
                                        >
                                            + Add Action
                                        </button>
                                    </div>

                                    {isAddingAction && (
                                        <form onSubmit={handleAddAction} className="px-6 pt-4">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Type new action..."
                                                className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white"
                                                value={newActionText}
                                                onChange={(e) => setNewActionText(e.target.value)}
                                                onBlur={() => !newActionText && setIsAddingAction(false)}
                                            />
                                        </form>
                                    )}

                                    <div className="p-8 flex-1 flex flex-col items-center justify-center text-center min-h-[250px] overflow-y-auto">
                                        {data?.dailyPlan && data.dailyPlan.actions.length > 0 ? (
                                            <div className="w-full space-y-3">
                                                {data.dailyPlan.actions.map((action: any, i: number) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors text-left group">
                                                        <button
                                                            onClick={() => toggleActionComplete({ planId: data.dailyPlan._id, actionIndex: i, completed: !action.completed })}
                                                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${action.completed ? 'bg-green-500 border-green-500' : 'border-zinc-600 hover:border-primary'}`}
                                                        >
                                                            {action.completed && <span className="material-icons-outlined text-white text-sm">check</span>}
                                                        </button>
                                                        <span className={`text-sm flex-1 ${action.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                                            {action.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                                    <span className="material-icons-outlined text-gray-400 text-3xl">
                                                        bolt
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 max-w-sm">
                                                    Your next actions will be defined during your evening
                                                    call. We focus on clarity first, then execution.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-b-2xl border-t border-border-light dark:border-border-dark text-center">
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            Waiting for call updates...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
