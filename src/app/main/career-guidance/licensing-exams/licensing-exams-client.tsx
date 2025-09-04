
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Globe, Plane, BookCheck, Languages, Construction, ExternalLink } from "lucide-react";

const countryPaths = [
  { name: "Pakistan", exams: "N/A (for local graduates)", body: "Pharmacy Council of Pakistan", link: "https://www.pharmacycouncil.org.pk/", details: "Graduates from accredited Pakistani universities must register with the provincial pharmacy council where they intend to practice." },
  { name: "United States", exams: "NAPLEX, MPJE", body: "NABP", link: "https://nabp.pharmacy/", details: "Requires passing the North American Pharmacist Licensure Examination (NAPLEX) for pharmacy knowledge and the Multistate Pharmacy Jurisprudence Examination (MPJE) for state-specific law. Foreign graduates typically need FPGEC certification first." },
  { name: "United Kingdom", exams: "GPhC Registration Assessment", body: "General Pharmaceutical Council (GPhC)", link: "https://www.pharmacyregulation.org/", details: "Overseas pharmacists must complete the OSPAP (Overseas Pharmacists' Assessment Programme), a one-year postgraduate diploma, before taking the registration assessment." },
  { name: "Canada", exams: "PEBC Qualifying Exam (MCQ & OSCE)", body: "The Pharmacy Examining Board of Canada (PEBC)", link: "https://www.pebc.ca/", details: "International graduates must have their credentials evaluated by PEBC and then pass both a written (MCQ) and practical (OSCE) qualifying exam." },
  { name: "Australia", exams: "KAPS Exam", body: "Australian Pharmacy Council (APC)", link: "https://www.pharmacycouncil.org.au/", details: "The Knowledge Assessment of Pharmaceutical Sciences (KAPS) exam is the first step for overseas pharmacists, followed by an internship and further assessments." },
  { name: "GCC Countries", exams: "Varies (e.g., DHA, HAAD, Prometric)", body: "Local Health Authorities", link: "#", details: "Gulf countries like UAE and Saudi Arabia have their own licensing exams (e.g., DHA for Dubai, HAAD for Abu Dhabi) often administered through Prometric. Requirements vary significantly by country." },
];

export function LicensingExamsClient() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe />International Licensing Pathways</CardTitle>
          <CardDescription>
            A high-level overview of requirements for major international destinations. Always check the official body for the latest updates.
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
                  <p><strong>Details:</strong> {path.details}</p>
                  <a href={path.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="link" className="p-0">
                        Visit Official Website <ExternalLink className="ml-2"/>
                    </Button>
                  </a>
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
