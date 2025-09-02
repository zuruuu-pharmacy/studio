
import { BackButton } from "@/components/back-button";
import { LectureNotesClient } from "./lecture-notes-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

export default function LectureNotesPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Lecture Notes Library</h1>
        <p className="text-muted-foreground mb-6">
          Upload your lecture notes (image, PDF, etc.) to have the AI organize, summarize, and enhance them for you.
        </p>
         <Alert variant="destructive" className="mb-6">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>For Educational Use Only</AlertTitle>
            <AlertDescription>
                The AI-generated content is for study purposes and may contain inaccuracies. Always verify critical information with official academic sources.
            </AlertDescription>
        </Alert>
        <LectureNotesClient />
      </div>
  );
}
