
import { BackButton } from "@/components/back-button";
import { EmergencyClient } from "./emergency-client";


export default function EmergencyPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Emergency Help</h1>
        <p className="text-muted-foreground mb-6">
          This feature provides critical information and actions in an emergency.
        </p>
        <EmergencyClient />
      </div>
  );
}
