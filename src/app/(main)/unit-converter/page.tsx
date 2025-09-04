
import { BackButton } from "@/components/back-button";
import { UnitConverterClient } from "./unit-converter-client";

export default function UnitConverterPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Unit Converter</h1>
      <p className="text-muted-foreground mb-6">
        A simple tool for common clinical unit conversions.
      </p>
      <UnitConverterClient />
    </div>
  );
}
