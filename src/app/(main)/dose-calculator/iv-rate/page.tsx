
import { BackButton } from "@/components/back-button";
import { Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function IvRateCalculatorPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">IV Infusion Rate Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Calculate mL/hr, drops/min, and other infusion-related values.
        </p>
        <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-6 bg-muted/50">
            <Construction className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-2xl font-semibold text-muted-foreground">Feature Under Construction</h3>
            <p className="text-muted-foreground/80 mt-2 max-w-md">
                This calculator is currently in development and will be available soon.
            </p>
        </Card>
      </div>
  );
}
