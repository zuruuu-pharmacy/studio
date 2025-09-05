
import { BackButton } from "@/components/back-button";
import { PolicyAdminClient } from "./policy-admin-client";

export default function PolicyAdminPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Plagiarism Policy Management</h1>
      <p className="text-muted-foreground mb-6">
        Configure similarity thresholds, manage sources, and review flagged submissions.
      </p>
      <PolicyAdminClient />
    </div>
  );
}
