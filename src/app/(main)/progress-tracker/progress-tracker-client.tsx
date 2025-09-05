
"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, CheckCircle, Lightbulb, Target, TrendingUp, Database, TrendingDown, Minus, HelpCircle, FileText, FlaskConical, BrainCircuit, Book, Zap, ListOrdered, BookCopy, Bell, ArrowLeft, ShieldQuestion, ShieldCheck, Award, Bug } from "lucide-react";
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
    masteryScore: 52,
    trend: "negative",
    dataDensity: "High",
    lastActivity: "Lab: Tablet Dissolution",
     topics: [
        { name: "Dosage Form Design", score: 75 },
        { name: "Tablet Dissolution", score: 52, error: 'procedural' },
        { name: "Biopharmaceutics", score: 71 },
    ]
  },
  {
    subject: "Pharmacognosy",
    masteryScore: 58,
    trend: "neutral",
    dataDensity: "Medium",
    lastActivity: "Practice: Alkaloids",
    topics: [
      { name: "Plant ID", score: 58, error: 'factual' },
    ]
  },
   {
    subject: "Pathology",
    masteryScore: 88,
    trend: "positive",
    dataDensity: "Medium",
    lastActivity: "Assignment: Inflammation",
     topics: [
        { name: "Inflammation Pathways", score: 40, error: 'conceptual' },
        { name: "Cell Injury", score: 65 },
    ]
  },
   {
    subject: "Biochemistry",
    masteryScore: 85,
    trend: "positive",
    dataDensity: "Low",
    lastActivity: "N/A",
    topics: []
  },
  {
    subject: "Clinical Pharmacy",
    masteryScore: 78,
    trend: "positive",
    dataDensity: "High",
    lastActivity: "OSCE Practice: Counseling",
    topics: [],
  },
  {
    subject: "Pharmaceutical Chemistry",
    masteryScore: 65,
    trend: "neutral",
    dataDensity: "Medium",
    lastActivity: "Assignment: Titrations",
    topics: [],
  }
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
    conceptual: "Conceptual Error",
    factual: "Factual Error"
}

const chartConfig = {
  subjects: {
    label: "Subjects",
  },
} satisfies ChartConfig


const recommendationMap: {[key: string]: { rec: string, actions: { label: string, icon: React.ElementType, toast: string }[] }} = {
      "Drug Interactions": {
          rec: "Error type: Application. Focus on applying knowledge to patient cases.",
          actions: [
              { label: "30-min case set (10 MCQs)", icon: Zap, toast: "A new case set on Drug Interactions has been assigned." },
              { label: "Watch 12-min video", icon: BookCopy, toast: "An interaction framework video has been added to your queue." },
          ]
      },
       "Tablet Dissolution": {
          rec: "Error type: Procedural. Reinforce the steps and calculations.",
          actions: [
              { label: "Lab Walkthrough", icon: FlaskConical, toast: "The dissolution lab simulation has been scheduled." },
          ]
      },
      "Plant ID": {
          rec: "Error type: Factual. Reinforce memorization of key identifiers.",
          actions: [
               { label: "10 Flashcards + Spotter", icon: Zap, toast: "A new flashcard deck for Plant ID has been created." },
          ]
      }
}

const qaChecklist = [
    "Verify mastery recalculation within 1 minute of new result.",
    "Confirm recommendations map correctly to error types.",
    "Load test dashboard for classes of 1000+ students.",
    "Validate privacy: students can hide/share data.",
    "UX: ensure microblocks add to Study Planner seamlessly."
];


