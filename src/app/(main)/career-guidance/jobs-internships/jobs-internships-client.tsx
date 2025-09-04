
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, DollarSign, Clock, CheckCircle, BarChart, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from '@/hooks/use-toast';

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
];

export function JobsInternshipsClient() {
    const [funnel, setFunnel] = useState({ applied: 5, interviews: 1, offers: 0 });

    const handleApply = (title: string) => {
        setFunnel(prev => ({...prev, applied: prev.applied + 1}));
        toast({
            title: "Application Submitted!",
            description: `You have successfully applied for the ${title} position.`
        });
    };

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
                           <Button onClick={() => handleApply(job.title)}>Apply with Profile</Button>
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
                 <div className="w-full space-y-4 text-sm">
                    <div>
                        <div className="flex justify-between mb-1"><span>Applied</span><span>{funnel.applied}</span></div>
                        <Progress value={(funnel.applied / (funnel.applied + 5)) * 100} />
                    </div>
                     <div>
                        <div className="flex justify-between mb-1"><span>Interviews</span><span>{funnel.interviews}</span></div>
                        <Progress value={(funnel.interviews / funnel.applied) * 100} />
                    </div>
                     <div>
                        <div className="flex justify-between mb-1"><span>Offers</span><span>{funnel.offers}</span></div>
                        <Progress value={(funnel.offers / funnel.interviews) * 100 || 0} />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
