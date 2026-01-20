import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white transition-opacity hover:opacity-90">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span>AI Coach</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        How It Works
                    </Link>
                    <Link href="#testimonials" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Testimonials
                    </Link>
                </nav>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="hidden text-sm font-medium text-slate-400 transition-colors hover:text-white sm:block"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-200"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
