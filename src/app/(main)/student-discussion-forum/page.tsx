
import { BackButton } from "@/components/back-button";
import { StudentDiscussionForumClient } from "./student-discussion-forum-client";

export default function StudentDiscussionForumPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Student Discussion Forum</h1>
      <p className="text-muted-foreground mb-6">
        Ask questions, share insights, and collaborate with your peers.
      </p>
      <StudentDiscussionForumClient />
    </div>
  );
}
