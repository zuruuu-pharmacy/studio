
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Briefcase, Building, Hospital, FlaskConical, Book, UserTie, BrainCircuit, Rocket, Activity, CheckCircle, GraduationCap, Star, BarChart, HardHat, Link as LinkIcon, DollarSign } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import Link from 'next/link';


const careerPaths = [
    {
        title: "Clinical Pharmacy",
        icon: Hospital,
        shortDescription: "Work directly with physicians and patients on ward rounds to optimize medication use, review prescriptions, and monitor outcomes.",
        dayToDay: "A sample day might include: Morning ward rounds with the medical team, reviewing patient charts, therapeutic drug monitoring (TDM), providing drug information to doctors/nurses, patient counseling on new medications, and attending clinical meetings.",
        entryRequirements: "Pharm.D is the standard. A hospital residency or extensive clinical internship is highly recommended. For research-focused roles, an M.Sc. or Ph.D. is often required. Registration with the national pharmacy council is mandatory.",
        typicalFirstJobs: "Hospital Ward Pharmacist, Junior Clinical Pharmacist, Ambulatory Care Pharmacist.",
        skills: {
            technical: ["Therapeutic decision-making", "INR/anticoagulation management", "TDM", "Guideline interpretation"],
            soft: ["Communication with healthcare team", "Patient counseling", "Empathy", "Problem-solving"],
            tools: ["Electronic Health Records (EHR)", "Medication Management Software", "Clinical Decision Support Systems"],
        },
        certifications: "Post-graduate diplomas in clinical pharmacy, Board Certified Pharmacotherapy Specialist (BCPS - US), local clinical pharmacy diplomas.",
        timeline: "Year 0–1: Ward internships and rotations. Year 1–3: Residency or entry-level clinical role. Year 3+: Specialist role (e.g., cardiology, oncology) or lead clinical pharmacist.",
        salaryBand: "USA: Median annual wage is ~$137,480 (Source: US BLS, May 2024). Pakistan: Entry-level roles may start around PKR 60-90k/month, with significant growth potential (Source: local job postings, Payscale). Ranges vary widely by employer and location.",
        demand: "High (Local), Very High (International)",
        alumni: [
            { name: "Dr. Aisha Baig", role: "Cardiology Pharmacist, National Hospital" },
            { name: "Dr. Usman Ali", role: "Oncology Clinical Specialist, SKMCH" },
        ]
    },
    {
        title: "Industrial Pharmacy & R&D",
        icon: Building,
        shortDescription: "Focus on the discovery, development, and manufacturing of pharmaceutical drugs in a laboratory or plant setting.",
        dayToDay: "Tasks vary widely: Formulation scientists may spend the day developing and testing new dosage forms. QA/QC officers ensure products meet specifications through testing and documentation. Production pharmacists oversee manufacturing lines.",
        entryRequirements: "Pharm.D or B.Pharm. For R&D, an M.Sc. or Ph.D. in a relevant field (e.g., Pharmaceutics, Chemistry) is often required.",
        typicalFirstJobs: "QA/QC Officer, Junior Formulation Scientist, Production Pharmacist.",
        skills: {
            technical: ["Formulation development", "Analytical chemistry (HPLC, GC)", "Good Manufacturing Practices (GMP)", "Statistical analysis"],
            soft: ["Attention to detail", "Project management", "Teamwork"],
            tools: ["Laboratory Information Management Systems (LIMS)", "Statistical software (SPSS/R)", "ERP systems"],
        },
        certifications: "GMP certification, Six Sigma, Quality Management certifications.",
        timeline: "Year 0–1: Internship/trainee role. Year 1–3: Officer/Executive level in QA, Production, or R&D. Year 3+: Managerial or senior scientist roles.",
        salaryBand: "Pakistan: Entry-level roles in production/QA range from PKR 50-80k/month. R&D roles with a PhD can command significantly higher salaries. International roles are highly competitive and well-compensated. (Source: SalaryExpert, local job postings).",
        demand: "High (Local), High (International)",
        alumni: [
            { name: "Mr. Bilal Khan", role: "Head of Production, Zuruu Pharma" },
        ]
    },
     {
        title: "Community & Hospital Pharmacy",
        icon: Briefcase,
        shortDescription: "Serve as accessible healthcare professionals, dispensing medications and providing public health advice in retail or hospital settings.",
        dayToDay: "Dispensing prescriptions, counseling patients on proper medication use and OTC products, managing inventory, conducting health screenings (e.g., blood pressure), and collaborating with local doctors.",
        entryRequirements: "Pharm.D or B.Pharm with relevant license to practice. Strong retail and customer service skills are crucial.",
        typicalFirstJobs: "Community Pharmacist, Retail Pharmacist, Staff Hospital Pharmacist.",
        skills: {
            technical: ["Dispensing accuracy", "Knowledge of common ailments and OTC drugs", "Inventory management"],
            soft: ["Patient communication", "Empathy", "Multitasking", "Commercial awareness"],
            tools: ["Pharmacy Management Software", "Dispensing robotics (in some settings)"],
        },
        certifications: "Immunization certification, MTM (Medication Therapy Management) certification.",
        timeline: "Year 0–1: Entry-level pharmacist. Year 1–3: Pharmacy Manager or senior pharmacist. Year 3+: Multi-store management or ownership.",
        salaryBand: "Pakistan: Varies based on location and ownership model, can range from PKR 40k to over 150k/month for managers/owners. USA: Median is similar to clinical pharmacist, ~$137,480/year (Source: US BLS, May 2024).",
        demand: "Very High (Local), Medium (International)",
        alumni: []
    },
    {
        title: "Regulatory Affairs",
        icon: FlaskConical,
        shortDescription: "Act as the bridge between the pharmaceutical company and regulatory agencies, ensuring drugs meet legal requirements.",
        dayToDay: "Preparing and compiling drug registration dossiers (like the CTD), communicating with health authorities (e.g., DRAP), reviewing marketing materials for compliance, and staying updated on changing regulations.",
        entryRequirements: "Pharm.D. Attention to detail and strong writing skills are paramount. Internships in regulatory departments are highly beneficial.",
        typicalFirstJobs: "Regulatory Affairs Intern, Junior Regulatory Affairs Officer.",
        skills: {
            technical: ["Understanding of drug laws and guidelines (e.g., DRAP, ICH)", "Scientific/Technical writing", "Dossier preparation (CTD/eCTD)"],
            soft: ["Meticulous attention to detail", "Negotiation skills", "Organizational skills"],
            tools: ["Regulatory submission portals", "Document management systems (e.g., Veeva)"],
        },
        certifications: "Regulatory Affairs Certification (RAC) is a globally recognized standard.",
        timeline: "Year 0–2: Junior Officer. Year 2–5: Senior Officer/Assistant Manager. Year 5+: Manager/Head of Regulatory Affairs.",
        salaryBand: "Pakistan: Starts around PKR 60-90k/month, with high growth potential due to its specialized nature. International roles are very well-compensated. (Source: local job postings, Payscale).",
        demand: "Medium (Local), High (International)",
        alumni: []
    },
];

