
import { BackButton } from "@/components/back-button";
import { AnalyticsDashboardClient } from "./analytics-dashboard-client";

export default function AnalyticsDashboardPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Analytics & Progress Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Track your career readiness, view AI-powered recommendations, and see your progress at a glance.
      </p>
      <AnalyticsDashboardClient />
    </div>
  );
}
