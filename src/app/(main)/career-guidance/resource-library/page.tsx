
import { BackButton } from "@/components/back-button";
import { ResourceLibraryClient } from "./resource-library-client";

export default function ResourceLibraryPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Interview Resource Library</h1>
      <p className="text-muted-foreground mb-6">
        A curated collection of questions and checklists to help you prepare.
      </p>
      <ResourceLibraryClient />
    </div>
  );
}
