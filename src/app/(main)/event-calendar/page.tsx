
import { BackButton } from "@/components/back-button";
import { EventCalendarClient } from "./event-calendar-client";

export default function EventCalendarPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Event Calendar</h1>
      <p className="text-muted-foreground mb-6">
        Keep track of your academic deadlines, campus activities, and personal study sessions.
      </p>
      <EventCalendarClient />
    </div>
  );
}
