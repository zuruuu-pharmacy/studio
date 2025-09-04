
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Globe, Plane, BookCheck, Languages, Construction, ExternalLink, ListChecks, FileText, BookCopy } from "lucide-react";

const countryPaths = [
  { 
    name: "Pakistan", 
    exams: "N/A (for local graduates)", 
    body: "Pharmacy Council of Pakistan", 
    link: "https://www.pharmacycouncil.org.pk/", 
    details: "Graduates from accredited Pakistani universities must register with the provincial pharmacy council where they intend to practice.",
    guide: {
      pathway: "Direct registration with provincial councils (e.g., Punjab, Sindh) after graduating from a PCP-accredited institution.",
      docs: ["Pharm.D/B.Pharm degree from a PCP-accredited university.", "Provisional license from the university.", "Completed internship/house job forms.", "CNIC (Computerized National Identity Card)."],
      prep: ["No licensing exam is required for graduates of local accredited universities.", "Focus on completing all documentation correctly for the provincial council."]
    }
  },
  { 
    name: "United States", 
    exams: "NAPLEX, MPJE", 
    body: "NABP", 
    link: "https://nabp.pharmacy/", 
    details: "Requires passing the North American Pharmacist Licensure Examination (NAPLEX) for pharmacy knowledge and the Multistate Pharmacy Jurisprudence Examination (MPJE) for state-specific law. Foreign graduates typically need FPGEC certification first.",
    guide: {
      pathway: "1. FPGEC Certification (TOEFL + FPGEE exam) -> 2. Internship hours (varies by state) -> 3. NAPLEX & MPJE exams -> 4. State board licensure.",
      docs: ["University transcripts (verified by an agency like WES/ECE).", "Official TOEFL iBT scores.", "FPGEC application.", "Visa and immigration documents."],
      prep: ["NAPLEX Review Guides (e.g., RxPrep).", "MPJE state-specific law review materials.", "Intensive English language preparation for TOEFL."]
    }
  },
  { 
    name: "United Kingdom", 
    exams: "GPhC Registration Assessment", 
    body: "General Pharmaceutical Council (GPhC)", 
    link: "https://www.pharmacyregulation.org/", 
    details: "Overseas pharmacists must complete the OSPAP (Overseas Pharmacists' Assessment Programme), a one-year postgraduate diploma, before taking the registration assessment.",
    guide: {
      pathway: "1. GPhC adjudication of degree -> 2. OSPAP course (1 year) -> 3. 52-week pre-registration training -> 4. GPhC Registration Assessment exam.",
      docs: ["Pharmacy degree transcripts.", "Letter of good standing from the Pharmacy Council of Pakistan.", "IELTS/OET language test results.", "UK visa/right-to-work documents."],
      prep: ["OSPAP university course materials.", "GPhC assessment framework and practice papers.", "BNF (British National Formulary) is a key text."]
    }
  },
  { 
    name: "Canada", 
    exams: "PEBC Qualifying Exam (MCQ & OSCE)", 
    body: "The Pharmacy Examining Board of Canada (PEBC)", 
    link: "https://www.pebc.ca/", 
    details: "International graduates must have their credentials evaluated by PEBC and then pass both a written (MCQ) and practical (OSCE) qualifying exam.",
    guide: {
        pathway: "1. Document evaluation by PEBC -> 2. PEBC Evaluating Exam -> 3. PEBC Qualifying Exam (Part I - MCQ, Part II - OSCE) -> 4. Provincial registration requirements (internship hours, jurisprudence exam).",
        docs: ["Degree certificate and transcripts.", "Language proficiency test results (IELTS/CELPIP).", "Evidence of identity."],
        prep: ["PEBC-recommended reference textbooks.", "OSCE practice courses and materials.", "Canadian drug handbooks and formularies."]
    }
  },
  { 
    name: "Australia", 
    exams: "KAPS Exam", 
    body: "Australian Pharmacy Council (APC)", 
    link: "https://www.pharmacycouncil.org.au/", 
    details: "The Knowledge Assessment of Pharmaceutical Sciences (KAPS) exam is the first step for overseas pharmacists, followed by an internship and further assessments.",
    guide: {
        pathway: "1. APC skills assessment -> 2. Pass KAPS exam -> 3. Pass English language test -> 4. Limited registration for a supervised practice internship -> 5. Final registration exams.",
        docs: ["Pharmacy degree and transcripts.", "Evidence of initial registration.", "Passport/ID documents.", "IELTS/OET/PTE Academic scores."],
        prep: ["APC-provided KAPS sample papers.", "Australian Medicines Handbook (AMH).", "Australian Pharmaceutical Formulary and Handbook (APF)."]
    }
  },
  { 
    name: "GCC Countries", 
    exams: "Varies (e.g., DHA, HAAD, Prometric)", 
    body: "Local Health Authorities", 
    link: "#", 
    details: "Gulf countries like UAE and Saudi Arabia have their own licensing exams (e.g., DHA for Dubai, HAAD for Abu Dhabi) often administered through Prometric. Requirements vary significantly by country.",
    guide: {
        pathway: "Pathway varies by country. Generally: 1. DataFlow verification of documents -> 2. Pass the relevant authority's exam (e.g., DHA, HAAD, SCFHS) -> 3. Fulfill local experience/internship requirements.",
        docs: ["Attested educational degrees.", "Attested experience certificates.", "Letter of good standing.", "Passport and visa copies."],
        prep: ["Exam-specific preparation materials from providers like Prometric.", "Focus on common clinical cases and brand names used in the region."]
    }
  },
];

