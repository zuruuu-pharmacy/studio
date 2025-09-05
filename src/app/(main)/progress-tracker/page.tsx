
import { BackButton } from "@/components/back-button";
import { ProgressTrackerClient } from "./progress-tracker-client";

export default function ProgressTrackerPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Analytics Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Track your career readiness, view AI-powered recommendations, and see your progress at a glance.
      </p>
      <ProgressTrackerClient />
    </div>
  );
}