function DetailSection({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon: React.ElementType }) {
    return (
        <div>
            <h4 className="font-semibold text-base mb-2 flex items-center gap-2"><Icon className="h-5 w-5 text-primary"/>{title}</h4>
            <div className="pl-7 text-muted-foreground text-sm space-y-2">{children}</div>
        </div>
    )
}

export default function ExplorePathsPage() {
  return (
    <>
        <BackButton />
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
                                    <p className="text-sm text-muted-foreground font-normal text-left">{path.shortDescription}</p>
                                 </div>
                               </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 space-y-6">
                                <DetailSection title="A Day in the Life" icon={Activity}><p>{path.dayToDay}</p></DetailSection>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    <DetailSection title="Entry Requirements" icon={GraduationCap}><p>{path.entryRequirements}</p></DetailSection>
                                    <DetailSection title="Typical First Jobs" icon={HardHat}><p>{path.typicalFirstJobs}</p></DetailSection>
                                </div>
                                
                                <DetailSection title="Skills Matrix" icon={CheckCircle}>
                                    <p><strong>Technical Skills:</strong> {path.skills.technical.join(', ')}</p>
                                    <p><strong>Soft Skills:</strong> {path.skills.soft.join(', ')}</p>
                                    <p><strong>Tools Familiarity:</strong> {path.skills.tools.join(', ')}</p>
                                </DetailSection>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <DetailSection title="Recommended Certifications" icon={Star}><p>{path.certifications}</p></DetailSection>
                                     <DetailSection title="Career Timeline" icon={BarChart}><p>{path.timeline}</p></DetailSection>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                     <DetailSection title="Salary & Demand" icon={DollarSign}>
                                        <p><strong>Salary Band:</strong> {path.salaryBand}</p>
                                        <p><strong>Job Market Demand:</strong> {path.demand}</p>
                                    </DetailSection>
                                     <DetailSection title="Alumni Network" icon={LinkIcon}>
                                        {path.alumni.length > 0 ? (
                                            <ul className="space-y-1">
                                                {path.alumni.map(alum => <li key={alum.name}>{alum.name} ({alum.role})</li>)}
                                            </ul>
                                        ) : <p>No alumni profiles for this path yet.</p>}
                                        <Button size="sm" variant="link" className="p-0 h-auto" disabled={path.alumni.length === 0}>Ask an Alum (Coming Soon)</Button>
                                    </DetailSection>
                                </div>
                                
                               <div className="pt-4">
                                  <Link href="/career-guidance/roadmap-builder">
                                    <Button>Start Roadmap for this Path</Button>
                                  </Link>
                               </div>

                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    </>
  );
}
