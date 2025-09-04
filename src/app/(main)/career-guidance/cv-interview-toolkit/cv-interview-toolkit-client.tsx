
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Bot, MessageSquare, ListChecks, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function CvInterviewToolkitClient() {
  const handleActionClick = (feature: string) => {
    toast({
      title: `${feature} Initialized`,
      description: "This feature is now active. A full implementation would follow.",
    });
  };

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
            <Button onClick={() => handleActionClick('CV Builder')}>Open CV Builder</Button>
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
            <Button onClick={() => handleActionClick('Cover Letter Generator')}>Generate Cover Letter</Button>
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
            <Button onClick={() => handleActionClick('Interview Simulator')}>Start Mock Interview</Button>
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
            <Button onClick={() => handleActionClick('Resource Library')}>Browse Resources</Button>
          </CardContent>
        </Card>
    </div>
  );
}
