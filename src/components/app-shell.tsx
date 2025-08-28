
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, Calculator, FlaskConical, Home, LayoutDashboard, ShieldAlert, Waves, ScanEye, User, Users, TestTube } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/monograph", label: "Monograph Lookup", icon: BookText },
  { href: "/dose-calculator", label: "Dose Calculator", icon: Calculator },
  { href: "/interaction-checker", label: "Interaction Checker", icon: FlaskConical },
  { href: "/allergy-checker", label: "Allergy Checker", icon: ShieldAlert },
  { href: "/prescription-reader", label: "Prescription Reader", icon: ScanEye },
  { href: "/lab-analyzer", label: "Lab Analyzer", icon: TestTube },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/patient-history", label: "Patient History Form", icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Waves className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold font-headline text-primary">Zuruu AI</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
            {/* Can add user profile here */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold">
                {menuItems.find(item => item.href === pathname)?.label || 'Dashboard'}
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
