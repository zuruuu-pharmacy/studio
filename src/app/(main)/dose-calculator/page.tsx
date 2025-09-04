
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Beaker, Droplets, TestTube } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const calculationTypes = [
  {
    title: "Basic Dose Calculator (mg/kg)",
    description: "Calculate dosages based on patient weight and age.",
    href: "/dose-calculator/basic",
    icon: Calculator,
  },
  {
    title: "Body Surface Area (BSA) Dose Calculator",
    description: "Calculate dosages based on Body Surface Area (Mosteller formula).",
    href: "/dose-calculator/bsa",
    icon: Beaker,
  },
  {
    title: "IV Infusion Rate Calculator",
    description: "Calculate mL/hr, drops/min, and other infusion rates.",
    href: "/dose-calculator/iv-rate",
    icon: Droplets,
  },
  {
    title: "Compounding Calculator",
    description: "Calculate quantities for preparing solutions of a specific percentage strength.",
    href: "/dose-calculator/compounding",
    icon: TestTube,
  },
];

export default function DoseCalculatorHubPage() {
  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">Drug Calculation Tools</h1>
        <p className="text-muted-foreground mb-6">
          A suite of precision-focused calculators for pharmacy students and professionals.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculationTypes.map((tool) => (
            <Card key={tool.title} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <tool.icon className="h-10 w-10 text-primary" />
                  <CardTitle>{tool.title}</CardTitle>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                {tool.status === "Coming Soon" ? (
                  <Button disabled variant="secondary" className="w-full">{tool.status}</Button>
                ) : (
                  <Link href={tool.href} className="w-full">
                    <Button className="w-full">Use Tool</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}
