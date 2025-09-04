
import { BackButton } from "@/components/back-button";
import { CoverLetterGeneratorClient } from "./cover-letter-generator-client";

export default function CoverLetterGeneratorPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Cover Letter Generator</h1>
      <p className="text-muted-foreground mb-6">
        Provide a few key details to generate a draft cover letter for a pharmacy role.
      </p>
      <CoverLetterGeneratorClient />
    </div>
  );
}
