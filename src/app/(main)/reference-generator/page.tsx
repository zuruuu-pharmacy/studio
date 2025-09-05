
import { BackButton } from "@/components/back-button";
import { ReferenceGeneratorClient } from "./reference-generator-client";

export default function ReferenceGeneratorPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Reference & Citation Formatter</h1>
      <p className="text-muted-foreground mb-6">
        Paste in a single citation or an entire bibliography to have the AI find and format it in your chosen style.
      </p>
      <ReferenceGeneratorClient />
    </div>
  );
}
