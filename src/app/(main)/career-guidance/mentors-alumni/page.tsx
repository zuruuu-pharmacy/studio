
import { BackButton } from "@/components/back-button";
import { MentorsAlumniClient } from "./mentors-alumni-client";

export default function MentorsAlumniPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Mentors & Alumni Network</h1>
      <p className="text-muted-foreground mb-6">
        Connect with experienced professionals for guidance and inspiration.
      </p>
      <MentorsAlumniClient />
    </div>
  );
}
