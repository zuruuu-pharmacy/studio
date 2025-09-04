
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
        <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="text-7xl font-bold text-primary">82%</div>
            <p className="text-muted-foreground mb-4">Readiness Score</p>
            <Progress value={82} className="w-full max-w-sm" />
             <p className="text-xs text-muted-foreground mt-2">Based on your completed milestones and skills.</p>
        </CardContent>
      </Card>

       <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target /> Roadmap Progress</CardTitle>
              <Progress value={60} className="mt-2"/>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">6 of 10 milestones completed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle /> Skills Improved</CardTitle>
              <Progress value={75} className="mt-2"/>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">3 of 4 core skills for target role acquired.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Briefcase /> Job Applications</CardTitle>
              <p className="text-2xl font-bold mt-2">3</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">1 interview scheduled.</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb /> AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
            <Alert>
                <AlertTitle className="font-bold">Next Steps</AlertTitle>
                <AlertDescription>
                    You’re 80% ready for a hospital residency; complete one more clinical rotation and pass the BCPS certification to be fully prepared.
                </AlertDescription>
            </Alert>
        </CardContent>
       </Card>
       
       <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart/> Cohort Analytics (Anonymized)</CardTitle>
            <CardDescription>How you compare to your peers.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                 <p className="text-muted-foreground/80 mt-2">
                    Cohort analytics are coming soon.
                 </p>
            </div>
         </CardContent>
       </Card>
    </div>
  );
}
