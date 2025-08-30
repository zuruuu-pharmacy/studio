
import { BackButton } from "@/components/back-button";
import { AdherenceTrackerClient } from "./adherence-tracker-client";

export default function AdherenceTrackerPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Adherence Tracker</h1>
        <p className="text-muted-foreground mb-6">
          Generate a weekly medication adherence report by providing your prescribed medications and doses taken.
        </p>
        <AdherenceTrackerClient />
      </div>
  );
}
