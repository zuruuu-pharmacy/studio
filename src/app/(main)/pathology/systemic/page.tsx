
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Wind, Brain, Bone, CircleEllipsis, TestTube, Dna, Microscope, Video, Zap, Notebook, Mic, Book, ListOrdered, Activity, AlertTriangle, Stethoscope, CheckCircle, GitCompareArrows } from 'lucide-react';
import { systemicPathologyData, type Disease } from "./data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const organIcons: { [key: string]: React.ElementType } = {
    "Cardiovascular System": Heart,
    "Respiratory System": Wind,
    "Nervous System": Brain,
    "Gastrointestinal System": CircleEllipsis,
    "Renal System": TestTube,
    "Musculoskeletal System": Bone,
};

function DetailSection({ title, content, icon: Icon, children, isList = false }: { title: string, content?: React.ReactNode, icon: React.ElementType, children?: React.ReactNode, isList?: boolean }) {
    if (!content && !children) return null;

    let contentNode;
    if (isList && Array.isArray(content)) {
        contentNode = <ul className="list-disc list-inside space-y-1">{content.map((item, i) => <li key={i}>{item}</li>)}</ul>;
    } else {
        contentNode = <div className="whitespace-pre-wrap">{content}</div>;
    }

    return (
        <div className="mt-2">
            <h4 className="font-semibold text-base mb-2 flex items-center gap-2"><Icon className="h-5 w-5 text-primary"/>{title}</h4>
            <div className="pl-7 text-muted-foreground text-sm space-y-2 border-l-2 border-primary/20 ml-2.5 pl-4 pb-2">
              {contentNode}
              {children}
            </div>
        </div>
    )
}

function DiseaseCard({ disease }: { disease: Disease }) {
    return (
        <div className="p-4 space-y-4">
             <div className="flex flex-wrap gap-2">
                {disease.tags.highYield && <Badge variant="destructive">High-Yield</Badge>}
                <Badge variant="secondary">{disease.tags.acuity}</Badge>
                <Badge variant="outline">{disease.level}</Badge>
            </div>
            <DetailSection title="Learning Objectives" icon={CheckCircle} content={disease.learningObjectives} isList />
            <DetailSection title="Etiology / Risk Factors" icon={Activity}>
                <ul className="list-disc list-inside space-y-1">
                    {disease.etiology.map((e, i) => <li key={i}>{e.factor} <Badge variant="outline" className="ml-2">Importance: {e.importance}</Badge></li>)}
                </ul>
            </DetailSection>
            <DetailSection title="Pathogenesis" icon={GitCompareArrows} content={disease.pathogenesis} />
            <DetailSection title="Morphology" icon={Microscope}>
                <p><strong>Gross:</strong> {disease.morphology.gross}</p>
                <p><strong>Microscopic:</strong> {disease.morphology.microscopic}</p>
            </DetailSection>
            <DetailSection title="Clinical Features" icon={Stethoscope} content={disease.clinicalFeatures} />
            <DetailSection title="Investigations" icon={TestTube}>
                 <ul className="list-disc list-inside space-y-1">
                    {disease.investigations.map((inv, i) => <li key={i}><strong>{inv.test}:</strong> {inv.findings}</li>)}
                </ul>
            </DetailSection>
             <DetailSection title="Management Overview" icon={Book} content={disease.management} />
             <DetailSection title="Complications & Prognosis" icon={AlertTriangle} content={disease.complicationsPrognosis} />
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
          <Accordion type="single" collapsible className="w-full space-y-3" defaultValue="Cardiovascular System">
            {systemicPathologyData.map((system) => {
              const Icon = organIcons[system.system] || Dna;
              return (
                 <AccordionItem key={system.system} value={system.system} className="border rounded-lg bg-background/50">
                    <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        {system.system}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 space-y-4">
                        <Accordion type="single" collapsible className="w-full space-y-2">
                           {system.categories.map(category => (
                                <AccordionItem key={category.name} value={category.name} className="border-0">
                                    <AccordionTrigger className="text-base font-semibold hover:no-underline p-2 rounded-md hover:bg-muted">
                                        {category.name}
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-4 pt-2">
                                        {category.diseases.length > 0 ? (
                                             <Accordion type="single" collapsible className="w-full">
                                                {category.diseases.map(disease => (
                                                    <AccordionItem key={disease.title} value={disease.title} className="border-b">
                                                        <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                                                            {disease.title}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="pt-2">
                                                            <DiseaseCard disease={disease} />
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                             </Accordion>
                                        ) : (
                                            <p className="text-sm text-muted-foreground py-2 pl-2">No diseases listed in this category yet.</p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                           ))}
                        </Accordion>
                    </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
