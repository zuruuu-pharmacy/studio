
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function EmergencyPage() {
  return (
    <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Emergency Help</h1>
        <p className="text-muted-foreground mb-6">
          This feature provides critical information and actions in an emergency.
        </p>
        <Card className="text-center">
            <CardHeader>
                 <AlertCircle className="mx-auto h-16 w-16 text-primary mb-4" />
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                    The emergency assistance feature is currently under development.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">This feature will provide quick access to your medical summary and contact options for emergency services.</p>
            </CardContent>
        </Card>
    </div>
  );
}
