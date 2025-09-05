
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, CheckCircle, Lightbulb, Target, TrendingUp, Database, TrendingDown, Minus, HelpCircle, FileText, FlaskConical, BrainCircuit, Book, Zap, ListOrdered, BookCopy, Bell, ArrowLeft, ShieldCheck, ShieldQuestion } from "lucide-react";
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
    lastActivity: "Quiz: Antihypertensives",
    topics: [
        { name: "Autonomic Nervous System", score: 95 },
        { name: "Cardiovascular Drugs", score: 91 },
        { name: "Drug Interactions", score: 45, error: 'application' },
        { name: "Metabolism & Excretion", score: 88 },
    ]
  },
  {
    subject: "Pharmaceutics",
    masteryScore: 68,
    trend: "positive",
    dataDensity: "Medium",
    lastActivity: "Lab: Tablet Dissolution",
     topics: [
        { name: "Dosage Form Design", score: 75 },
        { name: "Tablet Dissolution", score: 55, error: 'procedural' },
        { name: "Biopharmaceutics", score: 71 },
    ]
  },
  {
    subject: "Pharmacognosy",
    masteryScore: 75,
    trend: "neutral",
    dataDensity: "High",
    lastActivity: "Practice: Alkaloids",
    topics: []
  },
  {
    subject: "Pathology",
    masteryScore: 55,
    trend: "negative",
    dataDensity: "Medium",
    lastActivity: "Assignment: Inflammation",
     topics: [
        { name: "Inflammation Pathways", score: 40, error: 'conceptual' },
        { name: "Cell Injury", score: 65 },
    ]
  },
   {
    subject: "Biochemistry",
    masteryScore: 0,
    trend: "neutral",
    dataDensity: "Low",
    lastActivity: "N/A",
    topics: []
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

const getMasteryColorMuted = (score: number) => {
  if (score >= 85) return "bg-green-500/10";
  if (score >= 60) return "bg-amber-500/10";
  return "bg-red-500/10";
};


const getTrendIcon = (trend: string) => {
    switch (trend) {
        case 'positive': return <TrendingUp className="h-5 w-5 text-green-500"/>;
        case 'negative': return <TrendingDown className="h-5 w-5 text-red-500"/>;
        default: return <Minus className="h-5 w-5 text-muted-foreground"/>;
    }
}

const errorTypeMap: {[key: string]: string} = {
    application: "Application Error",
    procedural: "Procedural Error",
    conceptual: "Conceptual Error"
}

const chartConfig = {
  subjects: {
    label: "Subjects",
  },
} satisfies ChartConfig

const mockNudges = [
    { type: 'digest', title: "Daily Focus", description: "Top 3 topics to focus on today: Inflammation Pathways, Tablet Dissolution Rates, Drug Interactions.", icon: Lightbulb, color: "text-primary"},
    { type: 'alert', title: "Mastery Alert: Pathology", description: "Your mastery score has dropped from 65% to 55%. A 30-minute review session is recommended.", icon: TrendingDown, color: "text-destructive"},
    { type: 'milestone', title: "Milestone Reached!", description: "Congratulations! You've achieved 92% mastery in Pharmacology.", icon: Target, color: "text-green-500"},
    { type: 'discrepancy', title: "Confidence Gap Alert", description: "Your self-reported confidence in 'Drug Interactions' is high, but your quiz scores are low. Let's review this topic.", icon: ShieldQuestion, color: "text-amber-500"},
]

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
      },
      "Biochemistry": {
          rec: "There isn't enough data to calculate a mastery score. Take a short diagnostic quiz to get started.",
          actions: [
               { label: "Start Diagnostic Quiz", icon: Zap, toast: "A diagnostic quiz for Biochemistry has been launched." },
          ]
      }
}

