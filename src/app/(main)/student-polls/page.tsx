
import { BackButton } from "@/components/back-button";
import { StudentPollsClient } from "./student-polls-client";

export default function StudentPollsPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Student Polls &amp; Surveys</h1>
      <p className="text-muted-foreground mb-6">
        Participate in academic and community polls to share your opinion.
      </p>
      <StudentPollsClient />
    </div>
  );
}
