
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Bot, Briefcase, ListChecks, Sparkles, User, FileBarChart, Download, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const modules = [
  {
    title: "Business Roadmap Generator",
    icon: Sparkles,
    description: "Generate a step-by-step roadmap from your business idea to a minimum viable product (MVP), including feasibility checks and pilot planning.",
    component: (
        <div className="space-y-4">
            <Label htmlFor="idea">Your Business Idea</Label>
            <Textarea id="idea" placeholder="e.g., An AI-powered app to help pharmacies manage inventory." />
            <Button className="w-full">Generate Roadmap</Button>
        </div>
    )
  },
  {
    title: "Legal & Regulatory Checklist",
    icon: ListChecks,
    description: "Get a customized checklist for your venture type (e.g., compounding, lab, med-tech), covering local licensing and Drug Sale License processes.",
    component: (
         <div className="space-y-4">
            <p className="font-semibold">Generated Checklist for "Community Pharmacy":</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                <li>Register company with SECP.</li>
                <li>Obtain National Tax Number (NTN).</li>
                <li>Apply for Drug Sale License (Form 7).</li>
                <li>Ensure compliance with provincial pharmacy council regulations.</li>
                <li>Register with local chamber of commerce.</li>
            </ul>
        </div>
    )
  },
  {
    title: "Pitch & Funding Templates",
    icon: FileBarChart,
    description: "Access templates for one-page pitches, financial models, and MVP checklists to prepare for investor meetings.",
    component: (
        <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start"><Download className="mr-2"/>Download One-Page Pitch Template</Button>
            <Button variant="outline" className="w-full justify-start"><Download className="mr-2"/>Download Financial Model (Excel)</Button>
            <Button variant="outline" className="w-full justify-start"><Download className="mr-2"/>Download MVP Checklist</Button>
        </div>
    )
  },
  {
    title: "Market Research Tool",
    icon: Bot,
    description: "Use our AI tool to perform a quick competitor scan and generate a target market questionnaire.",
    component: (
         <div className="space-y-4">
            <Label htmlFor="competitor">Competitor Scan</Label>
             <div className="flex gap-2">
                <Input id="competitor" placeholder="e.g., 'Online pharmacies in Lahore'"/>
                <Button><Search/></Button>
            </div>
            <p className="text-sm text-muted-foreground">This would return a list of competitors and their offerings.</p>
        </div>
    )
  },
  {
    title: "Connect with Entrepreneurs",
    icon: User,
    description: "Book a session with alumni who have successfully started their own businesses in the pharmaceutical space.",
    isMentor: true,
  }
];

export function EntrepreneurshipHubClient() {
    const handleMentorClick = () => {
         toast({
            title: "Coming Soon!",
            description: "Mentor booking will be available shortly.",
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
                 {mod.isMentor ? (
                     <Button onClick={handleMentorClick} disabled>Book Session (Coming Soon)</Button>
                 ) : (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Open Tool</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{mod.title}</DialogTitle>
                                <DialogDescription>{mod.description}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">{mod.component}</div>
                        </DialogContent>
                    </Dialog>
                 )}
              </CardContent>
            </Card>
        ))}
    </div>
  );
}
