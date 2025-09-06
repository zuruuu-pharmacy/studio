
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, Calculator, FlaskConical, LayoutDashboard, ShieldAlert, ScanEye, User, Users, TestTube, ShieldEllipsis, School, UserPlus, FileClock, Stethoscope, Siren, ShoppingCart, Microscope, Apple, Bot, BookOpen, Library, Leaf, GraduationCap, FileHeart, HelpCircle, CaseSensitive, FileJson, Beaker, Video, Network, Puzzle, Combine, CalendarDays, FolderOpen, Replace, BookA, MessageSquare, ClipboardList, MessageCircleQuestion, Compass, Search, BarChart, Camera, ScanSearch, WifiOff, Mic } from "lucide-react";
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

const studentMenuSections = {
  "Overview": [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ],
  "📚 Study & Learning Hub": [
    { href: "/lecture-notes", label: "Lecture Notes Library", icon: BookOpen },
    { href: "/notes-organizer", label: "Notes Organizer", icon: FolderOpen },
    { href: "/e-library", label: "AI E-Library", icon: Library },
    { href: "/moa-animations", label: "MOA Animation Library", icon: Video },
    { href: "/drug-classification-tree", label: "Drug Classification Tree", icon: Network },
    { href: "/herbal-hub", label: "Herbal Knowledge Hub", icon: Leaf },
    { href: "/sop-repository", label: "SOP Repository", icon: FileJson },
    { href: "/offline-mode", label: "Offline Mode", icon: WifiOff },
    { href: "/text-to-speech", label: "Text-to-Speech", icon: Mic },
  ],
  "🎓 Interactive Learning & Practice": [
    { href: "/clinical-case-simulator", label: "Clinical Case Simulator", icon: CaseSensitive },
    { href: "/osce-viva-prep", label: "OSCE and Viva Preparation", icon: FileHeart },
    { href: "/interaction-checker", label: "Drug Interaction Simulator", icon: FlaskConical },
    { href: "/dose-calculator", label: "Drug Calculation Tool", icon: Calculator },
    { href: "/unit-converter", label: "Unit Converter", icon: Replace },
    { href: "/virtual-lab-simulator", label: "Virtual Lab Simulator", icon: Beaker },
    { href: "/pharma-games", label: "Pharma Games & Puzzles", icon: Puzzle },
    { href: "/mnemonic-generator", label: "Mnemonic Generator", icon: Combine },
  ],
  "🧑‍🎓 Student Tools & Productivity": [
    { href: "/study-material-generator", label: "Study Material Generator", icon: GraduationCap },
    { href: "/flashcard-generator", label: "Flashcard Generator", icon: FileHeart },
    { href: "/mcq-bank", label: "MCQ Bank", icon: HelpCircle },
    { href: "/reference-generator", label: "Reference Citation Tool", icon: BookA },
    { href: "/plagiarism-checker", label: "Plagiarism Checker", icon: ScanSearch },
    { href: "/study-planner", label: "AI Study Planner", icon: CalendarDays },
    { href: "/progress-tracker", label: "Progress Tracker", icon: BarChart },
  ],
  "👥 Community & Collaboration": [
    { href: "/student-discussion-forum", label: "Student Discussion Forum", icon: MessageSquare },
    { href: "/student-polls", label: "Student Polls/Surveys", icon: ClipboardList },
    { href: "/patient-history", label: "My Health History", icon: User },
    { href: "/patients", label: "View All Patient Cases", icon: Users },
    { href: "/career-guidance", label: "Career Guidance", icon: Compass },
  ],
  "🚀 Advanced / AI Features": [
    { href: "/smart-search", label: "Smart Search", icon: Search },
    { href: "/ai-assistant", label: "AI Assistant Helper", icon: MessageCircleQuestion },
    { href: "/scan-medicine-strip", label: "AR Medicine Scanner", icon: Camera },
    { href: "/pathology", label: "Pathology", icon: TestTube },
  ],
};


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
      // In student mode, we will handle rendering differently
      case 'student':
        return [];
      default:
        return [];
    }
  }
  
  const allStudentItems = Object.values(studentMenuSections).flat();
  
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
              {mode === 'student' ? (
                Object.entries(studentMenuSections).map(([section, items]) => (
                  <React.Fragment key={section}>
                    <SidebarMenuItem className="px-2 mt-4 mb-1">
                      <p className="text-xs font-semibold text-sidebar-foreground/70">{section}</p>
                    </SidebarMenuItem>
                    {items.map(item => (
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
                  </React.Fragment>
                ))
              ) : (
                menuItems().map((item) => (
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
                ))
              )}
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
                {mode === 'student' ? (allStudentItems.find(item => item.href === pathname)?.label || 'Dashboard') : (menuItems().find(item => item.href === pathname)?.label || 'Dashboard')}
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
