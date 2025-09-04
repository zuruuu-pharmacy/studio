
import { BackButton } from "@/components/back-button";
import { LicensingExamsClient } from "./licensing-exams-client";

export default function LicensingExamsPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Licensing & International Exams Hub</h1>
      <p className="text-muted-foreground mb-6">
        Explore pathways to practice pharmacy in different countries.
      </p>
      <LicensingExamsClient />
    </div>
  );
}
