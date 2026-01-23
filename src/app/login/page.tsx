"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, AlertCircle, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { signIn } = useAuthActions();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const seedDemoData = useMutation(api.demo.seedDemoData);

    const handleDemoLogin = async () => {
        setIsDemoLoading(true);
        setError(null);
        try {
            await signIn("password", { email: "demo@example.com", password: "demo-password", flow: "signIn" });
            try {
                await seedDemoData();
            } catch (seedError) {
                console.error("Failed to seed demo data:", seedError);
            }
            router.push("/");
            router.refresh();
        } catch (signInError: any) {
            console.log("Demo sign-in failed, trying sign-up:", signInError);
            try {
                // If sign-in fails, try to create the demo account
                await signIn("password", { email: "demo@example.com", password: "demo-password", flow: "signUp", name: "Demo User" });
                try {
                    await seedDemoData();
                } catch (seedError) {
                    console.error("Failed to seed demo data:", seedError);
                }
                router.push("/");
                router.refresh();
            } catch (signUpError: any) {
                console.error("Demo login error:", signUpError);
                setError("Failed to start demo. Please try again.");
            }
        } finally {
            setIsDemoLoading(false);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await signIn("password", { email, password, flow: "signIn" });
            router.push("/");
            router.refresh();
        } catch (error: any) {
            console.error("Login error:", error);
            const errorMessage = error.message || "";
            if (errorMessage.includes("InvalidSecret") || errorMessage.includes("InvalidAccountId")) {
                setError("Invalid email or password. If you don't have an account, please sign up.");
            } else {
                setError("Login failed. Please try again or contact support.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] dark:bg-[#09090b] p-4 font-sans">
            <div className="w-full max-w-[440px] space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300">
                        <Image
                            src="/logo.svg"
                            alt="AI Coach logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Welcome back
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Log in to continue your progress.
                        </p>
                    </div>
                </div>

                <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all duration-300">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl flex items-center gap-3 text-sm bg-destructive/10 text-destructive border border-destructive/20">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full h-14 text-lg font-medium rounded-2xl border-border/50 hover:bg-muted/50 transition-all"
                            onClick={() => void signIn("google", { redirectTo: "/" })}
                        >
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#fafafa] dark:bg-[#09090b] px-2 text-muted-foreground">
                                    Or continue with email
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium pl-1">
                                Email address
                            </label>
                            <div className="relative group">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="h-14 pl-12 pr-4 text-lg bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all duration-200"
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium pl-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="h-14 pl-12 pr-4 text-lg bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all duration-200"
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Sign In <ArrowRight className="h-5 w-5" />
                                </span>
                            )}
                        </Button>

                        <div className="pt-2 text-center">
                            <p className="text-sm text-muted-foreground">
                                New here?{" "}
                                <Link href="/signup" className="font-semibold text-primary hover:underline transition-all">
                                    Create an account
                                </Link>
                            </p>
                            <div className="mt-6 md:mt-8">
                                <button
                                    type="button"
                                    onClick={handleDemoLogin}
                                    disabled={isLoading || isDemoLoading}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto group"
                                >
                                    Skip login and{" "}
                                    <span className="font-semibold underline underline-offset-4 decoration-primary/30 group-hover:decoration-primary transition-all">
                                        Start Demo
                                    </span>
                                    {isDemoLoading && (
                                        <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="text-center space-y-4 pt-4">
                    <p className="text-[12px] text-muted-foreground leading-relaxed px-8">
                        The AI Coach will never share your personal data without your consent.
                        Read our <Link href="/privacy" className="underline hover:text-primary underline-offset-4">Privacy Promise</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
