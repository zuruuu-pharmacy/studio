
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube, Microscope, FileText, Dna, Award } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const pathologyModules = [
  {
    icon: Microscope,
    title: "General Pathology",
    description: "Learn about the basic pathological processes like inflammation, neoplasia, and cellular injury.",
    href: "/pathology/general",
    status: "Active",
  },
  {
    icon: Dna,
    title: "Systemic Pathology",
    description: "Explore the pathology of specific organ systems, including cardiovascular, respiratory, and renal systems.",
    href: "/pathology/systemic",
    status: "Active",
  },
  {
    icon: TestTube,
    title: "Hematology & Blood Banking",
    description: "Study diseases of the blood and the principles of transfusion medicine.",
    href: "/pathology/hematology",
    status: "Active",
  },
  {
    icon: FileText,
    title: "Pathology Case Studies",
    description: "Review real-world case studies and analyze slides to build your diagnostic skills.",
    href: "/pathology/cases",
    status: "Active",
  },
];

const kpiData = [
  { metric: "Student Engagement", kpi: "75% of students access the module weekly." },
  { metric: "Concept Mastery", kpi: "Average score on spotter quizzes increases by 15% semester-over-semester." },
  { metric: "Diagnostic Accuracy", kpi: "90% completion rate for all mandatory case studies with a passing grade." },
  { metric: "Lab Report Interpretation", kpi: "Decrease in average time-to-diagnosis on virtual slide exercises." },
  { metric: "Integration", kpi: "20% of pathology notes or flashcards are generated via the integrated AI tools." },
];

export function PathologyClient() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pathologyModules.map((module) => (
          <Card key={module.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <module.icon className="h-10 w-10 text-primary" />
                <CardTitle>{module.title}</CardTitle>
              </div>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              {module.status === "Active" ? (
                <Link href={module.href} className="w-full">
                  <Button className="w-full">Explore Module</Button>
                </Link>
              ) : (
                <Button disabled className="w-full">{module.status}</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-0">
          <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">
            Feature Goals &amp; Metrics
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award/>Feature Goals &amp; Success Metrics (KPIs)</CardTitle>
                <CardDescription>The primary objectives for this module and how we measure its success.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Primary Goals</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Teach core pathology concepts (gross, histopathology, cytology, hematology) using interactive visual and case-based learning.</li>
                    <li>Train students to accurately interpret lab reports and pathology slides, connecting data to clinical diagnosis.</li>
                    <li>Provide robust formative and summative assessments, including spotter exams and case workups, with rich, AI-driven feedback.</li>
                    <li>Seamlessly integrate pathology learning into the student's primary workflow, connecting with the Study Planner, notes, and flashcard tools.</li>
                  </ul>
                </div>
                 <div>
                  <h4 className="font-semibold mb-2">Key Performance Indicators (KPIs)</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {kpiData.map(kpi => <li key={kpi.metric}><strong>{kpi.metric}:</strong> {kpi.kpi}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
