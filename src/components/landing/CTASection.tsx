import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-24">
            <div className="absolute inset-0 bg-indigo-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-slate-950 to-slate-950" />

            <div className="container relative mx-auto px-4 text-center">
                <div className="mx-auto max-w-3xl rounded-3xl border border-indigo-500/30 bg-indigo-900/10 p-12 backdrop-blur-sm lg:p-20">
                    <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                        Ready to upgrade your life?
                    </h2>
                    <p className="mb-10 text-lg text-slate-300">
                        Join the beta today and start achieving your goals with the power of voice AI.
                        No credit card required for the first 14 days.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-sm font-bold text-indigo-950 shadow-lg transition-all hover:bg-indigo-50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-900"
                        >
                            Get Started Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-slate-500">
                        Limited spots available for the beta program.
                    </p>
                </div>
            </div>
        </section>
    );
}
