
import { BackButton } from "@/components/back-button";
import { RoadmapBuilderClient } from "./roadmap-builder-client";

export default function RoadmapBuilderPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Career Roadmap Builder</h1>
      <p className="text-muted-foreground mb-6">
        Build your personalized career timeline, add milestones, and get AI suggestions.
      </p>
      <RoadmapBuilderClient />
    </div>
  );
}
