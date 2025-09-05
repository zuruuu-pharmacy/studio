
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, CheckCircle, Lightbulb, Target, TrendingUp, Database, TrendingDown, Minus, HelpCircle, FileText, FlaskConical, BrainCircuit, Book, Zap, ListOrdered } from "lucide-react";
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

  return (
    <div className="space-y-6">
       <Card>
          <CardHeader>
             <CardTitle>Overall Progress Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid lg:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/50 rounded-lg">
                <div className={cn("text-7xl font-bold", getMasteryColor(overallMastery))}>{overallMastery}%</div>
                <p className="text-muted-foreground">Overall Mastery Score</p>
            </div>
            <div className="lg:col-span-2">
                <ChartContainer config={distributionConfig} className="h-[200px] w-full">
                    <RechartsBarChart accessibilityLayer data={distributionData} layout="vertical">
                         <YAxis
                            dataKey="status"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            className="text-xs"
                            width={80}
                        />
                        <XAxis dataKey="count" type="number" hide/>
                         <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="count" layout="vertical" radius={5} />
                    </RechartsBarChart>
                </ChartContainer>
            </div>
          </CardContent>
       </Card>

        <div className="grid lg:grid-cols-2 gap-6">
            <Card>
                 <CardHeader><CardTitle className="flex items-center gap-2"><ListOrdered/>Prioritized Focus Areas</CardTitle><CardDescription>Your weakest areas based on current mastery scores.</CardDescription></CardHeader>
                 <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Mastery</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {prioritizedWeakness.map(item => (
                                <TableRow key={item.subject}>
                                    <TableCell className="font-semibold">{item.subject}</TableCell>
                                    <TableCell className={getMasteryColor(item.masteryScore)}>{item.masteryScore}%</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" onClick={() => toast({title: "Action Sent!", description: `A review session for ${item.subject} has been added to your Study Planner.`})}><Book className="mr-2"/>Review</Button>
                                            <Button size="sm" variant="outline" onClick={() => toast({title: "Action Sent!", description: `A 10-question drill for ${item.subject} has been created in the MCQ Bank.`})}><Zap className="mr-2"/>Drill</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                 </CardContent>
            </Card>
            <Card>
                 <CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit /> How Your Mastery Score is Calculated</CardTitle><CardDescription>Our algorithm combines multiple data points to create a holistic view of your understanding.</CardDescription></CardHeader>
                 <CardContent>
                     <Accordion type="single" collapsible className="w-full">
                         <AccordionItem value="step-a"><AccordionTrigger>What data sources are used?</AccordionTrigger><AccordionContent>Your score is based on quizzes, assignments, practice sessions, OSCE logs, and virtual labs to provide a complete picture of your skills.</AccordionContent></AccordionItem>
                         <AccordionItem value="step-b"><AccordionTrigger>How is the score weighted?</AccordionTrigger><AccordionContent>Recent activities and high-stakes assessments like quizzes and labs are weighted more heavily to reflect your current, most relevant knowledge.</AccordionContent></AccordionItem>
                         <AccordionItem value="step-c"><AccordionTrigger>Does the score change over time?</AccordionTrigger><AccordionContent>Yes. To encourage consistent review, a small "forgetting penalty" is applied if a topic hasn't been reviewed recently, reminding you to stay sharp.</AccordionContent></AccordionItem>
                    </Accordion>
                 </CardContent>
            </Card>
        </div>
    </div>
  );
}
