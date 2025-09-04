
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, Calculator, FlaskConical, LayoutDashboard, ShieldAlert, ScanEye, User, Users, TestTube, ShieldEllipsis, School, UserPlus, FileClock, Stethoscope, Siren, ShoppingCart, Microscope, Apple, Bot, BookOpen, Library, Leaf, GraduationCap, FileHeart, HelpCircle, CaseSensitive, FileJson, Beaker, Video, Network, Puzzle, ClipboardCheck as OsceIcon, Combine, CalendarDays, FolderOpen } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { useMode } from "@/contexts/mode-context";
import { usePatient } from "@/contexts/patient-context";
import { Avatar, AvatarFallback } from "./ui/avatar";

const pharmacistTools = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patients", label: "Patients", icon: Users },
    { href: "/patient-history", label: "Patient History Form", icon: User },
    { href: "/symptom-checker", label: "Symptom Checker", icon: Stethoscope },
    { href: "/diet-planner", label: "Simple Diet Planner", icon: Apple },
    { href: "/monograph", label: "Monograph Lookup", icon: BookText },
    { href: "/dose-calculator", label: "Dose Calculator", icon: Calculator },
    { href: "/interaction-checker", label: "Interaction Checker", icon: FlaskConical },
    { href: "/allergy-checker", label: "Allergy Checker", icon: ShieldAlert },
    { href: "/prescription-reader", label: "Prescription Reader", icon: ScanEye },
    { href: "/lab-analyzer", label: "Lab Analyzer", icon: TestTube },
    { href: "/adherence-tracker", label: "Adherence Tracker", icon: FileClock },
];

const patientMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patient-history", label: "My History", icon: User },
    { href: "/nutrition-coach", label: "AI Nutrition Coach", icon: Bot },
    { href: "/symptom-checker", label: "Symptom Checker", icon: Stethoscope },
    { href: "/emergency", label: "Emergency Help", icon: Siren },
    { href: "/prescription-reader", label: "Upload Prescription", icon: ScanEye },
    { href: "/lab-analyzer", label: "Analyze Lab Report", icon: Microscope },
    { href: "/order-refills", label: "Order Medicines", icon: ShoppingCart },
    { href: "/adherence-tracker", label: "Adherence Tracker", icon: FileClock },
];

const studentMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patient-history", label: "My Health History", icon: User },
    { href: "/patients", label: "View Patient Cases", icon: Users },
    { href: "/clinical-case-simulator", label: "Clinical Case Simulator", icon: CaseSensitive },
    { href: "/osce-viva-prep", label: "OSCE & Viva Preparation", icon: OsceIcon },
    { href: "/interaction-checker", label: "Interaction Simulator", icon: FlaskConical },
    { href: "/lecture-notes", label: "Lecture Notes Library", icon: BookOpen },
    { href: "/notes-organizer", label: "Notes Organizer", icon: FolderOpen },
    { href: "/e-library", label: "AI E-Library", icon: Library },
    { href: "/moa-animations", label: "MOA Animations", icon: Video },
    { href: "/drug-classification-tree", label: "Drug Classification Tree", icon: Network },
    { href: "/study-material-generator", label: "Study Material Generator", icon: GraduationCap },
    { href: "/study-planner", label: "AI Study Planner", icon: CalendarDays },
     { href: "/lab-analyzer", label: "Lab Report Analyzer", icon: TestTube },
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
        title: "Pharma Games & Puzzles",
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


export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { mode } = useMode();
  const { patientState } = usePatient();

  const menuItems = () => {
    switch (mode) {
      case 'pharmacist':
        return pharmacistTools;
      case 'patient':
        return patientMenuItems;
      case 'student':
        return studentMenuItems;
      default:
        return [];
    }
  }
  
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  const activeUser = patientState.activeUser;
  const userName = activeUser?.demographics?.name || (mode === 'pharmacist' ? 'Pharmacist' : 'Guest');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <div>
                <h1 className="text-xl font-bold font-headline text-primary">Zuruu AI</h1>
                <p className="text-xs text-muted-foreground">By DR.Mohsin Saleem</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems().map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <div className="flex items-center gap-3 p-2">
                <Avatar>
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-sidebar-foreground truncate">{userName}</span>
                    <span className="text-xs text-sidebar-foreground/70">{activeUser?.role || mode}</span>
                </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold">
                {menuItems().find(item => item.href === pathname)?.label || 'Dashboard'}
              </h2>
            </div>
            <ModeToggle />
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
