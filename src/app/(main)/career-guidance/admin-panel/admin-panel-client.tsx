
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Briefcase, GraduationCap, School, BookOpen, BarChart, Construction } from "lucide-react";
import Link from "next/link";

const adminTasks = [
    {
        title: "Verify Job Postings",
        description: "Review and approve new job and internship opportunities submitted by employers.",
        icon: Briefcase,
        link: "/career-guidance/jobs-internships",
    },
    {
        title: "Update Certifications & Licensing",
        description: "Keep the library of professional certifications and international exam requirements up-to-date.",
        icon: GraduationCap,
        link: "/career-guidance/certifications-library",
    },
    {
        title: "Manage Mentor & Alumni Network",
        description: "Invite and approve new mentors and upload alumni success stories.",
        icon: Users,
        link: "/career-guidance/mentors-alumni",
    },
    {
        title: "Push Campus-wide Surveys",
        description: "Create and distribute surveys or polls to the student body via the Student Polls module.",
        icon: BarChart,
        link: "/student-polls",
    },
     {
        title: "Upload Lecture Notes & Resources",
        description: "Add new materials to the Lecture Notes Library for students to access.",
        icon: BookOpen,
        link: "/lecture-notes",
    },
     {
        title: "Engagement Analytics",
        description: "View dashboards on how students are engaging with different career paths and resources.",
        icon: BarChart,
        link: "/career-guidance/analytics-dashboard",
    },
];

export function AdminPanelClient() {
  return (
    <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
            {adminTasks.map((task) => (
                 <Card key={task.title}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><task.icon />{task.title}</CardTitle>
                        <CardDescription>{task.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href={task.link}>
                            <Button variant="secondary">Go to Module</Button>
                        </Link>
                    </CardContent>
                 </Card>
            ))}
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Content Governance</CardTitle>
                <CardDescription>Assign moderators and set content review policies.</CardDescription>
            </CardHeader>
             <CardContent>
                <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                    <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground">Governance Tools Under Construction</h3>
                    <p className="text-muted-foreground/80 mt-2">
                        Features for assigning roles and managing content verification are coming soon.
                    </p>
                </div>
             </CardContent>
        </Card>
    </div>
  );
}
