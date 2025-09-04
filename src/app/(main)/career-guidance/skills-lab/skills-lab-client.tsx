
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Target, GraduationCap, Construction, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function SkillsLabClient() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ClipboardList/>Self-Assessment Quiz</CardTitle>
          <CardDescription>
            Take our comprehensive self-assessment to discover your strengths, identify skill gaps, and receive personalized career path recommendations. The quiz covers your interests, skills, and work preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                 <p className="text-muted-foreground/80 mt-2 max-w-md">The interactive quiz is currently in development. Once available, it will take approximately 45-60 minutes to complete.</p>
                 <Button className="mt-4" disabled>Start Self-Assessment</Button>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target/>Your Career Fit Report</CardTitle>
            <CardDescription>An AI-generated report based on your assessment results.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <Alert>
                  <AlertTitle className="font-bold">Top Recommended Path: Clinical Pharmacy (85% Match)</AlertTitle>
                  <AlertDescription>
                    You’re suited for clinical pharmacy because you score high on patient empathy and clinical reasoning, but you need more exposure to ward rounds and EHR use.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <h4 className="font-semibold">Strengths:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Strong Clinical Reasoning</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Excellent Communication Skills</li>
                    </ul>
                </div>
                 <div className="space-y-2">
                    <h4 className="font-semibold">Skill Gaps to Address:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Limited experience with Electronic Health Records (EHR)</li>
                        <li className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Needs more exposure to hospital ward rounds</li>
                    </ul>
                </div>
                 <p className="text-xs text-muted-foreground pt-4">Complete the quiz to unlock your personalized report.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GraduationCap/>Personalized Learning Plan</CardTitle>
            <CardDescription>Curated resources and tasks to help you close your skill gaps.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <Card className="bg-background">
                    <CardHeader><CardTitle className="text-base">Task: Attend Ward Shadowing</CardTitle></CardHeader>
                    <CardContent><Button size="sm" variant="secondary" disabled>Add to Roadmap</Button></CardContent>
                </Card>
                 <Card className="bg-background">
                    <CardHeader><CardTitle className="text-base">Course: Clinical Pharmacotherapy Micro-course</CardTitle></CardHeader>
                    <CardContent><Button size="sm" variant="secondary" disabled>View on edX</Button></CardContent>
                </Card>
                 <p className="text-xs text-muted-foreground pt-4">Your personalized learning tasks will appear here after you complete the self-assessment.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
