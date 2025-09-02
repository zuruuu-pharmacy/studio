
import { BackButton } from "@/components/back-button";
import { SopGeneratorClient } from "./sop-generator-client";

export default function SopRepositoryPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Digital SOP Repository</h1>
      <p className="text-muted-foreground mb-6">
        Enter an experiment title to generate a complete, academically accurate Standard Operating Procedure.
      </p>
      <SopGeneratorClient />
    </div>
  );
}
