
"use client";

import { useState } from 'react';
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Wind, Brain, Bone, CircleEllipsis, TestTube, Dna, FileText, CheckCircle, Target, FlaskConical, GitBranch, Microscope, Stethoscope } from 'lucide-react';
import { systemicPathologyData, type Disease } from "./data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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

function DiseaseDetail({ disease }: { disease: Disease }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
        <div className="mb-4">
            {disease.synonyms && <p className="text-sm text-muted-foreground italic">Also known as: {disease.synonyms}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{disease.tags.organ}</Badge>
                <Badge variant="outline">{disease.tags.system}</Badge>
                <Badge variant="outline">{disease.tags.category}</Badge>
                <Badge variant={disease.tags.level === 'Basic' ? 'secondary' : disease.tags.level === 'Intermediate' ? 'default' : 'destructive'}>
                    {disease.tags.level}
                </Badge>
            </div>
        </div>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pathogenesis">Pathogenesis</TabsTrigger>
        <TabsTrigger value="morphology">Morphology</TabsTrigger>
        <TabsTrigger value="clinical">Clinical</TabsTrigger>
        <TabsTrigger value="investigations">Investigations</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-4 space-y-4">
        <p className="italic">{disease.overview}</p>
        <DetailSection title="Learning Objectives" icon={Target}>
            <ul className="list-disc list-inside space-y-1">
                {disease.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
            </ul>
        </DetailSection>
         <DetailSection title="Etiology / Risk Factors" icon={FileText}>
            <ul className="list-disc list-inside space-y-1">
                {disease.etiology.map((et, i) => <li key={i}>{et}</li>)}
            </ul>
        </DetailSection>
      </TabsContent>
      <TabsContent value="pathogenesis" className="pt-4">
        <p>{disease.pathogenesis}</p>
      </TabsContent>
      <TabsContent value="morphology" className="pt-4">
         <DetailSection title="Gross Features" icon={Microscope}>
            <p>{disease.morphology.gross}</p>
         </DetailSection>
         <DetailSection title="Microscopic Features" icon={Microscope}>
            <p>{disease.morphology.microscopic}</p>
         </DetailSection>
      </TabsContent>
       <TabsContent value="clinical" className="pt-4">
         <DetailSection title="Clinical Features" icon={Stethoscope}>
            <p>{disease.clinicalFeatures}</p>
         </DetailSection>
         <DetailSection title="Complications & Prognosis" icon={GitBranch}>
            <p><strong>Complications:</strong> {disease.complications}</p>
            <p><strong>Prognosis:</strong> {disease.prognosis}</p>
         </DetailSection>
      </TabsContent>
       <TabsContent value="investigations" className="pt-4">
         <DetailSection title="Investigations" icon={FlaskConical}>
            <p>{disease.investigations}</p>
         </DetailSection>
          <DetailSection title="Management Overview" icon={CheckCircle}>
            <p>{disease.management}</p>
         </DetailSection>
      </TabsContent>
    </Tabs>
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
            {systemicPathologyData.map((system) => {
              const Icon = system.icon || Dna;
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
                                            <Accordion type="single" collapsible className="w-full space-y-1">
                                                {category.diseases.map(disease => (
                                                    <AccordionItem key={disease.title} value={disease.title} className="border-0">
                                                        <AccordionTrigger className="p-1 text-primary hover:no-underline">
                                                          {disease.title}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-4 border-t mt-1">
                                                          <DiseaseDetail disease={disease} />
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
