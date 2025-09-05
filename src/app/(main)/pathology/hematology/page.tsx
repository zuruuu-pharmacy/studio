
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Droplet, TestTube, Microscope, CheckCircle, Video, Zap, Notebook, Mic, User, Database, Bot, FileText, BarChart, GitCompareArrows, Calendar, Truck, ShieldCheck, Siren } from 'lucide-react';
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
        content: `
This module functions as a diagnostic and educational tool for common red blood cell (RBC) disorders, focusing on anemia, polycythemia, and hemoglobinopathies.

**User Interface (UI) & Interaction:** The user, likely a healthcare professional or a medical student, would enter patient data through a series of interactive forms.

**Data Input:** Fields would include a complete blood count (CBC) with RBC indices (e.g., MCV, MCH, MCHC), reticulocyte count, and clinical symptoms (e.g., fatigue, pallor, jaundice).

**AI-Powered Morphological Analysis:** This is where the AI component is critical. The user would be prompted to upload a digital image of a peripheral blood smear. An AI-driven algorithm, specifically a Convolutional Neural Network (CNN), would analyze the image.
*   **Step 1: Cell Segmentation:** The AI first identifies and isolates individual cells (RBCs, WBCs, platelets) in the image.
*   **Step 2: Feature Extraction:** It then extracts complex features from each RBC, such as its size (microcytic, normocytic, macrocytic), shape (poikilocytosis with specific forms like sickle cells or spherocytes), color (hypochromic, normochromic), and the presence of any inclusions (e.g., Howell-Jolly bodies, Pappenheimer bodies).
*   **Step 3: Classification & Diagnosis:** The AI compares these features against a massive, pre-trained dataset of healthy and diseased blood smears. It generates a probabilistic diagnosis (e.g., "High likelihood of Iron Deficiency Anemia (85% confidence)") and highlights the specific morphological abnormalities that led to the conclusion.

**AI-Driven Diagnostic Workflow:**
*   **Differential Diagnosis Generation:** Based on the user's clinical inputs and the AI's morphological analysis, the app would generate a comprehensive differential diagnosis list, ranked by probability.
*   **Guidance for Further Testing:** The app would recommend the next logical steps for a definitive diagnosis, such as ordering specific tests (e.g., serum ferritin levels for iron studies, hemoglobin electrophoresis for hemoglobinopathies, or a bone marrow biopsy for suspected aplastic anemia).
*   **Educational Overlay:** Each diagnosis would link to an in-depth educational module, featuring a complex pathway diagram illustrating the pathophysiology, a list of associated symptoms, and a summary of standard treatment protocols.
`
    },
    {
        title: "Disorders of White Blood Cells",
        icon: Microscope,
        content: `
This module would provide a detailed framework for understanding and diagnosing both benign and malignant white blood cell (WBC) disorders.

**UI & Interaction:** The module would be a guided, interactive journey through complex hematological data.

**Data Aggregation:** The user would input CBC results with differential counts (neutrophils, lymphocytes, monocytes, eosinophils, basophils). The app would also allow for the input of genetic and molecular test results, such as chromosome karyotype analysis and gene sequencing data (e.g., JAK2 mutation status).

**AI-Powered Risk Stratification:** AI models, such as Gradient Boosting Machines (GBMs), would be used to perform risk stratification for conditions like myelodysplastic syndromes (MDS) or various leukemias.
*   **Step 1: Data Integration:** The AI model would ingest all a patient's data, including demographics, clinical symptoms, CBC results, and genetic markers.
*   **Step 2: Pattern Recognition:** It would analyze these data points to identify subtle, non-obvious patterns that correlate with disease progression or treatment response.
*   **Step 3: Prognostic Report:** The AI would then generate a detailed prognostic report, estimating the patient's risk of disease progression, and suggesting the most effective treatment approach based on similar patient profiles in its database.

**Interactive Pathophysiology:**
*   **Cell Lineage Pathway:** The app would feature an animated diagram of hematopoiesis, allowing the user to tap on different stages (e.g., myeloid stem cell, lymphoid progenitor) to see how various disorders disrupt the normal maturation process.
*   **Treatment Optimization:** For conditions like leukemia, the app could simulate different chemotherapy regimens, showing how each drug targets specific cell types or genetic mutations, thus helping in optimizing a personalized treatment plan.
`
    },
    {
        title: "Disorders of Hemostasis",
        icon: TestTube,
        content: `
This module would provide a complex, animated simulation of the coagulation cascade, allowing users to visualize and understand bleeding and thrombotic disorders.

**UI & Interaction:** The module would be highly visual and interactive, resembling a sophisticated educational game or simulation.

**Animated Cascade:** The main screen would show a complex, multi-layered animation of the coagulation cascade, from the initial vascular spasm to the final fibrin clot formation.

**Interactive Pathways:** Each clotting factor (e.g., Factor VIII, Factor IX) and platelet would be an interactive element. The user could "tap" on a factor to see its role in both the intrinsic and extrinsic pathways, as well as its common deficiencies.

**Simulated Disorders:** The user could select a specific disorder, such as Hemophilia A. The simulation would then play out the cascade, showing where the process fails due to the missing factor. The app would visually demonstrate the resulting prolonged bleeding time.

**Diagnostic & Management Flow:**
*   **Algorithmic Test Interpretation:** The app would guide the user through a diagnostic algorithm. For example, if the user enters a prolonged Prothrombin Time (PT) and a normal Activated Partial Thromboplastin Time (aPTT), the app's logic would systematically rule out various disorders and suggest a liver function test or a vitamin K deficiency workup.
*   **Treatment Strategy Simulation:** For thrombotic disorders like Deep Vein Thrombosis (DVT), the app could simulate the effects of different anticoagulant therapies (e.g., Warfarin, Heparin), showing how each drug inhibits a specific part of the coagulation pathway to prevent clot formation.
`
    },
    {
        title: "Blood Banking & Transfusion Medicine",
        icon: CheckCircle,
        content: `
This module would be a comprehensive and dynamic platform for managing and learning about the entire blood transfusion process, from donor to recipient.

**UI & Interaction:** This module would be designed with a strong focus on safety, logistics, and real-time data.

**Donor Management:**
*   **Donor Profile:** The app would have a detailed donor profile with a full donation history, blood type, and deferral status.
*   **Scheduling & Reminders:** It would allow donors to schedule appointments and receive push notifications for their eligibility to donate.

**Blood Component Inventory:**
*   **Real-time Inventory Dashboard:** A dashboard would display the current inventory of each blood component (RBCs, platelets, plasma) by blood type (A, B, O, AB) and Rh factor, with an alert system for critical shortages.
*   **Logistics & Tracking:** Barcode or QR code scanning technology would be integrated for a "vein-to-vein" tracking system. Each unit of blood would be scanned at every step of its journey: collection, processing, testing, storage, and administration. This ensures complete traceability and patient safety.

**AI & Safety Features:**
*   **AI-Powered Compatibility Checker:** At the point of transfusion, a user (e.g., a nurse or a technician) would scan the patient's wristband and the blood bag. An AI algorithm would perform a real-time, triple-check verification of blood type, cross-match results, and patient identity to prevent transfusion errors. The system would lock out the user if any incompatibility is detected, providing an immediate error message and rationale.
*   **Predictive Demand Forecasting:** The AI could analyze historical transfusion data, seasonal trends, and local hospital demand to predict future blood needs. This would allow blood banks to optimize collection schedules and prevent shortages.
*   **Transfusion Reaction Protocol:** In the event of a transfusion reaction, the app would immediately guide the user through a detailed, step-by-step protocol, from stopping the transfusion to documenting symptoms and collecting samples for the blood bank.
`
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
                  <p className="text-muted-foreground whitespace-pre-wrap">{topic.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
