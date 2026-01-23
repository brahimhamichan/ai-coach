"use client";

// Force dynamic rendering - Convex queries run client-side
export const dynamic = "force-dynamic";

import { useQuery, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { VisionCard } from "@/components/VisionCard";
import { WeeklyCard } from "@/components/WeeklyCard";
import { TodayCard } from "@/components/TodayCard";
import { SummaryBanner } from "@/components/SummaryBanner";

export default function Dashboard() {
  const router = useRouter();
  // Get authenticated user
  const user = useQuery(api.users.viewer);
  // Initialize user if needed (creates schedule etc)
  const initializeUser = useMutation(api.users.initializeUser);

  // Initialize user on load if logged in
  useEffect(() => {
    if (user) {
      // We can call this optimistically; it handles idempotency.
      // We pass timezone to ensure it's set.
      initializeUser({
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      // Redirect if not onboarded
      if (user.onboarded === false || user.onboarded === undefined) {
        router.push("/onboarding");
      }
    }
  }, [user, initializeUser, router]);

  // Fetch dashboard data
  const vision = useQuery(api.visionProfiles.getVisionProfile);
  const weeklyObjective = useQuery(api.weeklyObjectives.getCurrentWeekObjective);
  const todayPlan = useQuery(api.dailyPlans.getTodayPlan);
  const tomorrowPlan = useQuery(api.dailyPlans.getTomorrowPlan);
  const latestSummary = useQuery(api.callSummaries.getLatestCallSummary);

  const isLoading = user === undefined;

  const nextCall = useQuery(api.callSessions.getNextCall);

  return (
    <div className="min-h-screen bg-background pb-12">
      <main className="container mx-auto px-4 pt-6 md:pt-10 max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {getGreeting()}, let's make today count.
            </p>
          </div>
          {nextCall && (
            <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2 shadow-sm md:flex-col md:items-end md:border-none md:bg-transparent md:p-0 md:shadow-none">
              <p className="text-sm font-medium text-muted-foreground">Next call</p>
              <p className="text-lg font-semibold text-primary">
                {formatNextCallTime(nextCall.date)}
              </p>
            </div>
          )}
        </header>

        {/* Summary Banner - only shows if summaries exist */}
        <div className="mb-8">
          <SummaryBanner summary={latestSummary} />
        </div>

        <div className="grid gap-6 md:grid-cols-12 md:gap-8">
          {/* Main Content Area - Left Column */}
          <div className="flex flex-col gap-6 md:col-span-8">
            {/* Weekly Objective Card */}
            <WeeklyCard objective={weeklyObjective} isLoading={isLoading} />

            {/* Today/Tomorrow Actions Card */}
            <TodayCard
              todayPlan={todayPlan}
              tomorrowPlan={tomorrowPlan}
              isLoading={isLoading}
            />
          </div>

          {/* Sidebar Area - Right Column */}
          <div className="flex flex-col gap-6 md:col-span-4">
            {/* Vision Card - Sticky on desktop */}
            <div className="sticky top-24">
              <VisionCard vision={vision} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatNextCallTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) return "Ready now";

  if (diffHours < 1) {
    const minutes = Math.ceil(diffMs / (1000 * 60));
    return `in ${minutes} mins`;
  }

  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return `Today at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }

  // Check for tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth()) {
    return `Tomorrow at ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }

  // Otherwise day name
  const dayName = date.toLocaleDateString([], { weekday: 'long' });
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${dayName} at ${time}`;
}
