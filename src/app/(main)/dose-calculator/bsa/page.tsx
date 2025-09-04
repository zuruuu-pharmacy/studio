
import { BackButton } from "@/components/back-button";
import { BsaDoseCalculatorClient } from "./bsa-dose-calculator-client";

export default function BsaDoseCalculatorPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">BSA Dose Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Calculate dosages based on Body Surface Area using the Mosteller formula.
        </p>
        <BsaDoseCalculatorClient />
      </div>
  );
}
