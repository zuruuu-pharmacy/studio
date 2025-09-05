
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, CheckCircle, Lightbulb, Target, TrendingUp, Database, TrendingDown, Minus, HelpCircle, FileText, FlaskConical, BrainCircuit, Book, Zap, ListOrdered, BookCopy, Bell } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { toast } from "@/hooks/use-toast";


const masteryData = [
  {
    subject: "Pharmacology",
    masteryScore: 92,
    trend: "positive",
    dataDensity: "High",
    lastActivity: "Quiz: Antihypertensives"
  },
  {
    subject: "Pharmaceutics",
    masteryScore: 68,
    trend: "positive",
    dataDensity: "Medium",
    lastActivity: "Lab: Tablet Dissolution"
  },
  {
    subject: "Pharmacognosy",
    masteryScore: 75,
    trend: "neutral",
    dataDensity: "High",
    lastActivity: "Practice: Alkaloids"
  },
  {
    subject: "Pathology",
    masteryScore: 55,
    trend: "negative",
    dataDensity: "Low",
    lastActivity: "Assignment: Inflammation"
  },
];

const dataSources = [
    { name: 'Quizzes & MCQs', icon: HelpCircle },
    { name: 'Assignments & Labs', icon: FileText },
    { name: 'Practice Sessions', icon: Lightbulb },
    { name: 'OSCE / Viva Practice Logs', icon: CheckCircle },
    { name: 'Virtual Lab Simulations', icon: FlaskConical },
]

const getMasteryColor = (score: number) => {
  if (score >= 85) return "text-green-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
};

const getTrendIcon = (trend: string) => {
    switch (trend) {
        case 'positive': return <TrendingUp className="h-5 w-5 text-green-500"/>;
        case 'negative': return <TrendingDown className="h-5 w-5 text-red-500"/>;
        default: return <Minus className="h-5 w-5 text-muted-foreground"/>;
    }
}

const chartConfig = {
  subjects: {
    label: "Subjects",
  },
} satisfies ChartConfig

const mockNudges = [
    { type: 'digest', title: "Daily Focus", description: "Top 3 topics to focus on today: Inflammation Pathways, Tablet Dissolution Rates, Alkaloid Identification.", icon: Lightbulb, color: "text-primary"},
    { type: 'alert', title: "Mastery Alert: Pathology", description: "Your mastery score has dropped from 65% to 55%. A 30-minute review session is recommended.", icon: TrendingDown, color: "text-destructive"},
    { type: 'milestone', title: "Milestone Reached!", description: "Congratulations! You've achieved 92% mastery in Pharmacology.", icon: Target, color: "text-green-500"},
]