function DetailedGuide({ guide }: { guide: typeof countryPaths[0]['guide'] }) {
    return (
        <Accordion type="multiple" className="w-full space-y-3" defaultValue={['pathway', 'docs']}>
            <AccordionItem value="pathway" className="border-0">
                <AccordionTrigger className="p-2 bg-muted rounded-md text-sm font-semibold hover:no-underline"><ListChecks className="mr-2"/>Licensing Pathway</AccordionTrigger>
                <AccordionContent className="p-4 pt-2 text-sm text-muted-foreground">{guide.pathway}</AccordionContent>
            </AccordionItem>
             <AccordionItem value="docs" className="border-0">
                <AccordionTrigger className="p-2 bg-muted rounded-md text-sm font-semibold hover:no-underline"><FileText className="mr-2"/>Key Documents</AccordionTrigger>
                <AccordionContent className="p-4 pt-2 text-sm text-muted-foreground">
                    <ul className="list-disc list-inside space-y-1">
                        {guide.docs.map((doc, i) => <li key={i}>{doc}</li>)}
                    </ul>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="prep" className="border-0">
                <AccordionTrigger className="p-2 bg-muted rounded-md text-sm font-semibold hover:no-underline"><BookCopy className="mr-2"/>Prep Resources</AccordionTrigger>
                <AccordionContent className="p-4 pt-2 text-sm text-muted-foreground">
                     <ul className="list-disc list-inside space-y-1">
                        {guide.prep.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}


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
                    <Button variant="link" className="p-0 h-auto" disabled={path.link === '#'}>
                        Visit Official Website <ExternalLink className="ml-2 h-4 w-4"/>
                    </Button>
                  </a>
                   <div className="mt-4">
                        <DetailedGuide guide={path.guide} />
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
          <CardContent className="grid md:grid-cols-2 gap-6">
             <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">IELTS (International English Language Testing System)</h3>
                <p className="text-sm text-muted-foreground">Widely accepted for study, work, and migration in countries like the UK, Australia, Canada, and New Zealand. Most pharmacy boards require the Academic module with specific minimum scores in each section (Listening, Reading, Writing, Speaking).</p>
                <a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">Visit IELTS Website <ExternalLink className="ml-2"/></Button>
                </a>
             </div>
             <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <h3 className="font-semibold text-lg">TOEFL (Test of English as a Foreign Language)</h3>
                <p className="text-sm text-muted-foreground">Primarily accepted by universities and pharmacy boards in the United States and Canada. The TOEFL iBT (Internet-based Test) is the most common version, assessing reading, listening, speaking, and writing skills.</p>
                 <a href="https://www.ets.org/toefl" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">Visit TOEFL Website <ExternalLink className="ml-2"/></Button>
                </a>
             </div>
          </CardContent>
      </Card>
    </div>
  );
}
