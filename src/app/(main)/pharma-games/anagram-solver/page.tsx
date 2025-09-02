
import { BackButton } from "@/components/back-button";
import { AnagramSolverClient } from "./anagram-solver-client";

export default function AnagramSolverPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Anagram Solver Game</h1>
      <p className="text-muted-foreground mb-6">
        Unscramble the letters to reveal the drug name. Enter a topic to begin!
      </p>
      <AnagramSolverClient />
    </div>
  );
}
