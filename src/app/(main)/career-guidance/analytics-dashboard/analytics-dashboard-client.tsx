
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, Briefcase, CheckCircle, Construction, Lightbulb, Target } from "lucide-react";

export function AnalyticsDashboardClient() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Career Readiness</CardTitle>
          <CardDescription>Target Role: Clinical Research Associate</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                 <p className="text-muted-foreground/80 mt-2">
                    A personalized analytics dashboard is coming soon to track your progress.
                 </p>
            </div>
        </CardContent>
      </Card>

       <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Target /> Roadmap Progress</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground text-center py-4">Coming Soon</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle /> Skills Improved</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground text-center py-4">Coming Soon</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase /> Job Applications</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground text-center py-4">Coming Soon</p></CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb /> AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
            <Alert>
                <AlertTitle>Example Recommendation</AlertTitle>
                <AlertDescription>
                    You’re 80% ready for a hospital residency; complete one more clinical rotation and pass this certification to be fully prepared.
                </AlertDescription>
            </Alert>
        </CardContent>
       </Card>
    </div>
  );
}
