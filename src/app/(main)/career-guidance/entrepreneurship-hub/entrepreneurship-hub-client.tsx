
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, FileText, Bot, Briefcase, ListChecks, Sparkles, User, FileBarChart } from "lucide-react";

const modules = [
  {
    title: "Business Roadmap Generator",
    icon: Sparkles,
    description: "Generate a step-by-step roadmap from your business idea to a minimum viable product (MVP), including feasibility checks and pilot planning."
  },
  {
    title: "Legal & Regulatory Checklist",
    icon: ListChecks,
    description: "Get a customized checklist for your venture type (e.g., compounding, lab, med-tech), covering local licensing and Drug Sale License processes."
  },
  {
    title: "Pitch & Funding Templates",
    icon: FileBarChart,
    description: "Access templates for one-page pitches, financial models, and MVP checklists to prepare for investor meetings."
  },
  {
    title: "Market Research Tool",
    icon: Bot,
    description: "Use our AI tool to perform a quick competitor scan and generate a target market questionnaire."
  },
  {
    title: "Connect with Entrepreneurs",
    icon: User,
    description: "Book a session with alumni who have successfully started their own businesses in the pharmaceutical space."
  }
];

export function EntrepreneurshipHubClient() {
  return (
    <div className="space-y-6">
        {modules.map((mod, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><mod.icon />{mod.title}</CardTitle>
                <CardDescription>{mod.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                    <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                    <p className="text-muted-foreground/80 mt-2">This tool is currently in development.</p>
                    <Button className="mt-4" disabled>Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
        ))}
    </div>
  );
}
