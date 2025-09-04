
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Bot, Briefcase, ListChecks, Sparkles, User, FileBarChart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    description: "Book a session with alumni who have successfully started their own businesses in the pharmaceutical space.",
    isMentor: true,
  }
];

export function EntrepreneurshipHubClient() {
    const handleActionClick = (title: string, isMentor: boolean = false) => {
        if (isMentor) {
             toast({
                title: "Coming Soon!",
                description: "Mentor booking will be available shortly.",
            });
            return;
        }
         toast({
            title: `${title} Initialized`,
            description: "This tool is now active for you to use.",
        });
    }

  return (
    <div className="space-y-6">
        {modules.map((mod, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><mod.icon />{mod.title}</CardTitle>
                <CardDescription>{mod.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleActionClick(mod.title, mod.isMentor)} disabled={mod.isMentor}>
                    {mod.isMentor ? "Book Session (Coming Soon)" : "Open Tool"}
                </Button>
              </CardContent>
            </Card>
        ))}
    </div>
  );
}
