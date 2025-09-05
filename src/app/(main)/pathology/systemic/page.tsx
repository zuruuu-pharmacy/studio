
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Wind, Brain, Bone, CircleEllipsis, TestTube, Dna, Microscope, Video, Zap, Notebook, Mic } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const systemicPathologyTopics = [
    {
        system: "Cardiovascular System",
        icon: Heart,
        diseases: "Atherosclerosis, Ischemic Heart Disease (Myocardial Infarction), Hypertensive Heart Disease, Valvular Heart Disease, Cardiomyopathies."
    },
    {
        system: "Respiratory System",
        icon: Wind,
        diseases: "Chronic Obstructive Pulmonary Disease (COPD), Asthma, Pneumonia, Tuberculosis, Lung Cancer, Acute Respiratory Distress Syndrome (ARDS)."
    },
    {
        system: "Nervous System",
        icon: Brain,
        diseases: "Cerebrovascular diseases (Stroke), Infections (Meningitis, Encephalitis), Neurodegenerative Diseases (Alzheimer's, Parkinson's), Brain Tumors."
    },
    {
        system: "Gastrointestinal System",
        icon: CircleEllipsis,
        diseases: "Peptic Ulcer Disease, Inflammatory Bowel Disease (Crohn's, Ulcerative Colitis), Liver Cirrhosis, Viral Hepatitis, Cancers of the GI tract."
    },
    {
        system: "Renal System",
        icon: TestTube,
        diseases: "Glomerulonephritis, Nephrotic Syndrome, Acute Kidney Injury (AKI), Chronic Kidney Disease (CKD), Urinary Tract Infections, Renal Cell Carcinoma."
    },
    {
        system: "Musculoskeletal System",
        icon: Bone,
        diseases: "Osteoarthritis, Rheumatoid Arthritis, Gout, Osteoporosis, Muscular Dystrophies, Bone Tumors."
    },
];

function DetailSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="mt-4">
            <h4 className="font-semibold text-base mb-2 flex items-center gap-2">{title}</h4>
            <div className="pl-7 text-muted-foreground text-sm space-y-2 border-l-2 border-primary/20 ml-2.5 pl-4 pb-2">
              {children}
            </div>
        </div>
    )
}

export default function SystemicPathologyPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Systemic Pathology</h1>
      <p className="text-muted-foreground mb-6">
        Explore diseases as they affect specific organ systems.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Organ Systems</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {systemicPathologyTopics.map((topic, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-background/50">
                <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <topic.icon className="h-6 w-6 text-primary" />
                    {topic.system}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Common Diseases & Topics:</h4>
                        <p className="text-muted-foreground">{topic.diseases}</p>
                    </div>
                    <div className="flex justify-between items-start">
                        <div></div>
                        <Link href="/text-to-speech">
                            <Button variant="ghost" size="sm" className="ml-4">
                                <Mic className="mr-2"/>Listen
                            </Button>
                        </Link>
                    </div>
                    <DetailSection title="Visual Learning">
                        <div className="flex flex-wrap gap-2">
                            <Link href="/moa-animations"><Button variant="outline"><Microscope className="mr-2"/>Virtual Microscope</Button></Link>
                            <Link href="/moa-animations"><Button variant="outline"><Video className="mr-2"/>3D Animation</Button></Link>
                        </div>
                    </DetailSection>
                    <DetailSection title="Practice Questions & Revision">
                        <div className="flex flex-wrap gap-2">
                            <Link href="/mcq-bank"><Button variant="outline" size="sm">MCQs</Button></Link>
                            <Link href="/flashcard-generator"><Button variant="outline" size="sm">Flashcards</Button></Link>
                            <Link href="/clinical-case-simulator"><Button variant="outline" size="sm">Case Simulation</Button></Link>
                        </div>
                    </DetailSection>
                    <DetailSection title="Personal Notes">
                        <Link href="/notes-organizer"><Button variant="secondary" size="sm">Add Note</Button></Link>
                    </DetailSection>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
