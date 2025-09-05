
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, FileText, Plus, Zap, Notebook, CheckCircle, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const caseStudies = [
    {
        id: "case1",
        title: "Case 01: A 65-year-old male with a lung mass",
        history: "A 65-year-old male with a 40-pack-year smoking history presents with a chronic cough and hemoptysis.",
        findings: "Chest X-ray reveals a 3 cm spiculated mass in the right upper lobe. Biopsy shows nests of malignant cells with keratin pearls and intercellular bridges.",
        diagnosis: "Squamous Cell Carcinoma of the lung.",
        imageUrl: "https://picsum.photos/id/101/600/400"
    },
    {
        id: "case2",
        title: "Case 02: A 45-year-old female with joint pain",
        history: "A 45-year-old female presents with symmetrical swelling and pain in the small joints of her hands and wrists, with morning stiffness lasting over an hour.",
        findings: "Blood tests show elevated rheumatoid factor and anti-CCP antibodies. Synovial biopsy reveals pannus formation with dense lymphoplasmacytic infiltrates.",
        diagnosis: "Rheumatoid Arthritis.",
        imageUrl: "https://picsum.photos/id/102/600/400"
    },
    {
        id: "case3",
        title: "Case 03: A 20-year-old male with an enlarged lymph node",
        history: "A 20-year-old male presents with a painless, enlarging lymph node in his neck for the past two months, accompanied by fever and night sweats.",
        findings: "Lymph node biopsy reveals large, binucleated cells with prominent eosinophilic nucleoli (Reed-Sternberg cells) in a background of lymphocytes, eosinophils, and histiocytes.",
        diagnosis: "Hodgkin Lymphoma (Nodular Sclerosis type).",
        imageUrl: "https://picsum.photos/id/103/600/400"
    },
];

function DetailSection({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) {
    return (
        <div className="mt-4">
            <h4 className="font-semibold text-base mb-2 flex items-center gap-2"><Icon className="h-5 w-5 text-primary"/>{title}</h4>
            <div className="pl-7 text-muted-foreground text-sm space-y-2 border-l-2 border-primary/20 ml-2.5 pl-4 pb-2">
              {children}
            </div>
        </div>
    )
}

export default function PathologyCasesPage() {

  const handleAiAnalysis = () => {
    toast({
      title: "AI Analysis (Coming Soon)",
      description: "This feature will provide an AI-generated breakdown of the case, differential diagnoses, and key learning points."
    });
  };

  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Pathology Case Studies</h1>
      <p className="text-muted-foreground mb-6">
        Review clinical vignettes and corresponding histopathology to develop your diagnostic skills.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.map((study) => (
          <Dialog key={study.id}>
            <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Microscope className="text-primary"/>{study.title}</CardTitle>
                        <CardDescription>{study.history}</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <Button className="w-full">View Case Details</Button>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{study.title}</DialogTitle>
                <DialogDescription>{study.history}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image src={study.imageUrl} alt={`Slide for ${study.title}`} layout="fill" objectFit="cover" />
                </div>
                
                <DetailSection title="Histopathology Findings" icon={Microscope}>
                   <p>{study.findings}</p>
                </DetailSection>

                <DetailSection title="Most Likely Diagnosis" icon={CheckCircle}>
                   <p className="text-primary font-bold">{study.diagnosis}</p>
                </DetailSection>

                 <DetailSection title="Practice & Action" icon={Zap}>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/mcq-bank"><Button variant="outline" size="sm">Case MCQs</Button></Link>
                        <Link href="/flashcard-generator"><Button variant="outline" size="sm">Make Flashcards</Button></Link>
                         <Button variant="outline" size="sm" onClick={handleAiAnalysis}>
                           <Lightbulb className="mr-2"/>AI Analysis
                        </Button>
                         <Link href="/notes-organizer"><Button variant="secondary" size="sm"><Notebook className="mr-2"/>Add to My Notes</Button></Link>
                    </div>
                </DetailSection>
              </div>
            </DialogContent>
          </Dialog>
        ))}
        <Card className="border-dashed flex items-center justify-center hover:border-primary hover:text-primary transition">
            <div className="text-center text-muted-foreground">
                <Plus className="mx-auto h-12 w-12 mb-2"/>
                <p>Submit a New Case</p>
            </div>
        </Card>
      </div>
    </div>
  );
}
