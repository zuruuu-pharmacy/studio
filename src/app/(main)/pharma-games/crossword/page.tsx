
import { BackButton } from "@/components/back-button";
import { CrosswordClient } from "./crossword-client";

export default function CrosswordPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Pharma Crossword</h1>
      <p className="text-muted-foreground mb-6">
        Test your knowledge by solving clues about drugs, mechanisms, and more.
      </p>
      <CrosswordClient />
    </div>
  );
}
