
import { BackButton } from "@/components/back-button";
import { RapidFireQuizClient } from "./rapid-fire-quiz-client";

export default function RapidFireQuizPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Rapid Fire Quiz</h1>
      <p className="text-muted-foreground mb-6">
        Answer as many questions as you can before the timer runs out!
      </p>
      <RapidFireQuizClient />
    </div>
  );
}
