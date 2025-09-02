
import { BackButton } from "@/components/back-button";
import { WordSearchClient } from "./word-search-client";

export default function WordSearchPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Pharma Word Search</h1>
      <p className="text-muted-foreground mb-6">
        Find the hidden words in the grid. Enter a topic to begin!
      </p>
      <WordSearchClient />
    </div>
  );
}
