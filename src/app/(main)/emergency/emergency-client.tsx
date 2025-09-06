
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function EmergencyClient() {
  return (
    <Card className="text-center py-12">
        <CardHeader>
             <Construction className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
            <CardTitle>Feature Under Construction</CardTitle>
            <CardDescription>
                The Emergency Help module is currently being redeveloped to enhance its reliability and functionality.
            </CardDescription>
        </CardHeader>
    </Card>
  );
}
