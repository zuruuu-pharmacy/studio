
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookText, Calculator, FlaskConical, ShieldAlert, ArrowRight, ScanEye, User, Users, TestTube, ShieldEllipsis, UserPlus, FileClock, Stethoscope, HeartPulse, Brain, Utensils, Zap, Siren, ShoppingCart, Microscope, Apple, Bot, BookOpen, Library, Leaf, GraduationCap, FileHeart, HelpCircle, CaseSensitive, FileJson, Beaker, Video, Network, Puzzle, Combine, CalendarDays, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMode } from "@/contexts/mode-context";
import { usePatient } from "@/contexts/patient-context";
import { LifestyleSuggestions } from "./lifestyle-suggestions";

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
    icon: Stethoscope,
    title: "Symptom Checker",
    description: "Guide patients through a symptom triage.",
    href: "/symptom-checker",
    color: "text-rose-500",
  },
   {
    icon: Apple,
    title: "Simple Diet Planner",
    description: "Generate a diet plan based on patient profile.",
    href: "/diet-planner",
    color: "text-lime-500",
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
    icon: FileClock,
    title: "Adherence Tracker",
    description: "Generate a medication adherence report.",
    href: "/adherence-tracker",
    color: "text-teal-500",
  },
];

const patientTools = [
    {
        icon: User,
        title: "My Health History",
        description: "View or update your personal and medical information.",
        href: "/patient-history",
        color: "text-blue-400",
    },
     {
        icon: Bot,
        title: "AI Nutrition Coach",
        description: "Get a personalized diet plan from our AI assistant.",
        href: "/nutrition-coach",
        color: "text-green-500",
    },
    {
        icon: Stethoscope,
        title: "Symptom Checker",
        description: "Analyze your symptoms with an AI assistant.",
        href: "/symptom-checker",
        color: "text-rose-500",
    },
    {
        icon: Siren,
        title: "Emergency Help",
        description: "Get immediate assistance and access critical info.",
        href: "/emergency",
        color: "text-red-600",
    },
    {
        icon: ScanEye,
        title: "Upload Prescription",
        description: "Upload and analyze a new prescription from your doctor.",
        href: "/prescription-reader",
        color: "text-orange-500",
    },
    {
        icon: Microscope,
        title: "Analyze Lab Report",
        description: "Get an AI-powered analysis of your lab results.",
        href: "/lab-analyzer",
        color: "text-indigo-500",
    },
     {
        icon: ShoppingCart,
        title: "Order Medicines",
        description: "Manage refills and order your medicines.",
        href: "/order-refills",
        color: "text-emerald-500",
    },
    {
        icon: FileClock,
        title: "Adherence Tracker",
        description: "Track and report your medication adherence.",
        href: "/adherence-tracker",
        color: "text-teal-500",
    },
];

const studentTools = [
    {
        icon: User,
        title: "My Health History",
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
        icon: CaseSensitive,
        title: "Clinical Case Simulator",
        description: "Tackle realistic patient cases and get AI-driven feedback.",
        href: "/clinical-case-simulator",
        color: "text-teal-500",
    },
    {
        icon: FileHeart,
        title: "OSCE and Viva Preparation",
        description: "Practice for your exams with AI-driven OSCE and viva scenarios.",
        href: "/osce-viva-prep",
        color: "text-cyan-600",
    },
    {
        icon: FlaskConical,
        title: "Drug Interaction Simulator",
        description: "Explore and understand drug-drug interactions.",
        href: "/interaction-checker",
        color: "text-purple-500",
    },
     {
        icon: Calculator,
        title: "Drug Calculation Tool",
        description: "Practice and verify patient-specific dosages.",
        href: "/dose-calculator",
        color: "text-green-500",
    },
    {
        icon: BookOpen,
        title: "Lecture Notes Library",
        description: "Upload and browse study materials for your class.",
        href: "/lecture-notes",
        color: "text-amber-500",
    },
    {
        icon: FolderOpen,
        title: "Notes Organizer",
        description: "Organize your personal study notes and materials.",
        href: "/notes-organizer",
        color: "text-sky-600",
    },
    {
        icon: Library,
        title: "AI E-Library",
        description: "Search for any term and get instant, AI-powered definitions and summaries.",
        href: "/e-library",
        color: "text-sky-500",
    },
     {
        icon: Video,
        title: "MOA Animation Library",
        description: "Watch short, engaging animations of drug mechanisms of action.",
        href: "/moa-animations",
        color: "text-rose-500",
    },
    {
        icon: Network,
        title: "Drug Classification Tree",
        description: "Visually explore drug classes with an interactive tree.",
        href: "/drug-classification-tree",
        color: "text-blue-500",
    },
    {
        icon: GraduationCap,
        title: "Study Material Generator",
        description: "Generate a full study guide on any topic with a case study and quiz.",
        href: "/study-material-generator",
        color: "text-violet-500",
    },
    {
        icon: CalendarDays,
        title: "AI Study Planner",
        description: "Generate a personalized study timetable for your subjects and exams.",
        href: "/study-planner",
        color: "text-indigo-500",
    },
     {
        icon: Leaf,
        title: "Herbal Knowledge Hub",
        description: "Explore a detailed AI-powered pharmaco-botanical encyclopedia.",
        href: "/herbal-hub",
        color: "text-green-600",
    },
    {
        icon: FileHeart,
        title: "Flashcard Generator",
        description: "Automatically create study flashcards from your lecture notes.",
        href: "/flashcard-generator",
        color: "text-rose-500",
    },
    {
        icon: HelpCircle,
        title: "MCQ Bank",
        description: "Practice exam-style questions with AI-generated quizzes on any topic.",
        href: "/mcq-bank",
        color: "text-indigo-500",
    },
    {
        icon: FileJson,
        title: "SOP Repository",
        description: "Generate and review Standard Operating Procedures for lab practicals.",
        href: "/sop-repository",
        color: "text-orange-600",
    },
    {
        icon: Beaker,
        title: "Virtual Lab Simulator",
        description: "Run narrative-based lab simulations with AI-guided steps and feedback.",
        href: "/virtual-lab-simulator",
        color: "text-fuchsia-500",
    },
    {
        icon: Puzzle,
        title: "Pharma Games &amp; Puzzles",
        description: "Learn pharmacology concepts through interactive games and puzzles.",
        href: "/pharma-games",
        color: "text-pink-500",
    },
    {
        icon: Combine,
        title: "Mnemonic Generator",
        description: "Create memorable Roman Urdu mnemonics for any medical topic.",
        href: "/mnemonic-generator",
        color: "text-teal-500",
    }
];

export default function DashboardPage() {
  const { mode } = useMode();
  const { patientState, getActivePatientRecord } = usePatient();
  const activeUser = patientState.activeUser;
  const activePatientRecord = getActivePatientRecord();


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
            <Button variant="secondary" size="lg"><User className="mr-2" /> My Health History</Button>
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

        {activePatientRecord && (
          <section>
            <LifestyleSuggestions patientHistory={activePatientRecord.history}/>
          </section>
        )}

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
