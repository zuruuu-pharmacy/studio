
import { BackButton } from "@/components/back-button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Siren } from "lucide-react";

export default function EmergencyPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Emergency Help</h1>
        <p className="text-muted-foreground mb-6">
          This feature provides critical information and actions in an emergency.
        </p>
        <Card className="mt-6 text-center">
            <CardHeader>
                <Siren className="h-12 w-12 mx-auto text-destructive"/>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>The Emergency feature is currently under development.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This feature will provide one-tap access to emergency services and your critical medical information.</p>
            </CardContent>
        </Card>
      </div>
  );
}
