
import { BackButton } from "@/components/back-button";
import { NotesOrganizerClient } from "./notes-organizer-client";

export default function NotesOrganizerPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Notes Organizer</h1>
        <p className="text-muted-foreground mb-6">
          A dedicated space to organize your personal study notes, materials, and resources.
        </p>
        <NotesOrganizerClient />
      </div>
  );
}
