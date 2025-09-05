
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, CheckCircle, Lightbulb, Target, TrendingUp, Database, TrendingDown, Minus, HelpCircle, FileText, FlaskConical, BrainCircuit } from "lucide-react";
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

const getMasteryBgColor = (score: number) => {
  if (score >= 85) return "bg-green-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
};

const getTrendIcon = (trend: string) => {
    switch (trend) {
        case 'positive': return <TrendingUp className="h-5 w-5 text-green-500"/>;
        case 'negative': return <TrendingDown className="h-5 w-5 text-red-500"/>;
        default: return <Minus className="h-5 w-5 text-muted-foreground"/>;
    }
}

export function ProgressTrackerClient() {
  const overallMastery = Math.round(masteryData.reduce((acc, item) => acc + item.masteryScore, 0) / masteryData.length);
  const strongSubjects = masteryData.filter(s => s.masteryScore >= 85).length;
  const moderateSubjects = masteryData.filter(s => s.masteryScore >= 60 && s.masteryScore < 85).length;
  const weakSubjects = masteryData.filter(s => s.masteryScore < 60).length;

  return (
    <div className="space-y-6">
       <Card>
          <CardHeader>
             <CardTitle>Overall Progress Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col items-center justify-center">
                <div className={cn("text-7xl font-bold", getMasteryColor(overallMastery))}>{overallMastery}%</div>
                <p className="text-muted-foreground">Overall Mastery Score</p>
            </div>
            <div className="flex gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">{strongSubjects}</p>
                    <p className="text-sm text-green-700">Strong</p>
                </div>
                <div className="text-center p-4 bg-amber-500/10 rounded-lg">
                    <p className="text-3xl font-bold text-amber-600">{moderateSubjects}</p>
                    <p className="text-sm text-amber-700">Moderate</p>
                </div>
                <div className="text-center p-4 bg-red-500/10 rounded-lg">
                    <p className="text-3xl font-bold text-red-600">{weakSubjects}</p>
                    <p className="text-sm text-red-700">Weak</p>
                </div>
            </div>
            <Alert className="md:max-w-xs">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className="font-semibold">AI Recommendation</AlertTitle>
                <AlertDescription>
                   Focus on <strong className="text-red-500">Pathology</strong> this week by reviewing your lecture notes and completing a practice quiz.
                </AlertDescription>
            </Alert>
          </CardContent>
       </Card>

       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {masteryData.map(item => (
            <Card key={item.subject} className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle>{item.subject}</CardTitle>
                        {getTrendIcon(item.trend)}
                    </div>
                    <CardDescription>Mastery Score</CardDescription>
                    <p className={cn("text-4xl font-bold", getMasteryColor(item.masteryScore))}>
                        {item.masteryScore}%
                    </p>
                    <Progress value={item.masteryScore} className="[&>*]:bg-transparent" />
                </CardHeader>
                 <CardContent className="flex-grow">
                    <p className="text-xs text-muted-foreground">Last Activity: {item.lastActivity}</p>
                    <p className="text-xs text-muted-foreground">Data Density: <Badge variant={item.dataDensity === 'High' ? 'default' : item.dataDensity === 'Medium' ? 'secondary' : 'outline'}>{item.dataDensity}</Badge></p>
                </CardContent>
                <CardContent>
                    <Button variant="outline" className="w-full">Drill Down</Button>
                </CardContent>
            </Card>
         ))}
       </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BrainCircuit /> How Your Mastery Score is Calculated</CardTitle>
                <CardDescription>Our algorithm combines multiple data points to create a holistic view of your understanding.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="step-a">
                        <AccordionTrigger>Step A: Normalization & Recency</AccordionTrigger>
                        <AccordionContent>
                            All scores from quizzes, assignments, and practice sessions are standardized to a 0–100 scale. More recent activities are given a higher weight to reflect your current knowledge state.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="step-b">
                        <AccordionTrigger>Step B: Weighted Components</AccordionTrigger>
                        <AccordionContent>
                            <p>Your Mastery Score is a weighted average of different activities:</p>
                            <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                                <li><strong>Latest quiz average:</strong> 40%</li>
                                <li><strong>Practice accuracy (flashcards, drills):</strong> 25%</li>
                                <li><strong>Assignment/lab performance:</strong> 20%</li>
                                <li><strong>Engagement time & completion:</strong> 10%</li>
                                <li><strong>Teacher/OSCE score (if available):</strong> 5%</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="step-c">
                        <AccordionTrigger>Step C: Forgetting Penalty</AccordionTrigger>
                        <AccordionContent>
                            To encourage continuous review, a small downward adjustment is applied if a topic hasn't been reviewed recently. The score's weight is reduced if you haven't interacted with the topic for over 30 days without a dedicated review session.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="step-d">
                        <AccordionTrigger>Step D: Error Type Classification</AccordionTrigger>
                        <AccordionContent>
                            <p>We use AI to categorize errors to provide targeted feedback:</p>
                             <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                                <li><strong>Conceptual:</strong> Confusing core principles.</li>
                                <li><strong>Procedural:</strong> Missing steps in a calculation or process.</li>
                                <li><strong>Factual:</strong> Forgetting a key fact, like a dose or name.</li>
                                <li><strong>Application:</strong> Unable to apply a concept to a case study.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

    </div>
  );
}
