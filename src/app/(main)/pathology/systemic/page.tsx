
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Wind, Brain, Bone, CircleEllipsis, TestTube, Dna } from 'lucide-react';

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
                <AccordionContent className="px-6 pb-4">
                    <h4 className="font-semibold mb-2">Common Diseases & Topics:</h4>
                    <p className="text-muted-foreground">{topic.diseases}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
