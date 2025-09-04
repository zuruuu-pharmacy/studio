
import { BackButton } from "@/components/back-button";
import { ReferenceGeneratorClient } from "./reference-generator-client";

export default function ReferenceGeneratorPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Reference & Citation Generator</h1>
      <p className="text-muted-foreground mb-6">
        Provide a piece of text and select a style to generate an appropriate academic citation.
      </p>
      <ReferenceGeneratorClient />
    </div>
  );
}
