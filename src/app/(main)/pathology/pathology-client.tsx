
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube, Microscope, FileText, Dna } from "lucide-react";
import Link from "next/link";

const pathologyModules = [
  {
    icon: Microscope,
    title: "General Pathology",
    description: "Learn about the basic pathological processes like inflammation, neoplasia, and cellular injury.",
    href: "/pathology/general",
    status: "Active",
  },
  {
    icon: Dna,
    title: "Systemic Pathology",
    description: "Explore the pathology of specific organ systems, including cardiovascular, respiratory, and renal systems.",
    href: "/pathology/systemic",
    status: "Active",
  },
  {
    icon: TestTube,
    title: "Hematology & Blood Banking",
    description: "Study diseases of the blood and the principles of transfusion medicine.",
    href: "/pathology/hematology",
    status: "Active",
  },
  {
    icon: FileText,
    title: "Pathology Case Studies",
    description: "Review real-world case studies and analyze slides to build your diagnostic skills.",
    href: "/pathology/cases",
    status: "Active",
  },
];

export function PathologyClient() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pathologyModules.map((module) => (
        <Card key={module.title} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <module.icon className="h-10 w-10 text-primary" />
              <CardTitle>{module.title}</CardTitle>
            </div>
            <CardDescription>{module.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            {module.status === "Active" ? (
              <Link href={module.href} className="w-full">
                <Button className="w-full">Explore Module</Button>
              </Link>
            ) : (
              <Button disabled className="w-full">{module.status}</Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
