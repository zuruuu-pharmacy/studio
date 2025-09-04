
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, Map, PlusCircle, Calendar, Bot } from "lucide-react";

export function RoadmapBuilderClient() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left Panel: Timeline */}
        <div className="lg:col-span-2">
            <Card className="min-h-[600px]">
                <CardHeader>
                    <CardTitle>Your Career Roadmap</CardTitle>
                    <CardDescription>Drag items from the toolbox onto your timeline.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center h-full">
                     <Construction className="h-24 w-24 text-muted-foreground/30 mb-4" />
                     <h3 className="text-xl font-semibold text-muted-foreground">Timeline Canvas</h3>
                     <p className="text-muted-foreground/80 mt-2">This interactive feature is under construction.</p>
                </CardContent>
            </Card>
        </div>
        {/* Right Panel: Toolbox */}
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Toolbox</CardTitle>
                    <CardDescription>Add milestones to your map.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start"><PlusCircle className="mr-2"/>Add Milestone</Button>
                    <Button variant="outline" className="w-full justify-start"><Calendar className="mr-2"/>Add Deadline</Button>
                    <Button variant="outline" className="w-full justify-start"><Bot className="mr-2"/>Get AI Suggestion</Button>
                    <hr />
                    <Button className="w-full"><Map className="mr-2"/>Start with a Template</Button>
                </CardContent>
            </Card>
        </div>

    </div>
  );
}
