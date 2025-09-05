
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, Calculator, FlaskConical, LayoutDashboard, ShieldAlert, ScanEye, User, Users, TestTube, ShieldEllipsis, School, UserPlus, FileClock, Stethoscope, Siren, ShoppingCart, Microscope, Apple, Bot, BookOpen, Library, Leaf, GraduationCap, FileHeart, HelpCircle, CaseSensitive, FileJson, Beaker, Video, Network, Puzzle, Combine, CalendarDays, FolderOpen, Replace, BookA, MessageSquare, ClipboardList, MessageCircleQuestion, Compass, Search, BarChart } from "lucide-react";
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
    { href: "/career-guidance/admin-panel", label: "Admin Panel", icon: ShieldEllipsis },
];

const patientMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patient-history", label: "My Health History", icon: User },
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
    { href: "/smart-search", label: "Smart Search", icon: Search },
    { href: "/ai-assistant", label: "AI Assistant Helper", icon: MessageCircleQuestion },
    { href: "/patient-history", label: "My Health History", icon: User },
    { href: "/patients", label: "View Patient Cases", icon: Users },
    { href: "/student-discussion-forum", label: "Student Discussion Forum", icon: MessageSquare },
    { href: "/student-polls", label: "Student Polls/Surveys", icon: ClipboardList },
     {
        icon: CaseSensitive,
        label: "Clinical Case Simulator",
        description: "Tackle realistic patient cases and get AI-driven feedback.",
        href: "/clinical-case-simulator",
        color: "text-teal-500",
    },
    {
        icon: FileHeart,
        label: "OSCE and Viva Preparation",
        description: "Practice for your exams with AI-driven OSCE and viva scenarios.",
        href: "/osce-viva-prep",
        color: "text-cyan-600",
    },
    {
        icon: Compass,
        label: "Career Guidance",
        description: "Explore career paths and get guidance for your professional journey.",
        href: "/career-guidance",
        color: "text-amber-600",
    },
    {
        icon: BarChart,
        label: "Progress Tracker",
        href: "/progress-tracker",
    },
    {
        icon: FlaskConical,
        label: "Drug Interaction Simulator",
        description: "Explore and understand drug-drug interactions.",
        href: "/interaction-checker",
        color: "text-purple-500",
    },
     {
        icon: Calculator,
        label: "Drug Calculation Tool",
        description: "Practice and verify patient-specific dosages.",
        href: "/dose-calculator",
        color: "text-green-500",
    },
    {
        icon: Replace,
        label: "Unit Converter",
        description: "Perform common clinical unit conversions.",
        href: "/unit-converter",
        color: "text-fuchsia-500",
    },
    {
        icon: BookOpen,
        label: "Lecture Notes Library",
        description: "Upload and browse study materials for your class.",
        href: "/lecture-notes",
        color: "text-amber-500",
    },
    {
        icon: FolderOpen,
        label: "Notes Organizer",
        description: "Organize your personal study notes and materials.",
        href: "/notes-organizer",
        color: "text-sky-600",
    },
    {
        icon: Library,
        label: "AI E-Library",
        description: "Search for any term and get instant, AI-powered definitions and summaries.",
        href: "/e-library",
        color: "text-sky-500",
    },
     {
        icon: Video,
        label: "MOA Animation Library",
        description: "Watch short, engaging animations of drug mechanisms of action.",
        href: "/moa-animations",
        color: "text-rose-500",
    },
    {
        icon: Network,
        label: "Drug Classification Tree",
        description: "Visually explore drug classes with an interactive tree.",
        href: "/drug-classification-tree",
        color: "text-blue-500",
    },
    {
        icon: GraduationCap,
        label: "Study Material Generator",
        description: "Generate a full study guide on any topic with a case study and quiz.",
        href: "/study-material-generator",
        color: "text-violet-500",
    },
    {
        icon: CalendarDays,
        label: "AI Study Planner",
        description: "Generate a personalized study timetable for your subjects and exams.",
        href: "/study-planner",
        color: "text-indigo-500",
    },
     {
        icon: Leaf,
        label: "Herbal Knowledge Hub",
        description: "Explore a detailed AI-powered pharmaco-botanical encyclopedia.",
        href: "/herbal-hub",
        color: "text-green-600",
    },
    {
        label: "Flashcard Generator",
        href: "/flashcard-generator",
        icon: FileHeart,
    },
    {
        label: "MCQ Bank",
        href: "/mcq-bank",
        icon: HelpCircle,
    },
    {
        icon: FileJson,
        label: "SOP Repository",
        description: "Generate and review Standard Operating Procedures for lab practicals.",
        href: "/sop-repository",
        color: "text-orange-600",
    },
    {
        icon: Beaker,
        label: "Virtual Lab Simulator",
        description: "Run narrative-based lab simulations with AI-guided steps and feedback.",
        href: "/virtual-lab-simulator",
        color: "text-fuchsia-500",
    },
    {
        icon: Puzzle,
        label: "Pharma Games & Puzzles",
        description: "Learn pharmacology concepts through interactive games and puzzles.",
        href: "/pharma-games",
        color: "text-pink-500",
    },
    {
        icon: Combine,
        label: "Mnemonic Generator",
        description: "Create memorable Roman Urdu mnemonics for any medical topic.",
        href: "/mnemonic-generator",
        color: "text-teal-500",
    },
    {
        icon: BookA,
        label: "Reference Citation Tool",
        description: "Generate academic citations for a given text in various styles.",
        href: "/reference-generator",
        color: "text-slate-500",
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
