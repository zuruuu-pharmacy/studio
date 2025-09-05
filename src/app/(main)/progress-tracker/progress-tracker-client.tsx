
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


const masteryData = [
  {
    subject: "Pharmacology",
    masteryScore: 92,
    trend: "positive",
    dataDensity: "High",
  },
  {
    subject: "Pharmaceutics",
    masteryScore: 68,
    trend: "positive",
    dataDensity: "Medium",
  },
  {
    subject: "Pharmacognosy",
    masteryScore: 75,
    trend: "neutral",
    dataDensity: "High",
  },
  {
    subject: "Pathology",
    masteryScore: 55,
    trend: "negative",
    dataDensity: "Low",
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

export function ProgressTrackerClient() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart/>Subject Mastery Overview</CardTitle>
          <CardDescription>Your calculated mastery scores across different subjects based on all activities.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Mastery Score</TableHead>
                    <TableHead className="text-center">Trend (Last 2 wks)</TableHead>
                    <TableHead className="text-center">Data Density</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {masteryData.map(item => (
                    <TableRow key={item.subject}>
                        <TableCell className="font-semibold">{item.subject}</TableCell>
                        <TableCell className={cn("text-center font-bold text-2xl", getMasteryColor(item.masteryScore))}>
                            {item.masteryScore}%
                        </TableCell>
                        <TableCell className="flex justify-center items-center">
                            {getTrendIcon(item.trend)}
                        </TableCell>
                         <TableCell className="text-center">
                            <Badge variant={item.dataDensity === 'High' ? 'default' : item.dataDensity === 'Medium' ? 'secondary' : 'outline'}>
                                {item.dataDensity}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
           </Table>
        </CardContent>
      </Card>


       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb /> AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
            <Alert>
                <AlertTitle className="font-bold">Study Rebalancing Suggestion</AlertTitle>
                <AlertDescription>
                    Your mastery in <strong className="text-green-500">Pharmacology</strong> is excellent. However, your score in <strong className="text-red-500">Pathology</strong> is low and trending downwards with low data density. Consider allocating one more study session to Pathology this week, focusing on foundational topics to build evidence of your learning.
                </AlertDescription>
            </Alert>
        </CardContent>
       </Card>

        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database/>Data Sources</CardTitle>
            <CardDescription>Your Mastery Score is calculated using data from all your interactions across the portal.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {dataSources.map((source) => (
                        <div key={source.name} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                            <source.icon className="h-5 w-5 text-primary"/>
                            <span className="font-medium text-muted-foreground">{source.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
       </Card>
       
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

