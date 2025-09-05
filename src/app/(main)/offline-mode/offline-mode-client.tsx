
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Download, CloudOff, BookOpen, CaseSensitive, History, Trash2, CheckCircle, WifiOff, FileDown, Award, Bug } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const kpiData = [
  { metric: "Feature Adoption Rate", formula: "(# students using offline mode) / (Total # students)", target: "> 40% within 1st semester" },
  { metric: "Content Download Rate", formula: "(# of downloaded items) / (# of available items)", target: "Core subjects > 70%" },
  { metric: "Offline Session Length", formula: "Avg. time spent in offline mode per session", target: "> 15 minutes" },
  { metric: "Sync Success Rate", formula: "Successful syncs / Total sync attempts", target: "> 99.5%" },
  { metric: "Cache Hit Ratio", formula: "(Offline content loads) / (Total content loads)", target: "Monitor correlation with grades" },
  { metric: "Storage Usage", formula: "Avg. MB used per student for offline data", target: "Stay below 500MB avg." },
  { metric: "User Satisfaction (CSAT/NPS)", formula: "Feedback from targeted surveys on this feature", target: "CSAT > 4.2/5" },
];


export function OfflineModeClient() {
  const [isOffline, setIsOffline] = useState(false);
  
  const handleDownload = (content: string) => {
    toast({
      title: `Downloading ${content}...`,
      description: "In a real app, this would start a background download.",
    });
  }

  const handleClearCache = () => {
    toast({
        title: "Cache Cleared",
        description: "All offline data has been removed.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><WifiOff/>Offline Mode Status</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center space-x-2 rounded-lg border p-4">
              <Switch id="offline-mode" checked={isOffline} onCheckedChange={setIsOffline} />
              <div className="flex-1">
                <Label htmlFor="offline-mode">Simulate Offline Connection</Label>
                <p className="text-xs text-muted-foreground">
                    Turn this on to test offline functionality. Features requiring an internet connection will be disabled.
                </p>
              </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Download />Download Content</CardTitle>
          <CardDescription>Select materials to download for offline access. This will use your device's storage.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => handleDownload('Lecture Notes')}>
                <BookOpen className="mr-4 h-6 w-6"/>
                <div className="text-left">
                    <p className="font-semibold">Lecture Notes Library</p>
                    <p className="text-xs text-muted-foreground">Download all course notes.</p>
                </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => handleDownload('Case Studies')}>
                <CaseSensitive className="mr-4 h-6 w-6"/>
                <div className="text-left">
                    <p className="font-semibold">Patient Case Studies</p>
                    <p className="text-xs text-muted-foreground">Save all cases for offline review.</p>
                </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => handleDownload('Drug Formulary')}>
                 <FileDown className="mr-4 h-6 w-6"/>
                 <div className="text-left">
                    <p className="font-semibold">Basic Drug Formulary</p>
                    <p className="text-xs text-muted-foreground">Download a lite version of the drug tree.</p>
                </div>
            </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History/>Cached Data Management</CardTitle>
          <CardDescription>View your currently downloaded data and clear the cache if needed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg flex justify-between items-center bg-muted/50">
                 <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500"/>
                    <div>
                        <p className="font-semibold">Offline data is synced.</p>
                        <p className="text-xs text-muted-foreground">Last updated: Just now | Size: 128 MB</p>
                    </div>
                 </div>
                 <Button variant="destructive" onClick={handleClearCache}><Trash2 className="mr-2"/>Clear Cache</Button>
            </div>
        </CardContent>
      </Card>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Product Goals & KPIs</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award /> Goals & Success Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Primary Goals</h3>
                  <ul className="list-disc list-inside text-muted-foreground text-sm">
                    <li><strong className="text-foreground">Accessibility:</strong> Enable learning for students in low-connectivity areas.</li>
                    <li><strong className="text-foreground">Engagement:</strong> Allow studying during commutes or power outages.</li>
                    <li><strong className="text-foreground">Outcomes:</strong> Drive better results by increasing total study time.</li>
                  </ul>
                </div>
                <div>
                    <h3 className="font-semibold">Key Performance Indicators (KPIs)</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Metric</TableHead>
                                <TableHead>Formula / Definition</TableHead>
                                <TableHead>Target</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kpiData.map(kpi => (
                                <TableRow key={kpi.metric}>
                                    <TableCell>{kpi.metric}</TableCell>
                                    <TableCell className="font-mono text-xs">{kpi.formula}</TableCell>
                                    <TableCell>{kpi.target}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
}
