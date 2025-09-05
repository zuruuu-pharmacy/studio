
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Microscope, ShieldAlert, Heart, GitBranch, Stethoscope } from 'lucide-react';

const generalPathologyTopics = [
    {
        title: "Cellular Injury, Adaptation, and Death",
        icon: ShieldAlert,
        content: "This topic covers the fundamental ways cells respond to stress and noxious stimuli. Key concepts include hypertrophy, hyperplasia, atrophy, and metaplasia as adaptive responses. It delves into the mechanisms of reversible and irreversible cell injury, leading to necrosis (e.g., coagulative, liquefactive) or apoptosis (programmed cell death)."
    },
    {
        title: "Inflammation (Acute and Chronic)",
        icon: Heart,
        content: "Inflammation is the body's protective response to injury. Acute inflammation involves vascular changes, neutrophil recruitment, and chemical mediators. Chronic inflammation is a prolonged response involving lymphocytes and macrophages, leading to tissue destruction and fibrosis. Understanding these processes is key to many diseases."
    },
    {
        title: "Tissue Repair and Healing",
        icon: GitBranch,
        content: "This section explores how the body restores normal structure and function after injury. It covers regeneration (replacement by native cells) and repair (replacement by connective tissue, i.e., scarring). Key factors include cell proliferation, migration, and the role of the extracellular matrix (ECM)."
    },
    {
        title: "Neoplasia",
        icon: Microscope,
        content: "Neoplasia refers to abnormal, uncontrolled cell growth, forming a tumor. This topic differentiates between benign and malignant neoplasms based on differentiation, rate of growth, local invasion, and metastasis. It covers the nomenclature, characteristics, and molecular basis of cancer."
    },
    {
        title: "Hemodynamic Disorders, Thromboembolism, and Shock",
        icon: Stethoscope,
        content: "This area focuses on diseases related to blood flow and circulation. It includes edema (excess fluid in tissues), hyperemia, congestion, hemorrhage, thrombosis (inappropriate blood clot formation), embolism (migration of clots), infarction (tissue death due to ischemia), and shock (systemic hypoperfusion)."
    }
];

export default function GeneralPathologyPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">General Pathology</h1>
      <p className="text-muted-foreground mb-6">
        Core concepts of disease processes that are fundamental to understanding systemic pathology.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Fundamental Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {generalPathologyTopics.map((topic, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-background/50">
                <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <topic.icon className="h-6 w-6 text-primary" />
                    {topic.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-muted-foreground">{topic.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