export function ProgressTrackerClient() {
  const [selectedSubject, setSelectedSubject] = useState<typeof masteryData[0] | null>(null);

  const overallMastery = 72;
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
  
  const prioritizedWeakness = [...weakSubjects].sort((a,b) => a.masteryScore - b.masteryScore);

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
                    <p className="text-sm text-green-500 font-semibold flex items-center gap-1 mt-1"><TrendingUp className="h-4 w-4"/> +6% (last 30 days)</p>
                </div>
                <div>
                    <p className="text-center font-semibold mb-2">2 Strong, 3 Moderate, 2 Weak</p>
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
                <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="text-primary"/>AI Recommended Actions &amp; Nudges</CardTitle><CardDescription>Your prioritized list of what to study next.</CardDescription></CardHeader>
                <CardContent className="space-y-3">
                    {[
                        { name: "Drug Interactions", subject: "Pharmacology", score: 45, error: 'application' },
                        { name: "Tablet Dissolution", subject: "Pharmaceutics", score: 52, error: 'procedural' },
                        { name: "Plant ID", subject: "Pharmacognosy", score: 58, error: 'factual' },
                    ].map(item => {
                        const recKey = item.name as keyof typeof recommendationMap;
                        const rec = recommendationMap[recKey];
                        if (!rec) return null;
                        const scoreText = `Mastery ${item.score}%`;
                        return (
                             <Alert key={item.name}>
                                <Lightbulb className="h-4 w-4" />
                                <AlertTitle className="font-bold">{item.subject}: {item.name} ({scoreText})</AlertTitle>
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
                        <AlertTitle className="font-bold text-amber-700">Urgent Alert: Topic Dropped</AlertTitle>
                        <AlertDescription>
                           Your score in "Drug Interactions" dropped from 72% to 45% this week. A 30-minute remediation is recommended.
                           <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="secondary" onClick={() => toast({title: "Action Triggered", description: "Review launched."})}>
                                <BookCopy className="mr-2"/>Start Now
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
             <AccordionItem value="explanation" className="border-0">
                 <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">How is my Mastery Score Calculated?</AccordionTrigger>
                 <AccordionContent className="space-y-4">
                    <Card className="p-6">
                         <div className="space-y-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><BrainCircuit className="text-primary"/>Algorithm Highlights</h4>
                            <p className="text-sm text-muted-foreground mb-2">Your Mastery Score is a dynamic metric computed from various learning activities using a weighted average with time decay:</p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                <li><strong>Recency Matters:</strong> More recent quiz scores and activities are weighted more heavily.</li>
                                <li><strong>Component Weighting:</strong> Different activities contribute differently (e.g., quizzes have more weight than flashcard practice).</li>
                                <li><strong>Forgetting Penalty:</strong> A small penalty is applied to topics not reviewed recently to encourage continuous learning.</li>
                                <li><strong>Error Type Classification:</strong> The AI categorizes errors (conceptual, procedural, etc.) to drive targeted recommendations.</li>
                            </ul>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Database className="text-primary"/>Data Sources</h4>
                        <p className="text-sm text-muted-foreground mb-2">Your score is computed from all learning touchpoints across the portal:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {dataSources.map(ds => <li key={ds.name} className="flex items-center gap-2"><ds.icon className="text-primary"/>{ds.name}</li>)}
                        </ul>
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
              <AccordionItem value="kpis" className="border-0">
                 <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">Product Metrics &amp; KPIs</AccordionTrigger>
                 <AccordionContent>
                    <Card className="p-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><Award className="text-primary"/>Measuring Success</h4>
                            <p className="text-sm text-muted-foreground mb-2">We track these key performance indicators to ensure this feature is effective and helpful for students and faculty:</p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                <li>Student engagement with AI-driven suggestions (% of recommendations accepted).</li>
                                <li>Average mastery change after a student completes a recommended intervention.</li>
                                <li>The time it takes for a student to improve a "flagged" or weak topic.</li>
                                <li>Effectiveness of teacher-led interventions triggered by dashboard insights.</li>
                                <li>Overall student satisfaction with the tracker (measured by Net Promoter Score).</li>
                            </ul>
                        </div>
                    </Card>
                 </AccordionContent>
             </AccordionItem>
              <AccordionItem value="qa" className="border-0">
                 <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">Testing &amp; QA Checklist</AccordionTrigger>
                 <AccordionContent>
                    <Card className="p-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><Bug className="text-primary"/>Quality Assurance</h4>
                            <p className="text-sm text-muted-foreground mb-2">We use the following checklist to ensure the Progress Tracker is reliable and accurate:</p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                {qaChecklist.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </Card>
                 </AccordionContent>
             </AccordionItem>
        </Accordion>
    </div>
  );
}
