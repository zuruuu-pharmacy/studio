
import { BackButton } from "@/components/back-button";
import { CompoundingCalculatorClient } from "./compounding-calculator-client";

export default function CompoundingCalculatorPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Compounding Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Calculate the amount of solute required to prepare solutions of a specific percentage strength (%w/v, %v/v, %w/w).
        </p>
        <CompoundingCalculatorClient />
      </div>
  );
}
