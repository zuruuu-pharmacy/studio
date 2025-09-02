
"use client";

import { BackButton } from "@/components/back-button";
import { InteractionClient } from "./interaction-client";

export default function InteractionCheckerPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Interaction Engine</h1>
        <p className="text-muted-foreground mb-6">
           Check for pairwise and multi-drug interactions, with severity, mechanism, and suggested actions. Drug-food interactions are also flagged.
        </p>
        <InteractionClient />
      </div>
  );
}
