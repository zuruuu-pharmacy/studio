
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, Calculator, FlaskConical, LayoutDashboard, ShieldAlert, ScanEye, User, Users, TestTube, ShieldEllipsis, School } from "lucide-react";
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

const pharmacistMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patients", label: "Patients", icon: Users },
    { href: "/patient-history", label: "Patient History Form", icon: User },
    { href: "/monograph", label: "Monograph Lookup", icon: BookText },
    { href: "/dose-calculator", label: "Dose Calculator", icon: Calculator },
    { href: "/interaction-checker", label: "Interaction Checker", icon: FlaskConical },
    { href: "/allergy-checker", label: "Allergy Checker", icon: ShieldAlert },
    { href: "/prescription-reader", label: "Prescription Reader", icon: ScanEye },
    { href: "/lab-analyzer", label: "Lab Analyzer", icon: TestTube },
    { href: "/emergency", label: "Emergency", icon: ShieldEllipsis },
];

const patientMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patient-history", label: "My History", icon: User },
    { href: "/emergency", label: "Emergency", icon: ShieldEllipsis },
];

const studentMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patient-history", label: "My Patient History", icon: User },
    { href: "/patients", label: "View Patient Cases", icon: Users },
    { href: "/emergency", label: "Emergency Info", icon: ShieldEllipsis },
];


export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { mode } = useMode();
  const { patientState } = usePatient();

  const menuItems = () => {
    switch (mode) {
      case 'pharmacist':
        return pharmacistMenuItems;
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
