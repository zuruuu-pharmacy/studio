
import { BackButton } from "@/components/back-button";
import { ELibraryClient } from "./e-library-client";

export default function ELibraryPage() {
  return (
    <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">AI E-Library</h1>
        <p className="text-muted-foreground mb-6">
          Search for any medical or pharmaceutical term to get an instant, AI-powered definition, examples, and more.
        </p>
        <ELibraryClient />
    </div>
  );
}
