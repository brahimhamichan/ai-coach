"use client";

import { useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, ChevronLeft, Check, Sparkles, Target, Clock, Zap, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
    const router = useRouter();
    const user = useQuery(api.users.viewer);
    const initializeUser = useMutation(api.users.initializeUser);
    const saveVisionProfile = useMutation(api.visionProfiles.saveVisionProfile);
    const updateSchedule = useMutation(api.schedules.updateSchedule);
    const completeOnboarding = useMutation(api.users.completeOnboarding);
    const triggerCall = useAction(api.vapi.triggerOutboundCall);

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Call Me Now State
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isCalling, setIsCalling] = useState(false);
    const [callStatus, setCallStatus] = useState<"idle" | "success" | "error">("idle");

    // Form State
    const [name, setName] = useState("");
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Los_Angeles");

    const [visionSummary, setVisionSummary] = useState("");
    const [motivation1, setMotivation1] = useState("");
    const [motivation2, setMotivation2] = useState("");
    const [costOfInaction, setCostOfInaction] = useState("");

    const [eveningTime, setEveningTime] = useState("17:00");
    const [coachingTone, setCoachingTone] = useState("supportive");

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleCallMe = async () => {
        if (!phoneNumber) return;
        setIsCalling(true);
        setCallStatus("idle");
        try {
            await triggerCall({ phone: phoneNumber, type: "onboarding-agent" });
            setCallStatus("success");
            // Optionally auto-advance or show instructions
        } catch (error) {
            console.error("Failed to trigger call:", error);
            setCallStatus("error");
        } finally {
            setIsCalling(false);
        }
    };

    const handleComplete = async () => {
        setIsLoading(true);
        try {
            // 1. Initialize User & Schedule
            await initializeUser({ name, timezone });

            // 2. Save Vision Profile
            await saveVisionProfile({
                visionSummary,
                motivations: [motivation1, motivation2].filter(Boolean),
                costOfInaction,
                commitmentDeclaration: "I am committed to my growth and daily execution.",
            });

            // 3. Update Schedule/Preferences
            await updateSchedule({
                eveningTime,
            });

            // 4. Mark as Onboarded
            await completeOnboarding();

            router.push("/dashboard");
        } catch (error) {
            console.error("Onboarding failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">What should I call you?</Label>
                                <Input
                                    id="name"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-12 text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Your Timezone</Label>
                                <Input
                                    id="timezone"
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="h-12"
                                />
                                <p className="text-xs text-muted-foreground">We use this to schedule your coaching calls.</p>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="vision">What is your primary vision for the next 6 months?</Label>
                                <Textarea
                                    id="vision"
                                    placeholder="e.g. Launch my SaaS, scale my agency to $20k/mo..."
                                    value={visionSummary}
                                    onChange={(e) => setVisionSummary(e.target.value)}
                                    className="min-h-[100px] text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>What are your top 2 motivations?</Label>
                                <Input
                                    placeholder="Motivation 1"
                                    value={motivation1}
                                    onChange={(e) => setMotivation1(e.target.value)}
                                    className="mb-2"
                                />
                                <Input
                                    placeholder="Motivation 2"
                                    value={motivation2}
                                    onChange={(e) => setMotivation2(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cost">What happens if you don't achieve this? (Cost of Inaction)</Label>
                                <Textarea
                                    id="cost"
                                    placeholder="e.g. I'll stay stuck in a job I hate, I'll let my team down..."
                                    value={costOfInaction}
                                    onChange={(e) => setCostOfInaction(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="eveningTime">When do you usually wrap up your workday?</Label>
                                <Input
                                    id="eveningTime"
                                    type="time"
                                    value={eveningTime}
                                    onChange={(e) => setEveningTime(e.target.value)}
                                    className="h-12 text-lg w-full"
                                />
                                <p className="text-xs text-muted-foreground">We'll schedule your daily recap call around this time.</p>
                            </div>
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Coaching Tone</Label>
                                        <p className="text-sm text-muted-foreground">Supportive vs. Direct & No-BS</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-xs font-medium", coachingTone === "supportive" ? "text-primary" : "text-muted-foreground")}>Supportive</span>
                                        <Switch
                                            checked={coachingTone === "direct"}
                                            onCheckedChange={(checked) => setCoachingTone(checked ? "direct" : "supportive")}
                                        />
                                        <span className={cn("text-xs font-medium", coachingTone === "direct" ? "text-primary" : "text-muted-foreground")}>Direct</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const steps = [
        { title: "Basics", icon: Zap },
        { title: "Vision", icon: Target },
        { title: "Plan", icon: Clock },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Header */}
                <div className="flex justify-between mb-8 px-2">
                    {steps.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                step > i + 1 ? "bg-primary text-primary-foreground" :
                                    step === i + 1 ? "bg-primary/20 text-primary border-2 border-primary" :
                                        "bg-muted text-muted-foreground"
                            )}>
                                {step > i + 1 ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                            </div>
                            <span className={cn("text-xs font-medium", step === i + 1 ? "text-primary" : "text-muted-foreground")}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Call Me Now Section */}
                <Card className="mb-8 border-primary/20 bg-primary/5 shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-primary/20">
                                <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold">Want to skip typing?</CardTitle>
                                <CardDescription>Get onboarded instantly with a 2-minute phone call.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="+1 (555) 000-0000"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="bg-background"
                            />
                            <Button
                                onClick={handleCallMe}
                                disabled={isCalling || !phoneNumber}
                                className="min-w-[120px]"
                            >
                                {isCalling ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Calling...
                                    </span>
                                ) : "Call Me Now"}
                            </Button>
                        </div>
                        {callStatus === "success" && (
                            <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                                <Check className="h-4 w-4" /> Calling you now! Pick up the phone.
                            </p>
                        )}
                        {callStatus === "error" && (
                            <p className="text-sm text-destructive font-medium">
                                Something went wrong. Please check the number or try again.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-8 pt-8 px-8">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            {step === 1 && <><Sparkles className="h-6 w-6 text-primary" /> Welcome to AI Coach</>}
                            {step === 2 && <><Target className="h-6 w-6 text-primary" /> Define Your North Star</>}
                            {step === 3 && <><Clock className="h-6 w-6 text-primary" /> Your Daily Anchor</>}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {step === 1 && "Let's start with the basics to get your account set up."}
                            {step === 2 && "The coach works best when it knows exactly where you're headed."}
                            {step === 3 && "We'll coordinate our calls around your actual work schedule."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        {renderStep()}
                    </CardContent>
                    <CardFooter className="p-8 bg-muted/30 border-t flex justify-between">
                        <Button
                            variant="ghost"
                            onClick={prevStep}
                            disabled={step === 1 || isLoading}
                            className="rounded-xl"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        {step < 3 ? (
                            <Button
                                onClick={nextStep}
                                className="rounded-xl px-8"
                            >
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleComplete}
                                disabled={isLoading || !visionSummary}
                                className="rounded-xl px-8"
                            >
                                {isLoading ? "Setting up..." : "Finish Onboarding"}
                                <Check className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
