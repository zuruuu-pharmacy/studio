
import { BackButton } from "@/components/back-button";
import { StudyMaterialGeneratorClient } from "./study-material-generator-client";

export default function StudyMaterialGeneratorPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">AI Study Material Generator</h1>
      <p className="text-muted-foreground mb-6">
        Enter any topic to generate a comprehensive study guide, complete with a case study and quiz.
      </p>
      <StudyMaterialGeneratorClient />
    </div>
  );
}
