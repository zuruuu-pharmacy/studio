
"use client";

import { useState } from 'react';
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Stethoscope, Dna, FileText, Bot, Book, Zap, FlaskConical, GitBranch, Heart, Wind, Brain, Bone, CircleEllipsis, TestTube, Microscope, Droplet, User, Video, Mic, Notebook, BookCopy, CaseSensitive, FileHeart, HelpCircle, Target, CheckCircle, GitCommit, CalendarClock, BookA, ShieldAlert, BrainCircuit, Lightbulb, ShieldCheck, ListChecks } from 'lucide-react';
import { systemicPathologyData, type Disease } from "./data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
             <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold">{disease.title}</h3>
                    {disease.synonyms && <p className="text-sm text-muted-foreground italic">Also known as: {disease.synonyms}</p>}
                </div>
                <div className="flex flex-wrap gap-2 mt-2 shrink-0 ml-4">
                    <Badge variant="outline">{disease.tags.organ}</Badge>
                    <Badge variant="outline">{disease.tags.category}</Badge>
                    <Badge variant={disease.tags.level === 'Basic' ? 'secondary' : disease.tags.level === 'Intermediate' ? 'default' : 'destructive'}>
                        {disease.tags.level}
                    </Badge>
                </div>
            </div>
        </div>
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-7">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pathogenesis">Pathogenesis</TabsTrigger>
        <TabsTrigger value="morphology">Morphology</TabsTrigger>
        <TabsTrigger value="clinical">Clinical</TabsTrigger>
        <TabsTrigger value="investigations">Investigations</TabsTrigger>
        <TabsTrigger value="revision">Practice & Revision</TabsTrigger>
        <TabsTrigger value="metadata">Metadata</TabsTrigger>
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
      </TabsContent>
      <TabsContent value="metadata" className="pt-4 space-y-6">
         <DetailSection title="References & Suggested Reading" icon={BookA}>
            <div className="space-y-4">
                 <div>
                    <ul className="list-disc list-inside space-y-1">
                        {disease.references?.map((ref, i) => <li key={i}>{ref}</li>)}
                    </ul>
                 </div>
            </div>
        </DetailSection>
        <DetailSection title="Review & Version History" icon={GitCommit}>
             <div className="space-y-2 text-xs">
                <p><span className="font-semibold">Faculty Reviewer:</span> {disease.facultyReviewer || 'N/A'}</p>
                <p><span className="font-semibold">Last Reviewed:</span> {disease.dateReviewed || 'N/A'}</p>
                <ul className="list-disc list-inside space-y-1 pt-2">
                    {disease.versionHistory?.map((v, i) => <li key={i}><strong>v{v.version} ({v.date}):</strong> {v.changes}</li>)}
                </ul>
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
          <Accordion type="single" collapsible className="w-full space-y-3" defaultValue="Cardiovascular System">
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

      <div className="mt-6 space-y-3">
        <Accordion type="multiple" className="w-full space-y-4">
            <AccordionItem value="ai-integration" className="border-0">
                <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">
                    Product Development Documentation
                </AccordionTrigger>
                <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-3"><BrainCircuit className="h-6 w-6 text-primary"/>AI Integration Plan</CardTitle>
                                <CardDescription>How AI will be used to create and augment content.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <Alert variant="destructive">
                                    <ShieldAlert className="h-4 w-4" />
                                    <AlertTitle>Safety Note for AI</AlertTitle>
                                    <AlertDescription>
                                    All AI outputs must be flagged as “AI-draft” and require Faculty approval before publishing. Clinical management text must include “Check local guidelines” disclaimer.
                                    </AlertDescription>
                                </Alert>
                                <Accordion type="multiple" className="w-full space-y-2 mt-4">
                                    <AccordionItem value="summarizer"><AccordionTrigger>Summarizer</AccordionTrigger><AccordionContent className="p-4"><p className="font-mono text-xs bg-muted p-2 rounded-md">“Summarize this slide deck into 6 headings: Etiology, Pathogenesis, Morphology (Gross + Micro), Clinical Features, Investigations, Management. Keep each section ≤100 words and highlight 5 high-yield facts.”</p></AccordionContent></AccordionItem>
                                    <AccordionItem value="mcq"><AccordionTrigger>MCQ Generator</AccordionTrigger><AccordionContent className="p-4"><p className="font-mono text-xs bg-muted p-2 rounded-md">“Create 10 MCQs (2 easy, 5 moderate, 3 hard) about [disease]. Provide correct answer and 2-sentence explanation. Ensure distractors are plausible.”</p></AccordionContent></AccordionItem>
                                    <AccordionItem value="flashcard"><AccordionTrigger>Flashcard Generator</AccordionTrigger><AccordionContent className="p-4"><p className="font-mono text-xs bg-muted p-2 rounded-md">“From the summary, make 20 single-concept Q/A flashcards. Tag each card with a spaced-repetition interval suggestion (1d, 3d, 7d, 14d, 30d).”</p></AccordionContent></AccordionItem>
                                    <AccordionItem value="casewriter"><AccordionTrigger>Case-Writer</AccordionTrigger><AccordionContent className="p-4"><p className="font-mono text-xs bg-muted p-2 rounded-md">“Create a clinical vignette for a 55-year-old male with chest pain consistent with STEMI. Include ECG description, labs, and 5 targeted short answer questions with mark scheme.”</p></AccordionContent></AccordionItem>
                                    <AccordionItem value="imagetagger"><AccordionTrigger>Image Tagger / Captioner</AccordionTrigger><AccordionContent className="p-4"><p>Auto-label histology / radiology images (use a vision model trained on medical images). Always show predictions with confidence % and require human verification.</p></AccordionContent></AccordionItem>
                                    <AccordionItem value="search"><AccordionTrigger>Semantic Search / Q&amp;A</AccordionTrigger><AccordionContent className="p-4"><p>Embeddings for content so students can ask: “Find diseases that cause hepatomegaly and dark urine” and get ranked list.</p></AccordionContent></AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3"><ListChecks className="h-6 w-6 text-primary"/>Content Quality Control Workflow</CardTitle>
                                <CardDescription>A stepwise process to ensure content accuracy and reliability.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                                    <li><strong>Draft:</strong> An author, assisted by AI tools, creates the initial version of a disease page based on the standardized template. The content is marked as `DRAFT`.</li>
                                    <li><strong>Peer Review:</strong> The draft is assigned to two peer reviewers. They can add comments and suggest changes. The system highlights differences between versions.</li>
                                    <li><strong>Faculty Verification:</strong> A senior faculty member reviews the peer-checked draft, makes final edits, and verifies its accuracy. Upon approval, the status changes to `VERIFIED`.</li>
                                    <li><strong>Publish:</strong> The verified content is published and becomes visible to students. The version number is updated (e.g., v1.0).</li>
                                    <li><strong>Feedback Loop:</strong> Students can use a "Report Error" button on any page. This flags the content and creates a ticket in an editor queue, putting the page back into a `REVIEW_REQUESTED` state for the next update cycle.</li>
                                </ol>
                            </CardContent>
                        </Card>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </div>

    </div>
  );
}
