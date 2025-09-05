
"use client";

import { useState } from 'react';
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Stethoscope, Dna, FileText, Bot, Book, Zap, FlaskConical, GitBranch, Heart, Wind, Brain, Bone, CircleEllipsis, TestTube, Microscope, Droplet, Target, CheckCircle, Video, Mic, Notebook, BookCopy, CaseSensitive, FileHeart, HelpCircle, GitCommit, CalendarClock, BookA } from 'lucide-react';
import { systemicPathologyData, type Disease } from "./data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

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
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pathogenesis">Pathogenesis</TabsTrigger>
        <TabsTrigger value="morphology">Morphology</TabsTrigger>
        <TabsTrigger value="clinical">Clinical</TabsTrigger>
        <TabsTrigger value="investigations">Investigations</TabsTrigger>
        <TabsTrigger value="revision">Practice & Revision</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-4 space-y-4">
        <div className="flex justify-between items-start">
          <p className="italic flex-1">{disease.overview}</p>
          <Link href="/text-to-speech">
              <Button variant="ghost" size="sm" className="ml-4">
                  <Mic className="mr-2"/>Listen
              </Button>
          </Link>
        </div>
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
            <p className="whitespace-pre-wrap">{disease.investigations}</p>
         </DetailSection>
          <DetailSection title="Management Overview" icon={CheckCircle}>
            <p className="whitespace-pre-wrap">{disease.management}</p>
         </DetailSection>
      </TabsContent>
       <TabsContent value="revision" className="pt-4 space-y-6">
        <DetailSection title="Visual Learning" icon={Video}>
            <div className="flex flex-wrap gap-2">
                <Link href="/moa-animations">
                    <Button variant="outline"><Microscope className="mr-2"/>Virtual Microscope</Button>
                </Link>
                <Link href="/moa-animations"><Button variant="outline"><Video className="mr-2"/>3D Animation</Button></Link>
            </div>
        </DetailSection>
         <DetailSection title="Practice Questions & Revision" icon={Zap}>
            <div className="flex flex-wrap gap-2">
                <Link href="/mcq-bank"><Button variant="outline" size="sm">MCQs</Button></Link>
                <Link href="/flashcard-generator"><Button variant="outline" size="sm">Flashcards</Button></Link>
                <Link href="/clinical-case-simulator"><Button variant="outline" size="sm">Case Simulation</Button></Link>
            </div>
        </DetailSection>
        <DetailSection title="Personal Notes" icon={Notebook}>
            <Link href="/notes-organizer"><Button variant="secondary" size="sm">Add Note</Button></Link>
        </DetailSection>
         <DetailSection title="References & Metadata" icon={BookA}>
            <div className="space-y-4">
                 <div>
                    <h5 className="font-semibold mb-1 text-sm">Suggested Reading</h5>
                    <ul className="list-disc list-inside space-y-1">
                        {disease.references?.map((ref, i) => <li key={i}>{ref}</li>)}
                    </ul>
                 </div>
                  <div>
                    <h5 className="font-semibold mb-1 text-sm">Review Information</h5>
                    <p><span className="font-semibold">Faculty Reviewer:</span> {disease.facultyReviewer || 'N/A'}</p>
                    <p><span className="font-semibold">Last Reviewed:</span> {disease.dateReviewed || 'N/A'}</p>
                 </div>
                 <div>
                    <h5 className="font-semibold mb-1 text-sm">Version History</h5>
                    <ul className="list-disc list-inside space-y-1">
                        {disease.versionHistory?.map((v, i) => <li key={i}><strong>v{v.version} ({v.date}):</strong> {v.changes}</li>)}
                    </ul>
                 </div>
            </div>
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
