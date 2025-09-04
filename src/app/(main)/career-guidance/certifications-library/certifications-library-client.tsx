
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Construction, GraduationCap } from "lucide-react";

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
              <Input placeholder="Search certifications like BCPS, GMP..." className="pl-10" />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GraduationCap />Results</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                 <p className="text-muted-foreground/80 mt-2">
                    The certifications library is currently in development.
                 </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
