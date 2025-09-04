
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";
import { Briefcase, Building, Hospital, FlaskConical, Book, UserTie, BrainCircuit, Rocket, Activity, Target, ShieldCheck } from "lucide-react";


const careerPaths = [
    {
        title: "Clinical Pharmacy",
        icon: Hospital,
        description: "Optimize medication therapy and promote health, wellness, and disease prevention in patient care settings.",
        details: {
            "Typical Job Titles": "Hospital Pharmacist, Ambulatory Care Pharmacist, Critical Care Specialist.",
        }
    },
    {
        title: "Hospital Practice",
        icon: Briefcase,
        description: "Manage medication distribution, sterile compounding, and pharmacy operations within a hospital.",
         details: {
            "Typical Job Titles": "Staff Pharmacist, Pharmacy Operations Manager, IV Admixture Pharmacist.",
        }
    },
    {
        title: "Industry R&D",
        icon: FlaskConical,
        description: "Focus on drug discovery, formulation development, and bringing new medicines to market.",
        details: {
            "Typical Job Titles": "Formulation Scientist, R&D Scientist, Analytical Chemist.",
        }
    },
    {
        title: "Regulatory Affairs",
        icon: ShieldCheck,
        description: "Ensure that pharmaceutical products meet government regulations for safety and efficacy.",
         details: {
            "Typical Job Titles": "Regulatory Affairs Officer, Compliance Specialist, Medical Writer.",
        }
    },
    {
        title: "Academia & Research",
        icon: Book,
        description: "Educate future pharmacists and conduct scholarly research to advance the pharmacy profession.",
        details: {
            "Typical Job Titles": "Assistant Professor, Lecturer, Research Fellow.",
        }
    },
     {
        title: "Pharmacovigilance",
        icon: Activity,
        description: "Monitor, detect, assess, and prevent adverse effects of pharmaceutical products.",
         details: {
            "Typical Job Titles": "Drug Safety Associate, PV Scientist, Safety Surveillance Physician.",
        }
    },
     {
        title: "Clinical Trials/CRO",
        icon: Target,
        description: "Manage and monitor clinical trials for new drugs at Contract Research Organizations (CROs).",
         details: {
            "Typical Job Titles": "Clinical Research Associate (CRA), Project Manager, Data Manager.",
        }
    },
    {
        title: "Medical Affairs",
        icon: UserTie,
        description: "Bridge the gap between a pharmaceutical company and the medical community.",
        details: {
            "Typical Job Titles": "Medical Science Liaison (MSL), Medical Advisor, Scientific Communications Manager.",
        }
    },
    {
        title: "Entrepreneurship",
        icon: Rocket,
        description: "Start a pharmacy, consulting firm, or health-tech venture.",
        details: {
            "Typical Job Titles": "Pharmacy Owner, Healthcare Consultant, Startup Founder.",
        }
    },
     {
        title: "AI & Pharmacoinformatics",
        icon: BrainCircuit,
        description: "Leverage data and technology to improve drug discovery, patient care, and health systems.",
        details: {
            "Typical Job Titles": "Pharmacoinformatics Specialist, Clinical Data Analyst, Health IT Consultant.",
        }
    }
];

export default function ExplorePathsPage() {
  return (
    <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Explore Career Paths</h1>
        <p className="text-muted-foreground mb-6">
            Discover the diverse roles a pharmacy degree can lead to. Explore the details for each path.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerPaths.map((path) => (
                <Card key={path.title} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-4 mb-2">
                             <path.icon className="h-10 w-10 text-primary"/>
                            <CardTitle>{path.title}</CardTitle>
                        </div>
                        <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow">
                         <div>
                            <h4 className="font-semibold text-sm">Typical Job Titles</h4>
                            <p className="text-sm text-muted-foreground">{path.details["Typical Job Titles"]}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="secondary" className="w-full" disabled>See Roadmap (Coming Soon)</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
