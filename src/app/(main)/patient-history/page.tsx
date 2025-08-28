import { PatientHistoryClient } from "./patient-history-client";

export default function PatientHistoryPage() {
  return (
      <div>
        <h1 className="text-3xl font-bold mb-2 font-headline">Patient History</h1>
        <p className="text-muted-foreground mb-6">
          Enter the patient's history details here. This information will be used by the other AI tools.
        </p>
        <PatientHistoryClient />
      </div>
  );
}
