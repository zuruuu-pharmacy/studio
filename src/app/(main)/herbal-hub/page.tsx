
import { BackButton } from "@/components/back-button";
import { HerbalHubClient } from "./herbal-hub-client";

export default function HerbalHubPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Herbal & Natural Products Knowledge Hub</h1>
      <p className="text-muted-foreground mb-6">
        An AI-powered pharmaco-botanical encyclopedia. Search for a plant to get started.
      </p>
      <HerbalHubClient />
    </div>
  );
}
