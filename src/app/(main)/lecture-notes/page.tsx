
import { BackButton } from "@/components/back-button";
import { LectureNotesClient } from "./lecture-notes-client";

export default function LectureNotesPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Lecture Notes Library</h1>
        <p className="text-muted-foreground mb-6">
          Browse and download study materials. Teachers can upload new content using an access code.
        </p>
        <LectureNotesClient />
      </div>
  );
}
