
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Map, PlusCircle, Calendar, Bot, CheckCircle, Milestone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const clinicalRoadmap = {
  title: "Clinical Hospital Pharmacist Roadmap (0-5 Years)",
  stages: [
    {
      title: "Year 1 (0-12 months): Foundational Experience",
      tasks: [
        "Complete final-year clinical rotations (especially ward rounds, ICU exposure).",
        "Attend all available hospital orientation and infection control training sessions.",
        "Proactively shadow a senior clinical pharmacist on at least 4 different ward rounds.",
        "Enroll in and complete a 'Hospital Pharmacy Practice' short course or certification.",
      ]
    },
    {
      title: "Year 2 (12-24 months): Secure Position & Early Growth",
      tasks: [
        "Apply for hospital junior pharmacist positions or a formal residency program.",
        "Successfully pass all provincial/national registration exams.",
        "Begin preparing and delivering monthly clinical case presentations to peers or mentors.",
      ]
    },
    {
      title: "Year 3 (24-36 months): Specialization & Advanced Skills",
      tasks: [
        "Complete residency program or an advanced clinical diploma.",
        "Obtain ACLS/ATLS certification if pursuing critical care or ICU rotation exposure.",
      ]
    },
    {
      title: "Years 4-5 (36-60 months): Leadership & Expertise",
      tasks: [
        "Aim for a specialist pharmacist role (e.g., anticoagulation lead, infectious disease pharmacist).",
        "Publish at least one clinical audit or case report in a recognized journal.",
        "Seek mentorship from a senior clinical pharmacist.",
        "Begin studying for BCPS or an equivalent international certification if aiming for overseas practice.",
      ]
    }
  ]
};

const regulatoryRoadmap = {
    title: "Regulatory Affairs (Industry) Roadmap (0-5 Years)",
    stages: [
        {
            title: "Year 1 (0-12 months): Entry & Foundational Knowledge",
            tasks: [
                "Secure an internship in a QA/QC or Regulatory Affairs department of a pharmaceutical company.",
                "Complete a foundational GMP (Good Manufacturing Practices) awareness course.",
                "Undergo training on document control and management systems.",
            ]
        },
        {
            title: "Year 2 (12-24 months): Junior Officer Role",
            tasks: [
                "Transition into a Junior RA Officer role, focusing on preparing submission sections and ensuring labeling compliance.",
                "Enroll in and complete the RAPS or a local RA certification program.",
            ]
        },
        {
            title: "Year 3 (24-36 months): Gaining Independence",
            tasks: [
                "Take the lead on submitting small dossiers or variations.",
                "Act as a point of contact for minor communications with regulatory authorities.",
                "Develop deep expertise in the Common Technical Document (CTD/eCTD) format.",
            ]
        },
        {
            title: "Years 4-5 (36-60 months): Senior & Strategic Role",
            tasks: [
                "Transition to a Senior RA Officer or Assistant Manager role.",
                "Provide strategic input on regulatory strategy for new products.",
                "Offer regulatory support for clinical trial applications and processes.",
                "Attend regulatory workshops and network with local authority officers.",
            ]
        }
    ]
};


export function RoadmapBuilderClient() {

  const handleTemplateClick = () => {
    toast({
        title: "Coming Soon!",
        description: "This will auto-populate your timeline with the selected template's milestones."
    })
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left Panel: Timeline */}
        <div className="lg:col-span-2">
             <Card>
                <CardHeader>
                    <CardTitle>Career Roadmap Templates</CardTitle>
                    <CardDescription>Select a template to view a sample career progression. Use the toolbox to build your own custom plan.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Accordion type="single" collapsible className="w-full space-y-4">
                        <AccordionItem value="clinical" className="border rounded-lg bg-background/50">
                            <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">{clinicalRoadmap.title}</AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 space-y-4">
                                {clinicalRoadmap.stages.map((stage, index) => (
                                    <div key={index}>
                                        <h4 className="font-semibold flex items-center gap-2"><Milestone className="h-4 w-4 text-primary"/>{stage.title}</h4>
                                        <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-muted-foreground">
                                            {stage.tasks.map((task, i) => <li key={i}>{task}</li>)}
                                        </ul>
                                    </div>
                                ))}
                                 <Button onClick={handleTemplateClick} className="mt-4">Use this Template</Button>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="regulatory" className="border rounded-lg bg-background/50">
                            <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">{regulatoryRoadmap.title}</AccordionTrigger>
                             <AccordionContent className="px-6 pb-4 space-y-4">
                                {regulatoryRoadmap.stages.map((stage, index) => (
                                    <div key={index}>
                                        <h4 className="font-semibold flex items-center gap-2"><Milestone className="h-4 w-4 text-primary"/>{stage.title}</h4>
                                        <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-muted-foreground">
                                            {stage.tasks.map((task, i) => <li key={i}>{task}</li>)}
                                        </ul>
                                    </div>
                                ))}
                                <Button onClick={handleTemplateClick} className="mt-4">Use this Template</Button>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
        {/* Right Panel: Toolbox */}
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>My Custom Roadmap</CardTitle>
                    <CardDescription>Use the tools below to build your own personalized career plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start" disabled><PlusCircle className="mr-2"/>Add Custom Milestone</Button>
                    <Button variant="outline" className="w-full justify-start" disabled><Calendar className="mr-2"/>Add Application Deadline</Button>
                    <Button variant="outline" className="w-full justify-start" disabled><Bot className="mr-2"/>Get AI Suggestions</Button>
                    <hr/>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Your interactive timeline will be built here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}
