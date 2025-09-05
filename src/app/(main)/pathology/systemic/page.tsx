
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Wind, Brain, Bone, CircleEllipsis, TestTube, Dna } from 'lucide-react';
import { systemicPathologyData } from "./data";
import { Button } from "@/components/ui/button";

const organIcons: { [key: string]: React.ElementType } = {
    "Cardiovascular System": Heart,
    "Respiratory System": Wind,
    "Nervous System": Brain,
    "Gastrointestinal System": CircleEllipsis,
    "Renal System": TestTube,
    "Musculoskeletal System": Bone,
};

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
                                            <ul className="space-y-1">
                                                {category.diseases.map(disease => (
                                                    <li key={disease.title}>
                                                        <Button variant="link" className="p-0 h-auto font-normal">
                                                            {disease.title}
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
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
