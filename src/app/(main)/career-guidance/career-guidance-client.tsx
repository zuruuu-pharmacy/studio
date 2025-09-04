
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Map, FlaskConical, Stethoscope, Briefcase, BookOpen, User, Search, Globe, Building, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { usePatient } from "@/contexts/patient-context";
import { useMode } from "@/contexts/mode-context";
import { useRouter, usePathname, useSearchParams } from "next/navigation";


const quickStatusItems = [
    {
        title: "Current Program",
        value: "Pharm.D",
        icon: BookOpen,
    },
    {
        title: "Saved Roadmaps",
        value: "1 (Clinical Focus)",
        icon: Map,
    },
    {
        title: "Applications",
        value: "0 in progress",
        icon: Briefcase,
    },
    {
        title: "Upcoming Events",
        value: "2 this week",
        icon: Stethoscope,
    },
];


const recommendedTracks = [
    {
        title: "AI in Drug Discovery",
        description: "Learn how machine learning is revolutionizing pharmaceutical research.",
        icon: Rocket,
    },
    {
        title: "Advanced Compounding",
        description: "Master complex formulations and personalized medicine.",
        icon: FlaskConical,
    },
    {
        title: "Telepharmacy Operations",
        description: "Explore the technology and regulations behind remote pharmacy services.",
        icon: Stethoscope,
    }
];


export function CareerGuidanceClient() {
  const { patientState } = usePatient();
  const { mode } = useMode();
  const studentName = patientState.activeUser?.demographics?.name?.split(' ')[0] || "Student";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="space-y-8">
        {/* Hero Panel */}
        <section className="text-center bg-primary/10 py-12 px-6 rounded-lg">
            <h1 className="text-4xl font-bold font-headline text-primary">Find your career path — clinical, industry, research, or start something new.</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                Personalized roadmaps, certifications, salary insights, and alumni stories.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button size="lg" disabled>Take Career Quiz (Coming Soon)</Button>
                 <Link href="/career-guidance/explore-paths">
                    <Button size="lg" variant="secondary">Explore Paths</Button>
                </Link>
                <Button size="lg" variant="outline" disabled>Book Mentor Session (Coming Soon)</Button>
            </div>
        </section>

        {/* Quick Status Row */}
        <section>
            <Card>
                <CardHeader>
                    <CardTitle>{studentName}'s Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                     {quickStatusItems.map((item) => (
                        <div key={item.title} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                           <item.icon className="h-8 w-8 text-primary"/>
                           <div>
                                <p className="text-sm text-muted-foreground">{item.title}</p>
                                <p className="font-bold text-lg">{item.value}</p>
                           </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
        
        {/* AI Recommendations & Search */}
        <section className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-semibold">Recommended For You</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {recommendedTracks.map(track => (
                        <Card key={track.title} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-start gap-4">
                                <track.icon className="h-8 w-8 text-primary mt-1"/>
                                <div>
                                    <CardTitle className="text-lg">{track.title}</CardTitle>
                                    <CardDescription>{track.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button variant="link" className="p-0">Learn More</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                 <h2 className="text-2xl font-semibold">Search</h2>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search jobs, skills, certifications..." className="pl-10" />
                </div>
                <Card>
                    <CardHeader><CardTitle className="text-lg">Career Modules</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="font-semibold text-primary">
                                <Link href="/career-guidance/explore-paths">Explore Paths</Link>
                            </li>
                           <li className="font-semibold text-primary">
                                <Link href="/career-guidance/roadmap-builder">Roadmap Builder</Link>
                            </li>
                            <li className="font-semibold text-primary">
                                <Link href="/career-guidance/skills-lab">Skills Lab</Link>
                            </li>
                            <li className="font-semibold text-primary">
                                <Link href="/career-guidance/certifications-library">Certifications Library</Link>
                            </li>
                            <li className="font-semibold text-primary">
                                <Link href="/career-guidance/licensing-exams">Licensing &amp; Exams Hub</Link>
                            </li>
                           <li className="font-semibold text-primary">
                                <Link href="/career-guidance/jobs-internships">Jobs & Internships</Link>
                            </li>
                           <li className="font-semibold text-primary">
                                <Link href="/career-guidance/mentors-alumni">Mentors & Alumni</Link>
                            </li>
                            <li className="font-semibold text-primary">
                                <Link href="/event-calendar">Workshops & Events</Link>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>

    </div>
  );
}
