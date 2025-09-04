
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, Building, Hospital, FlaskConical, Book, UserTie, BrainCircuit, Rocket } from "lucide-react";
import { BackButton } from "@/components/back-button";


const careerPaths = [
    {
        title: "Clinical Pharmacy",
        icon: Hospital,
        description: "Work directly with physicians and patients to optimize medication use, typically in a hospital or clinic setting.",
        details: {
            "Key Responsibilities": "Patient medication reviews, therapeutic drug monitoring, patient counseling, participating in ward rounds.",
            "Required Skills": "Strong clinical knowledge, communication skills, problem-solving, patient assessment.",
            "Potential Job Titles": "Clinical Pharmacist, Hospital Pharmacist, Ambulatory Care Pharmacist, Critical Care Pharmacist."
        }
    },
    {
        title: "Industrial Pharmacy",
        icon: Building,
        description: "Focus on the discovery, development, and manufacturing of pharmaceutical drugs.",
        details: {
            "Key Responsibilities": "Research & Development (R&D), Quality Assurance (QA), Quality Control (QC), Production, Formulation Development.",
            "Required Skills": "Scientific research, analytical skills, understanding of GMP (Good Manufacturing Practices), project management.",
            "Potential Job Titles": "Formulation Scientist, QA Officer, Production Pharmacist, R&D Scientist."
        }
    },
     {
        title: "Community & Hospital Pharmacy",
        icon: Briefcase,
        description: "Serve as the most accessible healthcare professionals, dispensing medications and providing public health advice.",
        details: {
            "Key Responsibilities": "Dispensing prescriptions, patient counseling, managing inventory, providing OTC advice, health screenings.",
            "Required Skills": "Accuracy, patient communication, retail management, knowledge of common ailments.",
            "Potential Job Titles": "Community Pharmacist, Retail Pharmacist, Pharmacy Manager, Hospital Staff Pharmacist."
        }
    },
    {
        title: "Regulatory Affairs & Research",
        icon: FlaskConical,
        description: "Ensure that drugs meet government regulations and oversee clinical trials and research.",
        details: {
            "Key Responsibilities": "Preparing drug registration dossiers (e.g., CTD), liaising with health authorities, ensuring compliance, managing clinical trial protocols.",
            "Required Skills": "Attention to detail, understanding of drug laws, scientific writing, data analysis.",
            "Potential Job Titles": "Regulatory Affairs Officer, Clinical Research Associate (CRA), Medical Science Liaison (MSL)."
        }
    },
     {
        title: "Academia & Education",
        icon: Book,
        description: "Educate the next generation of pharmacists and conduct academic research.",
        details: {
            "Key Responsibilities": "Teaching, curriculum development, conducting research, publishing papers, mentoring students.",
            "Required Skills": "Deep subject matter expertise, teaching and presentation skills, research methodology, grant writing.",
            "Potential Job Titles": "Lecturer, Assistant Professor, Professor, Dean of Pharmacy."
        }
    },
    {
        title: "Entrepreneurship & Management",
        icon: Rocket,
        description: "Start your own pharmacy, consulting firm, or tech startup in the health sector.",
        details: {
            "Key Responsibilities": "Business planning, financial management, marketing, staff management, innovation.",
            "Required Skills": "Business acumen, leadership, risk-taking, networking, financial literacy.",
            "Potential Job Titles": "Pharmacy Owner, Healthcare Consultant, CEO of Health-Tech Startup."
        }
    },
     {
        title: "AI & Pharmacoinformatics",
        icon: BrainCircuit,
        description: "Leverage data and technology to improve drug discovery, patient care, and health systems.",
        details: {
            "Key Responsibilities": "Analyzing health data, developing clinical decision support systems, using AI for drug discovery, managing electronic health records (EHR).",
            "Required Skills": "Data analysis, programming (e.g., Python), understanding of AI/ML models, knowledge of health IT systems.",
            "Potential Job Titles": "Pharmacoinformatics Specialist, Clinical Data Analyst, AI in Medicine Researcher, Health IT Consultant."
        }
    }
];

export default function ExplorePathsPage() {
  return (
    <>
        <h1 className="text-3xl font-bold mb-2 font-headline">Explore Career Paths</h1>
        <p className="text-muted-foreground mb-6">
            Explore the diverse roles a degree in pharmacy can lead to. Click on any path to see more details.
        </p>
        <Card>
            <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {careerPaths.map((path) => (
                         <AccordionItem key={path.title} value={path.title} className="border rounded-lg bg-background/50">
                            <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                               <div className="flex items-center gap-4">
                                 <path.icon className="h-8 w-8 text-primary"/>
                                 <div>
                                    <p>{path.title}</p>
                                    <p className="text-sm text-muted-foreground font-normal text-left">{path.description}</p>
                                 </div>
                               </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 space-y-4">
                                {Object.entries(path.details).map(([key, value]) => (
                                    <div key={key}>
                                        <h4 className="font-semibold text-base">{key}</h4>
                                        <p className="text-muted-foreground">{value}</p>
                                    </div>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    </>
  );
}
