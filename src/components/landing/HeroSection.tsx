import Link from "next/link";
import { ArrowRight, Mic, CheckCircle } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-slate-950 pt-16 pb-32 lg:pt-32 lg:pb-48">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 opacity-70" />

            <div className="container relative mx-auto px-4 text-center">
                <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse" />
                    AI-Powered Accountability
                </div>

                <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    Achieve your goals with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Voice AI Coaching
                    </span>
                </h1>

                <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    The first AI coach that actually speaks to you. Plan your week, review your days, and stay accountable with personalized voice calls.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        Start For Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 px-8 py-4 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        Log In
                    </Link>
                </div>

                {/* Abstract Visual Placeholder */}
                <div className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-1000 delay-500">
                    <div className="aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900/20 via-slate-900 to-purple-900/20 flex items-center justify-center relative">
                        {/* This will be replaced by generated image */}
                        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-20"></div>
                        <div className="text-slate-500 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 animate-pulse">
                                <Mic className="h-10 w-10 text-indigo-400" />
                            </div>
                            <p className="text-sm font-medium tracking-widest uppercase opacity-50">AI Voice Interface</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
