
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function StudentPollsClient() {
  return (
    <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-6 bg-muted/50">
        <Construction className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-2xl font-semibold text-muted-foreground">Feature Under Construction</h3>
        <p className="text-muted-foreground/80 mt-2 max-w-md">
            The Student Polls & Surveys feature is currently in development. Soon, you'll be able to create and participate in polls here!
        </p>
    </Card>
  );
}
