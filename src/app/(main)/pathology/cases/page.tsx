
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, FileText, Plus, Zap, Notebook, CheckCircle, Lightbulb, Search, Filter, Stethoscope } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const caseStudies = [
    {
        id: "case1",
        title: "Case 01: A 65-year-old male with a lung mass",
        history: "A 65-year-old male with a 40-pack-year smoking history presents with a chronic cough and hemoptysis.",
        findings: "Chest X-ray reveals a 3 cm spiculated mass in the right upper lobe. Biopsy shows nests of malignant cells with keratin pearls and intercellular bridges.",
        diagnosis: "Squamous Cell Carcinoma of the lung.",
        imageUrl: "https://picsum.photos/id/101/600/400",
        tags: {
            organ: "Lung",
            type: "Neoplastic",
            difficulty: "Complex",
        }
    },
    {
        id: "case2",
        title: "Case 02: A 45-year-old female with joint pain",
        history: "A 45-year-old female presents with symmetrical swelling and pain in the small joints of her hands and wrists, with morning stiffness lasting over an hour.",
        findings: "Blood tests show elevated rheumatoid factor and anti-CCP antibodies. Synovial biopsy reveals pannus formation with dense lymphoplasmacytic infiltrates.",
        diagnosis: "Rheumatoid Arthritis.",
        imageUrl: "https://picsum.photos/id/102/600/400",
        tags: {
            organ: "Joints",
            type: "Inflammatory",
            difficulty: "Moderate",
        }
    },
    {
        id: "case3",
        title: "Case 03: A 20-year-old male with an enlarged lymph node",
        history: "A 20-year-old male presents with a painless, enlarging lymph node in his neck for the past two months, accompanied by fever and night sweats.",
        findings: "Lymph node biopsy reveals large, binucleated cells with prominent eosinophilic nucleoli (Reed-Sternberg cells) in a background of lymphocytes, eosinophils, and histiocytes.",
        diagnosis: "Hodgkin Lymphoma (Nodular Sclerosis type).",
        imageUrl: "https://picsum.photos/id/103/600/400",
        tags: {
            organ: "Lymph Node",
            type: "Neoplastic",
            difficulty: "Classic",
        }
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

       <Card className="mb-6">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Filter/>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search by disease, organ, or keyword..." className="pl-10" />
            </div>
            <Select><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Organ System" /></SelectTrigger><SelectContent><SelectItem value="lung">Lung</SelectItem><SelectItem value="heart">Heart</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Difficulty" /></SelectTrigger><SelectContent><SelectItem value="classic">Classic</SelectItem><SelectItem value="complex">Complex</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Case Type" /></SelectTrigger><SelectContent><SelectItem value="neoplastic">Neoplastic</SelectItem><SelectItem value="inflammatory">Inflammatory</SelectItem></SelectContent></Select>
        </CardContent>
       </Card>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.map((study) => (
          <Dialog key={study.id}>
            <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow group flex flex-col">
                    <CardHeader className="p-0">
                        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                            <Image 
                                src={study.imageUrl} 
                                alt={study.title} 
                                layout="fill" 
                                objectFit="cover"
                                className="group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{study.tags.organ}</Badge>
                            <Badge variant="outline">{study.tags.type}</Badge>
                            <Badge variant="outline">{study.tags.difficulty}</Badge>
                        </div>
                        <CardTitle className="text-lg mb-2 flex-grow">{study.title}</CardTitle>
                        <CardDescription className="text-xs mb-4">{study.history}</CardDescription>
                        <Button className="w-full mt-auto">View Case</Button>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{study.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                 <DetailSection title="Clinical Vignette" icon={Stethoscope}>
                   <p>{study.history}</p>
                </DetailSection>

                <DetailSection title="Histopathology Findings" icon={Microscope}>
                   <p>{study.findings}</p>
                   <div className="relative w-full aspect-video rounded-lg overflow-hidden my-2">
                        <Image src={study.imageUrl} alt={`Slide for ${study.title}`} layout="fill" objectFit="cover" />
                    </div>
                </DetailSection>

                <DetailSection title="Most Likely Diagnosis" icon={CheckCircle}>
                   <p className="text-primary font-bold">{study.diagnosis}</p>
                </DetailSection>

                <DetailSection title="Practice Questions & Revision" icon={Zap}>
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
        <Card className="border-dashed flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer bg-muted/20 hover:bg-muted/50">
            <div className="text-center text-muted-foreground">
                <Plus className="mx-auto h-12 w-12 mb-2"/>
                <p>Submit a New Case</p>
            </div>
        </Card>
      </div>
    </div>
  );
}
