
import { BackButton } from "@/components/back-button";
import { OsceVivaPrepClient } from "./osce-viva-prep-client";

export default function OsceVivaPrepPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">OSCE and Viva Preparation</h1>
      <p className="text-muted-foreground mb-6">
        Practice for your exams with AI-driven OSCE and viva scenarios. Enter a topic to start a station.
      </p>
      <OsceVivaPrepClient />
    </div>
  );
}
