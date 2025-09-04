
import { BackButton } from "@/components/back-button";
import { CertificationsLibraryClient } from "./certifications-library-client";

export default function CertificationsLibraryPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Certifications Library</h1>
      <p className="text-muted-foreground mb-6">
        Explore and compare professional certifications to advance your career.
      </p>
      <CertificationsLibraryClient />
    </div>
  );
}
