
import { BackButton } from "@/components/back-button";
import { MnemonicGeneratorClient } from "./mnemonic-generator-client";

export default function MnemonicGeneratorPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Mnemonic Generator</h1>
      <p className="text-muted-foreground mb-6">
        Generate memorable Roman Urdu mnemonics for any medical topic to help with your studies.
      </p>
      <MnemonicGeneratorClient />
    </div>
  );
}
