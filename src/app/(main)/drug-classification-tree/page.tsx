
import { BackButton } from "@/components/back-button";
import { DrugClassificationTreeClient } from "./drug-classification-tree-client";

export default function DrugClassificationTreePage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Interactive Drug Classification Tree</h1>
      <p className="text-muted-foreground mb-6">
        Visually explore pharmacology by navigating through an interactive classification tree.
      </p>
      <DrugClassificationTreeClient />
    </div>
  );
}
