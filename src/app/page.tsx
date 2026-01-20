"use client";

// Force dynamic rendering - Convex queries run client-side
export const dynamic = "force-dynamic";

import { useQuery, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { VisionCard } from "@/components/VisionCard";
import { WeeklyCard } from "@/components/WeeklyCard";
import { TodayCard } from "@/components/TodayCard";
import { SummaryBanner } from "@/components/SummaryBanner";
import styles from "./page.module.css";

export default function Dashboard() {
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
    }
  }, [user, initializeUser]);

  // Fetch dashboard data 
  const vision = useQuery(api.visionProfiles.getVisionProfile);
  const weeklyObjective = useQuery(api.weeklyObjectives.getCurrentWeekObjective);
  const todayPlan = useQuery(api.dailyPlans.getTodayPlan);
  const tomorrowPlan = useQuery(api.dailyPlans.getTomorrowPlan);
  const latestSummary = useQuery(api.callSummaries.getLatestCallSummary);

  const isLoading = user === undefined;

  const nextCall = useQuery(api.callSessions.getNextCall);

  return (
    <div className={styles.page}>


      <main className={styles.main}>
        <header className={styles.header}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className={styles.title}>Dashboard</h1>
              <p className={styles.subtitle}>
                {getGreeting()}, let's make today count.
              </p>
            </div>
            {nextCall && (
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Next call</p>
                <p className="text-lg font-semibold text-primary">
                  {formatNextCallTime(nextCall.date)}
                </p>
              </div>
            )}
          </div>
        </header>

        {/* Summary Banner - only shows if summaries exist */}
        <SummaryBanner summary={latestSummary} />

        <div className={styles.grid}>
          {/* Vision Card - collapsed by default when empty */}
          <VisionCard vision={vision} isLoading={isLoading} />

          {/* Weekly Objective Card */}
          <WeeklyCard objective={weeklyObjective} isLoading={isLoading} />

          {/* Today/Tomorrow Actions Card */}
          <TodayCard
            todayPlan={todayPlan}
            tomorrowPlan={tomorrowPlan}
            isLoading={isLoading}
          />
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
