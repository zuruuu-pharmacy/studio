
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookText, Calculator, FlaskConical, ShieldAlert, ArrowRight, ScanEye, User, Users, TestTube, ShieldEllipsis, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMode } from "@/contexts/mode-context";
import { usePatient } from "@/contexts/patient-context";

const pharmacistTools = [
  {
    icon: Users,
    title: "Patients",
    description: "Manage patient records and select an active patient.",
    href: "/patients",
    color: "text-cyan-500",
  },
  {
    icon: User,
    title: "Patient History Form",
    description: "Add or edit detailed patient history.",
    href: "/patient-history",
    color: "text-blue-400",
  },
  {
    icon: BookText,
    title: "Drug Monograph Lookup",
    description: "Access comprehensive drug information.",
    href: "/monograph",
    color: "text-blue-500",
  },
  {
    icon: Calculator,
    title: "AI Dose Calculator",
    description: "Calculate patient-specific dosages.",
    href: "/dose-calculator",
    color: "text-green-500",
  },
  {
    icon: FlaskConical,
    title: "AI Interaction Engine",
    description: "Check for multi-drug interactions.",
    href: "/interaction-checker",
    color: "text-purple-500",
  },
  {
    icon: ShieldAlert,
    title: "Allergy Checker",
    description: "Identify potential allergies & cross-reactivity.",
    href: "/allergy-checker",
    color: "text-red-500",
  },
  {
    icon: ScanEye,
    title: "Prescription Reader",
    description: "Analyze a prescription image.",
    href: "/prescription-reader",
    color: "text-orange-500",
  },
  {
    icon: TestTube,
    title: "Lab Report Analyzer",
    description: "Interpret and analyze lab report data.",
    href: "/lab-analyzer",
    color: "text-indigo-500",
  },
   {
    icon: ShieldEllipsis,
    title: "Emergency",
    description: "Access emergency resources.",
    href: "/emergency",
    color: "text-red-600",
  },
];

const patientTools = [
    {
        icon: User,
        title: "My Patient History",
        description: "View or update your personal and medical information.",
        href: "/patient-history",
        color: "text-blue-400",
    },
    {
        icon: ShieldEllipsis,
        title: "Emergency",
        description: "Get information for emergency situations.",
        href: "/emergency",
        color: "text-red-600",
    }
];

const studentTools = [
    {
        icon: User,
        title: "My Patient History",
        description: "Fill out your personal health record for case studies.",
        href: "/patient-history",
        color: "text-blue-400",
    },
    {
        icon: Users,
        title: "View All Patient Cases",
        description: "View all patient records entered into the system for learning.",
        href: "/patients",
        color: "text-cyan-500",
    },
    {
        icon: ShieldEllipsis,
        title: "Emergency Information",
        description: "Get information for emergency situations.",
        href: "/emergency",
        color: "text-red-600",
    }
];


export default function DashboardPage() {
  const { mode } = useMode();
  const { patientState } = usePatient();
  const activeUser = patientState.activeUser;

  const tools = {
    'pharmacist': pharmacistTools,
    'patient': patientTools,
    'student': studentTools,
  }[mode] || [];
  
  const name = activeUser?.demographics?.name || (mode === 'patient' ? "Patient" : mode === 'student' ? 'Student' : 'Pharmacist');

  const headerTitle = {
    'pharmacist': "Welcome to Zuruu AI Pharmacy",
    'patient': `Welcome, ${name}`,
    'student': `Welcome, ${name}`,
  }[mode];
  
  const headerDescription = {
    'pharmacist': "Your AI-powered suite of clinical tools for enhanced pharmaceutical care. Start by managing your patients or explore the tools directly.",
    'patient': "This is your personal health dashboard. Access your history or get help in an emergency.",
    'student': "This is your student dashboard. Create your patient case study or review existing ones."
  }[mode];
  
  const headerButton = {
    'pharmacist': (
        <Link href="/patients" passHref>
            <Button variant="secondary" size="lg"><Users className="mr-2" /> Go to Patients</Button>
        </Link>
    ),
    'patient': (
        <Link href="/patient-history" passHref>
            <Button variant="secondary" size="lg"><User className="mr-2" /> My History</Button>
        </Link>
    ),
    'student': (
         <Link href="/patient-history" passHref>
            <Button variant="secondary" size="lg"><User className="mr-2" /> My Patient History</Button>
        </Link>
    )
  }[mode];

  const toolsHeader = {
    'pharmacist': 'Clinical Tools',
    'patient': 'Your Options',
    'student': 'Student Tools'
  }[mode]


  return (
      <div className="flex flex-col gap-8">
        <header className="relative bg-primary text-primary-foreground rounded-lg p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold font-headline tracking-tight">{headerTitle}</h1>
            <p className="mt-2 text-lg text-primary-foreground/90 max-w-2xl">
             {headerDescription}
            </p>
            <div className="mt-6">
             {headerButton}
            </div>
          </div>
        </header>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground/90">
             {toolsHeader}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {tools.map((tool) => (
              <Card key={tool.title} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className={`p-3 bg-primary/10 rounded-lg ${tool.color}`}>
                    <tool.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-end justify-end mt-auto">
                  <Link href={tool.href} passHref>
                    <Button variant="ghost" className="text-primary group-hover:bg-accent/50">
                        {mode === 'pharmacist' ? "Use Tool" : "Go to Page"} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
  );
}
