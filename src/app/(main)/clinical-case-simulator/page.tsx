
import { BackButton } from "@/components/back-button";
import { ClinicalCaseSimulatorClient } from "./clinical-case-simulator-client";

export default function ClinicalCaseSimulatorPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Clinical Case Simulator</h1>
      <p className="text-muted-foreground mb-6">
        Tackle realistic patient cases and get AI-driven feedback on your clinical reasoning.
      </p>
      <ClinicalCaseSimulatorClient />
    </div>
  );
}
