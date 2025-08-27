import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookText, Calculator, FlaskConical, ShieldAlert, ArrowRight, ScanEye, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    icon: User,
    title: "Patient History",
    description: "Manage patient history details for use in other tools.",
    href: "/patient-history",
    color: "text-cyan-500",
  },
  {
    icon: BookText,
    title: "Drug Monograph Lookup",
    description: "Access comprehensive drug information, including MOA, side effects, and more.",
    href: "/monograph",
    color: "text-blue-500",
  },
  {
    icon: Calculator,
    title: "AI Dose Calculator",
    description: "Calculate patient-specific dosages with clear steps and references.",
    href: "/dose-calculator",
    color: "text-green-500",
  },
  {
    icon: FlaskConical,
    title: "AI Interaction Engine",
    description: "Check for multi-drug interactions, with severity and management advice.",
    href: "/interaction-checker",
    color: "text-purple-500",
  },
  {
    icon: ShieldAlert,
    title: "Allergy Checker",
    description: "Identify potential allergies and cross-reactivity risks.",
    href: "/allergy-checker",
    color: "text-red-500",
  },
  {
    icon: ScanEye,
    title: "Prescription Reader",
    description: "Analyze a prescription image to extract medications and instructions.",
    href: "/prescription-reader",
    color: "text-orange-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="bg-card shadow-sm rounded-lg p-8">
        <h1 className="text-4xl font-bold font-headline text-primary tracking-tight">Welcome to Zuruu AI Pharmacy</h1>
        <p className="mt-2 text-lg text-muted-foreground">Your AI-powered suite of clinical tools for enhanced pharmaceutical care. Start by entering patient history.</p>
      </header>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Tools</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.title} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`p-3 bg-primary/10 rounded-full ${tool.color}`}>
                  <tool.icon className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex items-end justify-end">
                <Link href={tool.href} passHref legacyBehavior>
                  <Button variant="ghost" className="text-primary hover:text-primary">
                    Use Tool <ArrowRight className="ml-2 h-4 w-4" />
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
