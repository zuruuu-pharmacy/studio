
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, CheckCircle, Lightbulb, Target } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

export function ProgressTrackerClient() {
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
            <p className="text-sm text-muted-foreground">1 of 3 roadmaps active.</p>
            <p className="text-sm text-muted-foreground">6 of 10 milestones completed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle /> Skills & Certs</CardTitle>
              <Progress value={75} className="mt-2"/>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">3 of 4 core skills acquired.</p>
             <p className="text-sm text-muted-foreground">1 of 2 certifications in progress.</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase />Application Funnel</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow><TableCell>Applied</TableCell><TableCell className="text-right font-bold">5</TableCell></TableRow>
                        <TableRow><TableCell>Interviews</TableCell><TableCell className="text-right font-bold">2</TableCell></TableRow>
                        <TableRow><TableCell>Offers</TableCell><TableCell className="text-right font-bold">1</TableCell></TableRow>
                    </TableBody>
                </Table>
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
    </div>
  );
}
