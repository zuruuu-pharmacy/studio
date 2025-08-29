import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function EmergencyPage() {
  return (
    <div>
        <BackButton />
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
                <CardTitle className="text-3xl font-bold text-destructive">Emergency</CardTitle>
                <CardDescription className="text-lg">This feature is coming soon.</CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    In a real medical emergency, please call your local emergency services immediately.
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
