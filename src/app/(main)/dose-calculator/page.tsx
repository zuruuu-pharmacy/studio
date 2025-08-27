import { DoseCalculatorClient } from "./dose-calculator-client";
import { AppShell } from "@/components/app-shell";

export default function DoseCalculatorPage() {
  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Dose Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Calculate dosages based on patient-specific factors.
        </p>
        <DoseCalculatorClient />
      </div>
    </AppShell>
  );
}
