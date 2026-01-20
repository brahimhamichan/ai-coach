"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
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
    const [error, setError] = useState<string | null>(null);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await signIn("password", { email, password, flow: "signIn" });
            router.push("/");
            router.refresh();
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.message || "";
            if (errorMessage.includes("InvalidSecret") || errorMessage.includes("InvalidAccountId")) {
                setError("Invalid email or password.");
            } else {
                setError("Login failed. Please check your credentials.");
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
