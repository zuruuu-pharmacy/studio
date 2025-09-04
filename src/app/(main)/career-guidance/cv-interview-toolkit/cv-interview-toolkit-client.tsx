
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, FileText, Bot, MessageSquare, ListChecks, Sparkles } from "lucide-react";

export function CvInterviewToolkitClient() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText />Pharmacy CV Builder</CardTitle>
            <CardDescription>
              Build a professional CV from pre-defined sections like Clinical Experience, Research, Skills, and Certifications. Your profile data will be pre-filled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                 <p className="text-muted-foreground/80 mt-2">The interactive CV builder is coming soon.</p>
                 <Button className="mt-4" disabled>Open CV Builder</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles />AI Cover Letter Generator</CardTitle>
            <CardDescription>
              Provide a job title and your top 3 achievements, and let the AI draft a tailored cover letter for you to review and edit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                  <p className="text-muted-foreground/80 mt-2">The AI generator is currently in development.</p>
                 <Button className="mt-4" disabled>Generate Cover Letter</Button>
            </div>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare />Interview Simulator</CardTitle>
            <CardDescription>
              Practice for your next interview with an AI-powered simulator. Get feedback on your answers to common clinical and behavioral questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                 <p className="text-muted-foreground/80 mt-2">The interview simulator is coming soon.</p>
                 <Button className="mt-4" disabled>Start Mock Interview</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks />Resource Library</CardTitle>
            <CardDescription>
              Access a library of common pharmacy interview questions, model answers, and checklists for site visits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                 <p className="text-muted-foreground/80 mt-2">The resource library is being populated.</p>
                 <Button className="mt-4" disabled>Browse Resources</Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
