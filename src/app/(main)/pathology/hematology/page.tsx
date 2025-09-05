
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Droplet, TestTube, Microscope, CheckCircle } from 'lucide-react';

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
