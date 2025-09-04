
import { BackButton } from "@/components/back-button";
import { SkillsLabClient } from "./skills-lab-client";

export default function SkillsLabPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Skills Lab</h1>
      <p className="text-muted-foreground mb-6">
        Assess your current skills, identify gaps, and get a personalized plan to level up.
      </p>
      <SkillsLabClient />
    </div>
  );
}
