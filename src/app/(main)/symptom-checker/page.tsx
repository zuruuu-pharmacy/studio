
import { BackButton } from "@/components/back-button";
import { SymptomCheckerClient } from "./symptom-checker-client";

export default function SymptomCheckerPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Symptom Checker</h1>
        <p className="text-muted-foreground mb-6">
          Describe your symptoms, and the AI will ask follow-up questions to provide a potential analysis.
        </p>
        <SymptomCheckerClient />
      </div>
  );
}
