import { BackButton } from "@/components/back-button";
import { PatientHistoryClient } from "./patient-history-client";

export default function PatientHistoryPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Patient History</h1>
        <p className="text-muted-foreground mb-6">
          This information will be used by the other AI tools. Saved notes from the Symptom Checker will appear here.
        </p>
        <PatientHistoryClient />
      </div>
  );
}
