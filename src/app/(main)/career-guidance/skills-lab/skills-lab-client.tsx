
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Target, GraduationCap, Construction, Sparkles } from "lucide-react";

export function SkillsLabClient() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ClipboardList/>Self-Assessment Quiz</CardTitle>
          <CardDescription>
            Answer a series of questions to benchmark your current knowledge and skills against industry standards.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                 <Button className="mt-4" disabled>Start Self-Assessment</Button>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target/>Skill Gap Report</CardTitle>
            <CardDescription>An AI-generated report highlighting your strengths and areas for improvement.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                <p className="text-muted-foreground">Complete the quiz to see your report.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GraduationCap/>Personalized Learning Plan</CardTitle>
            <CardDescription>Curated resources and tasks to help you close your skill gaps.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                <p className="text-muted-foreground">Your learning plan will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
