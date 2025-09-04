
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Construction, GraduationCap, CheckCircle, ExternalLink, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const placeholderCerts = [
    {
        title: "Board Certified Pharmacotherapy Specialist (BCPS)",
        provider: "Board of Pharmacy Specialties (BPS), USA",
        whoFor: "Pharmacists providing direct patient care, often in hospital or ambulatory settings.",
        prerequisites: "Pharm.D from an accredited school + several years of experience or a residency.",
        cost: "~$600 per exam",
        recognition: "USA, Canada, Middle East",
        link: "https://www.bpsweb.org/specialty-certifications/pharmacotherapy/",
    },
    {
        title: "Regulatory Affairs Certification (RAC)",
        provider: "Regulatory Affairs Professionals Society (RAPS)",
        whoFor: "Professionals in the regulatory, quality, or clinical affairs sectors of the pharma/med-tech industry.",
        prerequisites: "Varies by exam (Drugs vs. Devices) and requires a degree and/or experience.",
        cost: "~$500-$700",
        recognition: "Global (highly valued in USA/EU)",
        link: "https://www.raps.org/rac-credential/get-your-rac",
    },
    {
        title: "Certified GMP Professional",
        provider: "Various (e.g., ISPE, local training bodies)",
        whoFor: "Quality Assurance, Quality Control, and Production personnel in the pharmaceutical industry.",
        prerequisites: "Usually none, but industry experience is beneficial.",
        cost: "Varies widely",
        recognition: "Global",
        link: "https://ispe.org/products/certified-pharmaceutical-gmp-professional-exam-study-guide",
    }
];

export function CertificationsLibraryClient() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Certifications</CardTitle>
          <CardDescription>Filter by domain, region, or keyword.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search certifications like BCPS, GMP, regulatory..." className="pl-10" />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {placeholderCerts.map((cert, index) => (
            <Card key={index}>
                <CardHeader>
                    <CardTitle className="flex items-start gap-3">
                       <GraduationCap className="h-8 w-8 text-primary mt-1 shrink-0"/>
                       <span>{cert.title}</span>
                    </CardTitle>
                    <CardDescription>{cert.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm">Who is it for?</h4>
                        <p className="text-sm text-muted-foreground">{cert.whoFor}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm">Prerequisites</h4>
                        <p className="text-sm text-muted-foreground">{cert.prerequisites}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-sm">Recognition & Cost</h4>
                        <p className="text-sm text-muted-foreground">Recognized in {cert.recognition}. Typical Cost: {cert.cost}</p>
                    </div>
                    <div className="flex gap-2">
                        <a href={cert.link} target="_blank" rel="noopener noreferrer"><Button variant="secondary"><ExternalLink className="mr-2"/>Official Page</Button></a>
                        <Button disabled><Map className="mr-2"/>Add to Roadmap</Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
