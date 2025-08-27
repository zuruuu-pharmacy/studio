import { PrescriptionReaderClient } from "./prescription-reader-client";
import { AppShell } from "@/components/app-shell";

export default function PrescriptionReaderPage() {
  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Prescription Reader</h1>
        <p className="text-muted-foreground mb-6">
          Upload a picture of a prescription to have the AI read and analyze it for you.
        </p>
        <PrescriptionReaderClient />
      </div>
    </AppShell>
  );
}
