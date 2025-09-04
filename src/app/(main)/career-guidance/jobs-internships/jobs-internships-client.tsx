
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, DollarSign, Clock, Construction, CheckCircle, BarChart, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const placeholderJobs = [
    {
        title: "Clinical Staff Pharmacist",
        company: "National Hospital, Lahore",
        type: "Full-time",
        location: "Lahore, Pakistan",
        tags: ["Clinical", "Hospital", "On-site"],
        posted: "2 days ago",
    },
    {
        title: "QA Internship Program",
        company: "Zuruu Pharma, Inc.",
        type: "Internship",
        location: "Remote",
        tags: ["Industry", "QA/QC", "Paid"],
        posted: "1 week ago",
    },
    {
        title: "Research Assistant (Pharmacognosy)",
        company: "University Research Lab",
        type: "Part-time",
        location: "Karachi, Pakistan",
        tags: ["Research", "Academia", "Part-time"],
        posted: "3 days ago",
    }
]

export function JobsInternshipsClient() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      {/* Job Listings & Filters */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Filter Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search by title, company, skill..." className="pl-10" />
                </div>
                <div className="relative flex-grow">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Location (e.g., Lahore, Remote)" className="pl-10" />
                </div>
                <Button>Search</Button>
            </CardContent>
        </Card>
        
        <div className="space-y-4">
            {placeholderJobs.map((job, index) => (
                <Card key={index}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                           <div>
                             <CardTitle>{job.title}</CardTitle>
                             <CardDescription>{job.company}</CardDescription>
                           </div>
                           <Button disabled>Apply with Profile</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {job.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

      {/* Analytics & Tracking */}
      <div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart/>Application Funnel</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                     <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                     <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                     <p className="text-muted-foreground/80 mt-2 max-w-xs">
                        Your application tracking dashboard will appear here.
                     </p>
                     <div className="w-full mt-4 space-y-2 text-left text-sm">
                        <p>Applied: 5</p>
                        <p>Interviews: 1</p>
                        <p>Offers: 0</p>
                     </div>
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
