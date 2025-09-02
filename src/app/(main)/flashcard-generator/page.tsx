
import { BackButton } from "@/components/back-button";
import { FlashcardGeneratorClient } from "./flashcard-generator-client";

export default function FlashcardGeneratorPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Flashcard Generator</h1>
      <p className="text-muted-foreground mb-6">
        Upload your lecture notes, and the AI will automatically create study flashcards for you.
      </p>
      <FlashcardGeneratorClient />
    </div>
  );
}
