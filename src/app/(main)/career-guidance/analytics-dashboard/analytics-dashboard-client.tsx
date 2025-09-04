
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, Briefcase, CheckCircle, Lightbulb, Target, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const satisfactionChartData = [
  { item: "Mentor Sessions", rating: 4.5 },
  { item: "CV Workshop", rating: 4.2 },
  { item: "Industry Talk", rating: 4.8 },
  { item: "Licensing Seminar", rating: 4.1 },
];

const cohortChartData = [
    { path: "Clinical", students: 45, color: "hsl(var(--chart-1))" },
    { path: "Industry", students: 25, color: "hsl(var(--chart-2))"  },
    { path: "Community", students: 20, color: "hsl(var(--chart-3))"  },
    { path: "Regulatory", students: 10, color: "hsl(var(--chart-4))"  },
];

const chartConfig = {
  students: {
    label: "Students",
  },
} satisfies ChartConfig

export function AnalyticsDashboardClient() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Career Readiness</CardTitle>
          <CardDescription>Target Role: Clinical Research Associate</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="text-7xl font-bold text-primary">82%</div>
            <p className="text-muted-foreground mb-4">Readiness Score</p>
            <Progress value={82} className="w-full max-w-sm" />
             <p className="text-xs text-muted-foreground mt-2">Based on your completed milestones and skills.</p>
        </CardContent>
      </Card>

       <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target /> Roadmap Progress</CardTitle>
              <Progress value={60} className="mt-2"/>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">1 of 3 roadmaps active.</p>
            <p className="text-sm text-muted-foreground">6 of 10 milestones completed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle /> Skills & Certs</CardTitle>
              <Progress value={75} className="mt-2"/>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">3 of 4 core skills acquired.</p>
             <p className="text-sm text-muted-foreground">1 of 2 certifications in progress.</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase />Application Funnel</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow><TableCell>Applied</TableCell><TableCell className="text-right font-bold">5</TableCell></TableRow>
                        <TableRow><TableCell>Interviews</TableCell><TableCell className="text-right font-bold">2</TableCell></TableRow>
                        <TableRow><TableCell>Offers</TableCell><TableCell className="text-right font-bold">1</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb /> AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
            <Alert>
                <AlertTitle className="font-bold">Next Steps</AlertTitle>
                <AlertDescription>
                    You’re 80% ready for a hospital residency; complete one more clinical rotation and pass the BCPS certification to be fully prepared.
                </AlertDescription>
            </Alert>
        </CardContent>
       </Card>
       
       <div className="grid lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star/>Satisfaction Scores</CardTitle>
                    <CardDescription>Average student feedback on career events.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{
                        rating: {
                            label: "Avg. Rating",
                            color: "hsl(var(--chart-2))",
                        }
                    }} className="h-[250px] w-full">
                        <BarChart
                            data={satisfactionChartData}
                            layout="vertical"
                            margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                        >
                            <YAxis
                                dataKey="item"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                width={110}
                                className="text-xs"
                            />
                            <XAxis dataKey="rating" type="number" hide />
                             <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="rating" layout="vertical" radius={5} fill="var(--color-rating)">
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart/> Cohort Placement Analytics</CardTitle>
                    <CardDescription>Anonymized job placement outcomes for your graduating class.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart data={cohortChartData} margin={{ top: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="path"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                className="text-xs"
                            />
                             <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="students" radius={8}>
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}

    