import { BackButton } from "@/components/back-button";
import { MonographClient } from "./monograph-client";

export default function MonographPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Drug Monograph Lookup</h1>
        <p className="text-muted-foreground mb-6">
          Enter a drug name to get a comprehensive monograph.
        </p>
        <MonographClient />
      </div>
  );
}
