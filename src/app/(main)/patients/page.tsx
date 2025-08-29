import { BackButton } from "@/components/back-button";
import { PatientsClient } from "./patients-client";

export default function PatientsPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Patient Management</h1>
        <p className="text-muted-foreground mb-6">
          Search for existing patients or add a new one. Select a patient to make them active across all tools.
        </p>
        <PatientsClient />
      </div>
  );
}
