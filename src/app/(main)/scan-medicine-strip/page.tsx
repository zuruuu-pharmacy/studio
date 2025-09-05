
import { BackButton } from "@/components/back-button";
import { ScanMedicineStripClient } from "./scan-medicine-strip-client";

export default function ScanMedicineStripPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AR Medicine Scanner</h1>
      <p className="text-muted-foreground mb-6">
        Point your camera at a medicine strip to identify the drug and get instant information.
      </p>
      <ScanMedicineStripClient />
    </div>
  );
}

    