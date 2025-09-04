
import { BackButton } from "@/components/back-button";
import { DoseCalculatorClient } from "../dose-calculator-client";

export default function BasicDoseCalculatorPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Basic Dose Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Calculate dosages based on patient weight and age for various indications.
        </p>
        <DoseCalculatorClient />
      </div>
  );
}
