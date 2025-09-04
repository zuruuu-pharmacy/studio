
import { BackButton } from "@/components/back-button";
import { JobsInternshipsClient } from "./jobs-internships-client";

export default function JobsInternshipsPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Jobs & Internships Board</h1>
      <p className="text-muted-foreground mb-6">
        Find verified roles from hospitals, industry, and research institutions.
      </p>
      <JobsInternshipsClient />
    </div>
  );
}
