
import { BackButton } from "@/components/back-button";
import { PharmaGamesClient } from "./pharma-games-client";

export default function PharmaGamesPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Pharma Games & Puzzles</h1>
      <p className="text-muted-foreground mb-6">
        Learn key pharmacy concepts in a fun and interactive way.
      </p>
      <PharmaGamesClient />
    </div>
  );
}
