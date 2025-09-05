
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Droplet, TestTube, Microscope, CheckCircle, Video, Zap, Notebook, Mic } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

const hematologyTopics = [
    {
        title: "Disorders of Red Blood Cells",
        icon: Droplet,
        content: "Covers various types of anemias, including iron deficiency, megaloblastic (B12/folate deficiency), hemolytic anemias, and hemoglobinopathies like sickle cell disease and thalassemia."
    },
    {
        title: "Disorders of White Blood Cells",
        icon: Microscope,
        content: "Focuses on both benign conditions (leukocytosis, leukopenia) and malignant disorders. This includes leukemias (acute and chronic), lymphomas (Hodgkin and Non-Hodgkin), and plasma cell disorders like multiple myeloma."
    },
    {
        title: "Disorders of Hemostasis",
        icon: TestTube,
        content: "Explores the mechanisms of blood clotting and disorders that lead to bleeding (e.g., hemophilias, von Willebrand disease, thrombocytopenia) or thrombosis (e.g., Factor V Leiden)."
    },
    {
        title: "Blood Banking & Transfusion Medicine",
        icon: CheckCircle,
        content: "Covers the principles of blood grouping (ABO/Rh systems), cross-matching, component therapy (packed red cells, platelets, plasma), and the investigation of transfusion reactions."
    }
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

export default function HematologyPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Hematology & Blood Banking</h1>
      <p className="text-muted-foreground mb-6">
        An overview of blood-related diseases and transfusion science.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Key Topics in Hematology</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {hematologyTopics.map((topic, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-background/50">
                <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <topic.icon className="h-6 w-6 text-primary" />
                    {topic.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 space-y-4">
                  <p className="text-muted-foreground">{topic.content}</p>
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