export function ProgressTrackerClient() {
  const overallMastery = Math.round(masteryData.reduce((acc, item) => acc + item.masteryScore, 0) / masteryData.length);
  const strongSubjects = masteryData.filter(s => s.masteryScore >= 85);
  const moderateSubjects = masteryData.filter(s => s.masteryScore >= 60 && s.masteryScore < 85);
  const weakSubjects = masteryData.filter(s => s.masteryScore < 60);

  const distributionData = [
    { status: 'Strong', count: strongSubjects.length, fill: 'var(--color-strong)' },
    { status: 'Moderate', count: moderateSubjects.length, fill: 'var(--color-moderate)' },
    { status: 'Weak', count: weakSubjects.length, fill: 'var(--color-weak)' },
  ];

   const distributionConfig = {
    count: { label: "Subjects" },
    strong: { label: "Strong", color: "hsl(var(--chart-2))" },
    moderate: { label: "Moderate", color: "hsl(var(--chart-4))" },
    weak: { label: "Weak", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;
  
  const prioritizedWeakness = [...weakSubjects, ...moderateSubjects].sort((a,b) => a.masteryScore - b.masteryScore);

  const recommendationMap: {[key: string]: { rec: string, actions: { label: string, icon: React.ElementType, toast: string }[] }} = {
      "Pathology": {
          rec: "Focus on conceptual understanding of inflammation pathways.",
          actions: [
              { label: "Review Summary", icon: BookCopy, toast: "A summary for Pathology has been opened." },
              { label: "Start 10 MCQs", icon: Zap, toast: "A 10-question drill for Pathology has been created in the MCQ Bank." },
          ]
      },
       "Pharmaceutics": {
          rec: "Practice procedural calculations for dissolution rates.",
          actions: [
              { label: "Calculation Drills", icon: Zap, toast: "A calculation drill for Pharmaceutics has been opened." },
              { label: "Schedule Lab Sim", icon: FlaskConical, toast: "A lab simulation has been added to your Study Planner." },
          ]
      }
  }


  return (
    <div className="space-y-6">
       <div className="grid lg:grid-cols-2 gap-6">
           <Card>
              <CardHeader>
                 <CardTitle>Overall Progress Summary</CardTitle>
                 <CardDescription>A snapshot of your academic mastery.</CardDescription>
              </CardHeader>
              <CardContent className="grid lg:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/50 rounded-lg">
                    <div className={cn("text-7xl font-bold", getMasteryColor(overallMastery))}>{overallMastery}%</div>
                    <p className="text-muted-foreground">Overall Mastery</p>
                </div>
                <div>
                    <ChartContainer config={distributionConfig} className="h-[150px] w-full">
                        <RechartsBarChart accessibilityLayer data={distributionData} layout="vertical" margin={{ left: 10 }}>
                             <YAxis dataKey="status" type="category" tickLine={false} axisLine={false} tickMargin={10} className="text-xs" width={60}/>
                            <XAxis dataKey="count" type="number" hide/>
                             <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey="count" layout="vertical" radius={5} />
                        </RechartsBarChart>
                    </ChartContainer>
                </div>
              </CardContent>
           </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="text-primary"/>Notifications &amp; Nudges</CardTitle><CardDescription>Your AI-powered alerts and recommendations.</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                    {mockNudges.map(nudge => (
                        <Alert key={nudge.title}>
                            <nudge.icon className={cn("h-4 w-4", nudge.color)} />
                            <AlertTitle>{nudge.title}</AlertTitle>
                            <AlertDescription>{nudge.description}</AlertDescription>
                        </Alert>
                    ))}
                </CardContent>
            </Card>

        </div>
        
        <Card>
            <CardHeader><CardTitle>Detailed Subject Mastery</CardTitle><CardDescription>A breakdown of your performance in each subject.</CardDescription></CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                    {masteryData.map(item => (
                        <Card key={item.subject} className="p-4 bg-muted/50">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold">{item.subject}</p>
                                <div className="flex items-center gap-2">
                                    <span className={cn("text-2xl font-bold", getMasteryColor(item.masteryScore))}>{item.masteryScore}%</span>
                                    {getTrendIcon(item.trend)}
                                </div>
                            </div>
                            <Progress value={item.masteryScore} />
                            <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                                <span>Data Density: <Badge variant="outline">{item.dataDensity}</Badge></span>
                                <span>Last Activity: {item.lastActivity}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
             <AccordionItem value="data-sources">
                 <AccordionTrigger className="text-base text-muted-foreground">How is my Mastery Score Calculated?</AccordionTrigger>
                 <AccordionContent>
                    <Card className="p-6">
                        <div className="space-y-4">
                            <p className="text-muted-foreground">Your Mastery Score is a dynamic metric computed from various learning activities across the portal. Here’s a brief overview:</p>
                             <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Data Sources</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dataSources.map(ds => <li key={ds.name} className="flex items-center gap-2"><ds.icon className="text-primary"/>{ds.name}</li>)}
                                    </ul>
                                </div>
                                 <div>
                                    <h4 className="font-semibold mb-2">Algorithm Highlights</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li><strong>Recency Matters:</strong> More recent quiz scores and activities are weighted more heavily.</li>
                                        <li><strong>Component Weighting:</strong> Different activities contribute differently (e.g., quizzes have more weight than flashcard practice).</li>
                                        <li><strong>Forgetting Penalty:</strong> A small penalty is applied to topics not reviewed recently to encourage continuous learning.</li>
                                    </ul>
                                </div>
                             </div>
                        </div>
                    </Card>
                 </AccordionContent>
             </AccordionItem>
        </Accordion>
    </div>
  );
}
