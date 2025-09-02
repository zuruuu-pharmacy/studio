
import { BackButton } from "@/components/back-button";
import { FlashPuzzleClient } from "./flash-puzzle-client";

export default function FlashPuzzlePage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Flash Puzzle: Matching Game</h1>
      <p className="text-muted-foreground mb-6">
        Match the items from each column correctly to test your knowledge. Enter a topic to begin!
      </p>
      <FlashPuzzleClient />
    </div>
  );
}
