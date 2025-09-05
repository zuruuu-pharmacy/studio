
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Droplet, TestTube, Microscope, CheckCircle, Video, Zap, Notebook, Mic, User, Database, Bot, FileText, BarChart, GitCompareArrows, Calendar, Truck, ShieldCheck, Siren, BrainCircuit, ListChecks, Lightbulb, UserPlus, FileUp } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

const hematologyTopics = [
    {
        title: "Disorders of Red Blood Cells",
        icon: Droplet,
        content: `This module functions as a diagnostic and educational tool for common red blood cell (RBC) disorders, focusing on anemia, polycythemia, and hemoglobinopathies.`,
        details: [
            { 
                title: "UI & Data Input", 
                icon: UserPlus,
                description: "The user, likely a healthcare professional or a medical student, would enter patient data through a series of interactive forms, including CBC with RBC indices, reticulocyte count, and clinical symptoms."
            },
            {
                title: "AI-Powered Morphological Analysis",
                icon: Bot,
                description: "The user uploads a digital image of a peripheral blood smear. A Convolutional Neural Network (CNN) then performs a multi-step analysis:",
                steps: [
                    "Cell Segmentation: Identifies and isolates individual cells (RBCs, WBCs, platelets).",
                    "Feature Extraction: Extracts features like size, shape (poikilocytosis), color, and inclusions (Howell-Jolly bodies).",
                    "Classification & Diagnosis: Compares features against a massive dataset to generate a probabilistic diagnosis (e.g., 'High likelihood of Iron Deficiency Anemia (85% confidence)')."
                ]
            },
            {
                title: "AI-Driven Diagnostic Workflow",
                icon: BrainCircuit,
                description: "Based on all inputs, the app provides a comprehensive decision support workflow:",
                steps: [
                    "Differential Diagnosis Generation: Creates a ranked list of possible conditions.",
                    "Guidance for Further Testing: Recommends the next logical tests (e.g., serum ferritin, hemoglobin electrophoresis).",
                    "Educational Overlay: Links each diagnosis to an in-depth module with pathophysiology diagrams and treatment protocols."
                ]
            }
        ]
    },
    {
        title: "Disorders of White Blood Cells",
        icon: Microscope,
        content: `This module provides a detailed framework for understanding and diagnosing both benign and malignant white blood cell (WBC) disorders.`,
         details: [
            { 
                title: "Data Aggregation", 
                icon: Database,
                description: "The user inputs CBC results with differential counts, along with genetic and molecular test results (e.g., karyotype analysis, JAK2 mutation status)."
            },
            {
                title: "AI-Powered Risk Stratification",
                icon: Bot,
                description: "AI models (e.g., Gradient Boosting Machines) are used to perform risk stratification for conditions like myelodysplastic syndromes (MDS) or various leukemias:",
                steps: [
                    "Data Integration: The AI ingests all patient data, including demographics, symptoms, CBC, and genetic markers.",
                    "Pattern Recognition: Analyzes data points to identify subtle patterns that correlate with disease progression or treatment response.",
                    "Prognostic Report: Generates a detailed prognostic report, estimating risk and suggesting the most effective treatment approach based on similar patient profiles."
                ]
            },
            {
                title: "Interactive Pathophysiology",
                icon: GitCompareArrows,
                description: "The module includes interactive educational tools:",
                steps: [
                    "Cell Lineage Pathway: An animated diagram of hematopoiesis allows users to see how various disorders disrupt normal cell maturation.",
                    "Treatment Optimization: Simulates different chemotherapy regimens, showing how each drug targets specific cell types or genetic mutations."
                ]
            }
        ]
    },
    {
        title: "Disorders of Hemostasis",
        icon: TestTube,
        content: `This module provides a complex, animated simulation of the coagulation cascade, allowing users to visualize and understand bleeding and thrombotic disorders.`,
        details: [
            { 
                title: "Animated Coagulation Cascade", 
                icon: Video,
                description: "The main screen shows a complex, multi-layered animation of the coagulation cascade. Each clotting factor and platelet is an interactive element, allowing users to explore its role and common deficiencies."
            },
             { 
                title: "Simulated Disorders", 
                icon: Bot,
                description: "Users can select a disorder (e.g., Hemophilia A) and watch the simulation play out, showing where the cascade fails and visually demonstrating the consequences, like prolonged bleeding time."
            },
             { 
                title: "Diagnostic & Management Flow", 
                icon: ListChecks,
                description: "The app provides guided diagnostic and treatment strategy tools:",
                 steps: [
                    "Algorithmic Test Interpretation: Guides the user through interpreting results like a prolonged PT with a normal aPTT, suggesting next steps like a liver function test.",
                    "Treatment Strategy Simulation: For conditions like DVT, the app simulates the effects of different anticoagulants (e.g., Warfarin, Heparin) on the coagulation pathway."
                ]
            },
        ]
    },
    {
        title: "Blood Banking & Transfusion Medicine",
        icon: CheckCircle,
        content: `This module is a comprehensive and dynamic platform for managing and learning about the entire blood transfusion process, from donor to recipient.`,
        details: [
             { 
                title: "Logistics & Inventory", 
                icon: Truck,
                description: "Features for managing the blood supply chain:",
                 steps: [
                    "Donor Management: Detailed donor profiles with donation history, blood type, and scheduling/reminders.",
                    "Real-time Inventory Dashboard: Displays current inventory of all blood components by type, with alerts for critical shortages.",
                    "Vein-to-Vein Tracking: Barcode/QR code scanning at every step (collection, processing, storage, administration) for complete traceability."
                ]
            },
             { 
                title: "AI-Powered Safety Features", 
                icon: Bot,
                description: "Critical AI-driven tools to enhance patient safety and resource management:",
                 steps: [
                    "AI Compatibility Checker: At the point of transfusion, scanning the patient wristband and blood bag triggers a real-time, triple-check verification. The system locks out the user if any incompatibility is detected.",
                    "Predictive Demand Forecasting: Analyzes historical data and local demand to predict future blood needs, optimizing collection schedules.",
                    "Transfusion Reaction Protocol: In the event of a reaction, the app provides an immediate, step-by-step emergency protocol."
                ]
            },
        ]
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
          <Accordion type="single" collapsible className="w-full space-y-3" defaultValue="item-0">
            {hematologyTopics.map((topic, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg bg-background/50">
                <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <topic.icon className="h-6 w-6 text-primary" />
                    {topic.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 space-y-4">
                  <p className="italic text-muted-foreground">{topic.content}</p>
                   {topic.details && topic.details.map((detail, detailIndex) => (
                        <Card key={detailIndex} className="bg-background">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><detail.icon className="h-5 w-5 text-primary"/>{detail.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">{detail.description}</p>
                                {detail.steps && (
                                    <ul className="list-disc list-inside space-y-2 text-sm">
                                        {detail.steps.map((step, stepIndex) => <li key={stepIndex}>{step}</li>)}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                   ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
