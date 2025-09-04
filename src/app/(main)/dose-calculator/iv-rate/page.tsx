
import { BackButton } from "@/components/back-button";
import { IvRateCalculatorClient } from "./iv-rate-calculator-client";

export default function IvRateCalculatorPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">IV Infusion Rate Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Calculate mL/hr and drops/min for IV infusions, with full step-by-step working.
        </p>
        <IvRateCalculatorClient />
      </div>
  );
}
