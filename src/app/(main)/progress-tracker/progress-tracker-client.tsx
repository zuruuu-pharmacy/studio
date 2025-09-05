
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, CheckCircle, Lightbulb, Target, TrendingUp, Database, TrendingDown, Minus } from "lucide-react";
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

    </div>
  );
}