export function ProgressTrackerClient() {
  const [selectedSubject, setSelectedSubject] = useState<typeof masteryData[0] | null>(null);

  const overallMastery = Math.round(masteryData.filter(s => s.dataDensity !== 'Low').reduce((acc, item) => acc + item.masteryScore, 0) / masteryData.filter(s => s.dataDensity !== 'Low').length);
  const strongSubjects = masteryData.filter(s => s.masteryScore >= 85);
  const moderateSubjects = masteryData.filter(s => s.masteryScore >= 60 && s.masteryScore < 85);
  const weakSubjects = masteryData.filter(s => s.masteryScore < 60 && s.dataDensity !== 'Low');

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
  
  const prioritizedWeakness = [...weakSubjects, ...moderateSubjects, ...masteryData.filter(s => s.dataDensity === 'Low')].sort((a,b) => a.masteryScore - b.masteryScore);

  if(selectedSubject) {
    return (
      <div>
        <Button onClick={() => setSelectedSubject(null)} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2"/> Back to Overview
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Topic Breakdown: {selectedSubject.subject}</CardTitle>
            <CardDescription>Mastery scores for topics within {selectedSubject.subject}. Click a weak area to take action.</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSubject.topics.length > 0 ? (
                 <div className="space-y-3">
                    {selectedSubject.topics.map(topic => (
                      <Card key={topic.name} className={cn("p-4", getMasteryColorMuted(topic.score))}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{topic.name}</p>
                            {topic.error && <p className="text-xs text-muted-foreground">Common error type: {errorTypeMap[topic.error]}</p>}
                          </div>
                          <div className="flex items-center gap-4">
                             <span className={cn("text-2xl font-bold", getMasteryColor(topic.score))}>{topic.score}%</span>
                             <Button size="sm" onClick={() => toast({title: "Action Started!", description: "A practice session would launch here."})}>
                               Start Now
                             </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                 </div>
            ) : (
                <div className="text-center text-muted-foreground p-8">
                    <p>No specific topic data available for this subject yet.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
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
                <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="text-primary"/>AI Recommended Actions</CardTitle><CardDescription>Your prioritized list of what to study next.</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                    {prioritizedWeakness.slice(0, 2).map(item => {
                        const rec = recommendationMap[item.subject];
                        if (!rec) return null;
                        const scoreText = item.dataDensity === 'Low' ? "Not enough data" : `Score: ${item.masteryScore}%`;
                        return (
                             <Alert key={item.subject}>
                                <Lightbulb className="h-4 w-4" />
                                <AlertTitle className="font-bold">{item.subject} ({scoreText})</AlertTitle>
                                <AlertDescription>
                                    <p>{rec.rec}</p>
                                     <div className="flex gap-2 mt-2">
                                        {rec.actions.map(action => (
                                            <Button key={action.label} size="sm" variant="secondary" onClick={() => toast({title: "Action Triggered", description: action.toast})}>
                                                <action.icon className="mr-2"/>{action.label}
                                            </Button>
                                        ))}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )
                    })}
                     <Alert variant="default" className="bg-amber-500/10 border-amber-500/50">
                        <ShieldQuestion className="h-4 w-4 text-amber-600"/>
                        <AlertTitle className="font-bold text-amber-700">Confidence Gap Alert: Drug Interactions</AlertTitle>
                        <AlertDescription>
                           Your self-reported confidence is high, but your quiz scores are low. Let's review this topic.
                           <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="secondary" onClick={() => toast({title: "Action Triggered", description: "Review launched."})}>
                                <BookCopy className="mr-2"/>Review Summary
                              </Button>
                           </div>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

        </div>
        
        <Card>
            <CardHeader><CardTitle>Detailed Subject Mastery</CardTitle><CardDescription>A breakdown of your performance in each subject. Click a tile to drill down.</CardDescription></CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                    {masteryData.map(item => (
                        <button key={item.subject} onClick={() => {
                            if (item.dataDensity === 'Low') {
                                toast({ title: 'Not Enough Data', description: 'Take a diagnostic quiz in this subject to get started.'});
                            } else {
                                setSelectedSubject(item);
                            }
                        }} className={cn("text-left w-full", item.dataDensity === 'Low' && 'cursor-not-allowed opacity-70')}>
                            <Card className="p-4 bg-muted/50 hover:bg-muted transition">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold">{item.subject}</p>
                                    <div className="flex items-center gap-2">
                                        {item.dataDensity === 'Low' ? (
                                            <span className="text-lg font-bold text-muted-foreground">N/A</span>
                                        ) : (
                                            <>
                                                <span className={cn("text-2xl font-bold", getMasteryColor(item.masteryScore))}>{item.masteryScore}%</span>
                                                {getTrendIcon(item.trend)}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Progress value={item.dataDensity === 'Low' ? 0 : item.masteryScore} />
                                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                                    <span>Data Density: <Badge variant="outline">{item.dataDensity}</Badge></span>
                                    <span>Last Activity: {item.lastActivity}</span>
                                </div>
                            </Card>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Accordion type="multiple" collapsible className="w-full space-y-4">
             <AccordionItem value="data-sources" className="border-0">
                 <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">How is my Mastery Score Calculated?</AccordionTrigger>
                 <AccordionContent>
                    <Card className="p-6">
                        <div className="space-y-4">
                             <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2"><Database className="text-primary"/>Data Sources</h4>
                                    <p className="text-sm text-muted-foreground mb-2">Your Mastery Score is a dynamic metric computed from various learning activities across the portal:</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {dataSources.map(ds => <li key={ds.name} className="flex items-center gap-2"><ds.icon className="text-primary"/>{ds.name}</li>)}
                                    </ul>
                                </div>
                                 <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2"><BrainCircuit className="text-primary"/>Algorithm Highlights</h4>
                                     <p className="text-sm text-muted-foreground mb-2">The score is calculated using a weighted average with time decay:</p>
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
             <AccordionItem value="privacy" className="border-0">
                 <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">Privacy &amp; Data Governance</AccordionTrigger>
                 <AccordionContent>
                    <Card className="p-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><ShieldCheck className="text-primary"/>Your Data, Your Control</h4>
                            <p className="text-sm text-muted-foreground mb-2">We believe in transparent data practices. Your personal learning data is private by default and is only used to help you learn better.</p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                <li><strong>Opt-In Sharing:</strong> Your individual progress is not shared with instructors unless you explicitly choose to. Aggregated, anonymized class data helps improve curriculum.</li>
                                <li><strong>Data Control:</strong> You have the right to export or delete your learning history at any time.</li>
                                <li><strong>Secure Storage:</strong> All learning data is stored securely with encryption at rest and in transit.</li>
                                <li><strong>Audit Logs:</strong> Access to student data by administrators is logged and auditable for your protection.</li>
                            </ul>
                        </div>
                    </Card>
                 </AccordionContent>
             </AccordionItem>
        </Accordion>
    </div>
  );
}
