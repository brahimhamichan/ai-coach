import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { CTASection } from "@/components/landing/CTASection";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            <LandingHeader />
            <HeroSection />
            <FeatureGrid />
            <CTASection />

            <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center text-sm text-slate-600">
                <p>© {new Date().getFullYear()} AI Coach. All rights reserved.</p>
            </footer>
        </main>
    );
}
