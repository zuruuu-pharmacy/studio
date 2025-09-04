
import { BackButton } from "@/components/back-button";
import { CvInterviewToolkitClient } from "./cv-interview-toolkit-client";

export default function CvInterviewToolkitPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">CV & Interview Toolkit</h1>
      <p className="text-muted-foreground mb-6">
        Build your pharmacy-specific CV, generate cover letters, and practice for interviews.
      </p>
      <CvInterviewToolkitClient />
    </div>
  );
}
