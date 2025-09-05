
import { BackButton } from "@/components/back-button";
import { TextToSpeechClient } from "./text-to-speech-client";

export default function TextToSpeechPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Text-to-Speech</h1>
      <p className="text-muted-foreground mb-6">
        Paste any text to have it read aloud by the AI.
      </p>
      <TextToSpeechClient />
    </div>
  );
}
