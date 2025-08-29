import { BackButton } from "@/components/back-button";
import { AllergyClient } from "./allergy-client";

export default function AllergyCheckerPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Allergy Checker</h1>
        <p className="text-muted-foreground mb-6">
          Detect potential allergies and cross-reactivity risks for a given medication.
        </p>
        <AllergyClient />
      </div>
  );
}
