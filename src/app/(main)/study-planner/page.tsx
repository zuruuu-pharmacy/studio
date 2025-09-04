
import { BackButton } from "@/components/back-button";
import { StudyPlannerClient } from "./study-planner-client";

export default function StudyPlannerPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Study Planner</h1>
      <p className="text-muted-foreground mb-6">
        Generate a personalized weekly study timetable based on your subjects, timeline, and goals.
      </p>
      <StudyPlannerClient />
    </div>
  );
}
