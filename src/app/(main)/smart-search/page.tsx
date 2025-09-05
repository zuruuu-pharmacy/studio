
import { BackButton } from "@/components/back-button";
import { SmartSearchClient } from "./smart-search-client";

export default function SmartSearchPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Smart Search</h1>
      <p className="text-muted-foreground mb-6">
        Search for drugs, diseases, topics, and more across the entire Zuruu AI portal.
      </p>
      <SmartSearchClient />
    </div>
  );
}
