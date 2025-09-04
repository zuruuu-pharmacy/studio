
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Globe, Plane, BookCheck, Languages, Construction } from "lucide-react";

const countryPaths = [
  { name: "Pakistan", exams: "N/A (Local Degree)", body: "Pharmacy Council of Pakistan" },
  { name: "United States", exams: "NAPLEX, MPJE", body: "NABP" },
  { name: "United Kingdom", exams: "GPhC Registration Assessment", body: "GPhC" },
  { name: "Canada", exams: "PEBC Qualifying Exam", body: "PEBC" },
  { name: "Australia", exams: "KAPS Exam", body: "Australian Pharmacy Council" },
  { name: "GCC Countries", exams: "Varies by country (e.g., DHA, HAAD)", body: "Local Health Authorities" },
];

export function LicensingExamsClient() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe />International Licensing Pathways</CardTitle>
          <CardDescription>
            A high-level overview of requirements for major international destinations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {countryPaths.map(path => (
              <AccordionItem value={path.name} key={path.name}>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-4">
                    <Plane className="h-6 w-6 text-primary"/>
                    {path.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4">
                  <p><strong>Primary Exam(s):</strong> {path.exams}</p>
                  <p><strong>Registration Body:</strong> {path.body}</p>
                   <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg mt-4">
                     <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                     <h3 className="text-xl font-semibold text-muted-foreground">Detailed Guide Coming Soon</h3>
                     <p className="text-muted-foreground/80 mt-2">
                        Checklists, document guides, and prep resources for {path.name} are being developed.
                     </p>
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Languages />Language Exams (IELTS/TOEFL)</CardTitle>
            <CardDescription>Guidance on language proficiency tests required for many countries.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                 <p className="text-muted-foreground/80 mt-2">
                    A detailed guide on language exam requirements and preparation is coming soon.
                 </p>
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
