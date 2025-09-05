
import { BackButton } from "@/components/back-button";
import { PathologyClient } from "./pathology-client";

export default function PathologyPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Pathology Hub</h1>
      <p className="text-muted-foreground mb-6">
        Explore pathology resources, case studies, and virtual slides.
      </p>
      <PathologyClient />
    </div>
  );
}
