import { Target, Compass, Zap, Shield, Sparkles, Smartphone } from "lucide-react";

const features = [
    {
        title: "Weekly Strategy",
        description: "Every Sunday, your AI calls to review the past week and plan the next. Set 3 key objectives and identify bottlenecks.",
        icon: Compass,
        color: "from-blue-400 to-cyan-400",
    },
    {
        title: "Daily Focus",
        description: "Start each day with a clear plan. Your AI helps you prioritize deep work and eliminate distractions.",
        icon: Target,
        color: "from-purple-400 to-pink-400",
    },
    {
        title: "Evening Reflection",
        description: "A quick check-in to log wins, misses, and clear your mind before sleep. Build momentum day by day.",
        icon: Sparkles,
        color: "from-amber-400 to-orange-400",
    },
    {
        title: "Voice First",
        description: "No more typing. Just talk. It feels like a real conversation with an empathetic, intelligent coach.",
        icon: UserVoiceIcon, // Custom or fallback
        color: "from-emerald-400 to-teal-400",
    },
    {
        title: "WhatsApp & SMS",
        description: "Get reminders and summaries right where you are. Your coach lives in your phone, not just a dashboard.",
        icon: Smartphone,
        color: "from-indigo-400 to-blue-400",
    },
    {
        title: "Private & Secure",
        description: "Your dreams and data are yours. We use enterprise-grade encryption and privacy-first AI models.",
        icon: Shield,
        color: "from-slate-400 to-gray-400",
    },
];

function UserVoiceIcon(props: any) {
    return <Zap {...props} />
}

export function FeatureGrid() {
    return (
        <section className="bg-slate-950 py-24 sm:py-32 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px]" />

            <div className="container mx-auto px-4 relative">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
                        A complete system for <br />
                        <span className="text-indigo-400">high performance</span>
                    </h2>
                    <p className="text-lg text-slate-400">
                        Automate your discipline with a suite of AI agents working 24/7 to keep you on track.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-slate-700 hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/10"
                        >
                            <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                <feature.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-white">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
