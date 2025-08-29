
import { AiAssistantClient } from "./ai-assistant-client";

export default function AiAssistantPage() {
  return (
      <div>
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Assistant</h1>
        <p className="text-muted-foreground mb-6">
          Ask any questions you have. The AI is here to help.
        </p>
        <AiAssistantClient />
      </div>
  );
}
