
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, FileText, Plus, Zap, Notebook, CheckCircle, Lightbulb, Search, Filter, Stethoscope, ZoomIn, ZoomOut, MessageCircle } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const caseStudies = [
    {
        id: "case1",
        title: "Case 01: A 65-year-old male with a lung mass",
        history: "A 65-year-old male with a 40-pack-year smoking history presents with a chronic cough, hemoptysis, and a 10-lb weight loss over the past 3 months. He denies fever or night sweats.",
        specialty: "Pulmonary Pathology",
        findings: "Chest X-ray reveals a 3 cm spiculated mass in the right upper lobe. Biopsy shows nests of malignant cells with abundant eosinophilic cytoplasm, keratin pearls, and distinct intercellular bridges.",
        diagnosis: "Squamous Cell Carcinoma of the lung.",
        discussion: "The key histological features here are the keratin pearls and intercellular bridges, which are pathognomonic for squamous differentiation. The patient's extensive smoking history is the primary risk factor. This case highlights the classic presentation and morphology of one of the major types of lung cancer.",
        imageUrl: "https://picsum.photos/id/101/600/400",
        tags: {
            organ: "🫁 Lung",
            type: "🧪 Cancer",
            difficulty: "🔥 Complex",
        },
        quiz: [
            {
                question: "What is the most definitive histological feature for this diagnosis?",
                options: ["Gland formation", "Keratin pearls", "Small blue cells", "Rosettes"],
                answer: "Keratin pearls"
            }
        ]
    },
    {
        id: "case2",
        title: "Case 02: A 45-year-old female with joint pain",
        history: "A 45-year-old female presents with symmetrical swelling and pain in the small joints of her hands and wrists (MCP, PIP joints), with morning stiffness lasting over an hour for the past 6 months.",
        specialty: "Rheumatologic Pathology",
        findings: "Blood tests show elevated rheumatoid factor and anti-CCP antibodies. Synovial biopsy reveals marked synovial hyperplasia with villous-like projections, dense lymphoplasmacytic infiltrates (some forming germinal centers), and fibrinoid necrosis. This destructive tissue is known as a pannus.",
        diagnosis: "Rheumatoid Arthritis.",
        discussion: "This is a classic presentation of Rheumatoid Arthritis, an autoimmune disease. The key is the symmetrical small-joint arthritis and the specific serological markers. The histology showing pannus formation confirms the destructive nature of the inflammation, which eventually erodes cartilage and bone.",
        imageUrl: "https://picsum.photos/id/102/600/400",
        tags: {
            organ: "🦴 Rheumatology",
            type: "🧑‍⚕️ Autoimmune",
            difficulty: "",
        },
        quiz: [
             {
                question: "The destructive, inflamed synovial tissue in this condition is known as:",
                options: ["Tophi", "Osteophyte", "Pannus", "Granuloma"],
                answer: "Pannus"
            }
        ]
    },
    {
        id: "case3",
        title: "Case 03: A 20-year-old male with lymphadenopathy",
        history: "A 20-year-old male presents with a painless, enlarging lymph node in his neck for the past two months, accompanied by intermittent fever ('Pel-Ebstein fever') and night sweats.",
        specialty: "Hematopathology",
        findings: "Lymph node biopsy reveals effacement of the normal architecture by a mixed inflammatory infiltrate. Scattered among these are large, binucleated cells with prominent eosinophilic nucleoli, resembling 'owl eyes'. These are Reed-Sternberg cells. Immunohistochemistry shows these cells are positive for CD30 and CD15.",
        diagnosis: "Hodgkin Lymphoma (Nodular Sclerosis type).",
        imageUrl: "https://picsum.photos/id/103/600/400",
        tags: {
            organ: "🧬 Hematology",
            type: "🧪 Lymphoma",
            difficulty: "",
        },
        discussion: "The presence of Reed-Sternberg cells is diagnostic for Hodgkin Lymphoma. The mixed inflammatory background is characteristic. The specific subtype is determined by the overall architecture and cellular composition. The CD30+/CD15+ immunophenotype is classic.",
        quiz: [
             {
                question: "The diagnostic cell for Hodgkin Lymphoma is the:",
                options: ["Plasma cell", "Myeloblast", "Reed-Sternberg cell", "Atypical lymphocyte"],
                answer: "Reed-Sternberg cell"
            }
        ]
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
                <Card className="shadow-lg hover:shadow-2xl transition rounded-2xl flex flex-col cursor-pointer">
                    <CardContent className="p-6 flex-grow flex flex-col">
                        <h2 className="font-bold text-lg">{study.title}</h2>
                        <p className="text-gray-600 mt-2 text-sm flex-grow">{study.history}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                           {Object.values(study.tags).filter(Boolean).map((tag, i) => <Badge key={i}>{tag}</Badge>)}
                        </div>
                        <Button className="mt-4 w-full">View Case Details</Button>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-xl">{study.title}</DialogTitle>
                <DialogDescription>{study.specialty}</DialogDescription>
              </DialogHeader>
              <div className="grid lg:grid-cols-5 gap-6 max-h-[80vh] overflow-y-auto pr-4">
                 <div className="lg:col-span-3 space-y-4">
                    <DetailSection title="Clinical Vignette" icon={Stethoscope}>
                        <p>{study.history}</p>
                    </DetailSection>

                    <DetailSection title="Histopathology" icon={Microscope}>
                       <p>{study.findings}</p>
                       <div className="relative w-full aspect-video rounded-lg overflow-hidden my-2 group bg-muted">
                            <Image src={study.imageUrl} alt={`Slide for ${study.title}`} layout="fill" objectFit="cover" />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <Button size="icon" variant="secondary"><ZoomIn/></Button>
                                <Button size="icon" variant="secondary"><ZoomOut/></Button>
                                <Button size="icon" variant="secondary"><MessageCircle/></Button>
                            </div>
                        </div>
                    </DetailSection>
                     <DetailSection title="Discussion & Key Points" icon={Lightbulb}>
                        <p>{study.discussion}</p>
                    </DetailSection>
                 </div>
                 <div className="lg:col-span-2 space-y-4">
                    <Alert variant="default" className="bg-green-500/10 border-green-500">
                        <AlertTitle className="flex items-center gap-2 font-bold"><CheckCircle/>Final Diagnosis</AlertTitle>
                        <AlertDescription>{study.diagnosis}</AlertDescription>
                    </Alert>
                    
                    <Card>
                        <CardHeader>
                             <CardTitle className="text-lg flex items-center gap-2"><Zap/>Quiz</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold text-sm mb-2">{study.quiz[0].question}</p>
                             <div className="flex flex-wrap gap-2">
                                {study.quiz[0].options.map(opt => <Button key={opt} variant="outline" size="sm">{opt}</Button>)}
                            </div>
                             <Alert className="mt-4 text-sm"><AlertDescription><strong>Answer:</strong> {study.quiz[0].answer}</AlertDescription></Alert>
                        </CardContent>
                    </Card>

                    <Button onClick={handleAiAnalysis} className="w-full">
                       <Lightbulb className="mr-2"/>AI Analysis
                    </Button>
                 </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
         <Card className="flex items-center justify-center border-2 border-dashed">
            <Button variant="outline">➕ Submit a New Case</Button>
        </Card>
      </div>
    </div>
  );
}
