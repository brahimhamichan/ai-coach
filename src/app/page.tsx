"use client";

// Force dynamic rendering - Convex queries run client-side
export const dynamic = "force-dynamic";

import { useQuery, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { Navigation } from "@/components/Navigation";
import { VisionCard } from "@/components/VisionCard";
import { WeeklyCard } from "@/components/WeeklyCard";
import { TodayCard } from "@/components/TodayCard";
import { SummaryBanner } from "@/components/SummaryBanner";
import styles from "./page.module.css";

export default function Dashboard() {
  // Get or create stub user
  const user = useQuery(api.users.getStubUser);
  const createUser = useMutation(api.users.createStubUser);

  // Create stub user on first load if needed
  useEffect(() => {
    if (user === null) {
      createUser({
        phone: "+1234567890",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  }, [user, createUser]);

  // Fetch dashboard data (only when user exists)
  const vision = useQuery(
    api.visionProfiles.getVisionProfile,
    user ? { userId: user._id } : "skip"
  );
  const weeklyObjective = useQuery(
    api.weeklyObjectives.getCurrentWeekObjective,
    user ? { userId: user._id } : "skip"
  );
  const todayPlan = useQuery(
    api.dailyPlans.getTodayPlan,
    user ? { userId: user._id } : "skip"
  );
  const tomorrowPlan = useQuery(
    api.dailyPlans.getTomorrowPlan,
    user ? { userId: user._id } : "skip"
  );
  const latestSummary = useQuery(
    api.callSummaries.getLatestCallSummary,
    user ? { userId: user._id } : "skip"
  );

  const isLoading = user === undefined;

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            {getGreeting()}, let's make today count.
          </p>
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
