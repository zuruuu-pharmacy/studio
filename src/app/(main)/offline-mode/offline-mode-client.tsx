
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Download, CloudOff, BookOpen, CaseSensitive, History, Trash2, CheckCircle, WifiOff, FileDown, Award, Bug, ShieldCheck, Settings, BarChart } from "lucide-react";
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

const qaChecklist = [
    "Upload various formats (PDF, DOCX, PPT, TXT).",
    "OCR accuracy across scanned handwritten pages.",
    "Correct detection of quoted + cited passages.",
    "Paraphrase detection sensitivity: assess true positives/false positives.",
    "Highlighting correctly maps to original page & offsets.",
    "Quick re-check latency acceptable (<10s for a small re-scan).",
    "Access control, encryption, and delete flows validated.",
    "Validate thresholds and false positive rate against human review for fairness.",
];

const securityChecklist = [
    "All downloaded content (notes, videos, quiz data) MUST be stored using AES-256 encryption on the local device.",
    "Annotations and user-generated content must also be encrypted locally.",
    "Encryption keys should be managed securely and tied to the user's session.",
    "After a device restart or a set period of inactivity (e.g., 24 hours), the app MUST require the user to re-authenticate online before accessing downloaded content.",
    "To prevent unauthorized access on a shared or lost device, the offline library MUST be protected by a secondary local authentication layer (device PIN/biometric or a separate app-specific PIN).",
    "Patient case studies for offline use MUST have all personally identifiable information (PII) scrubbed or replaced with placeholders.",
    "Display a clear warning message to the user before they download patient-related data for offline use, reminding them of their responsibility to protect sensitive information."
];

const adminFeatures = [
    "Marking content as offline-eligible: In the main content library, teachers see an 'Available Offline' toggle next to each resource. Toggling it on adds the content to the offline cache for students.",
    "Setting expiry times: When marking content as offline-eligible, an optional 'Expiry Date' field appears. If set, the content will be automatically deleted from student devices after this date.",
    "Locking quiz offline attempts: For summative assessments, a 'Disable Offline Attempts' checkbox is available in the quiz settings to prevent students from taking it without an internet connection.",
    "Viewing sync status of class: An admin dashboard shows a table of students, their last sync time, and a status icon (green for recent, amber for >24h, red for >72h).",
];

const analyticsPoints = [
    "Key metrics logged include: content download timestamps, download failures (with reason), sync start/end times, offline quiz attempts and scores, and offline session duration.",
    "Data is queued locally on the device and synced in batches to a secure analytics backend when an internet connection is available to minimize battery and data usage.",
    "The admin dashboard will feature charts visualizing this data, such as a 'Weekly Offline Activity' chart showing total downloads and average session length per day."
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
      
      <Accordion type="multiple" className="w-full space-y-2">
        <AccordionItem value="kpis" className="border-0">
            <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">
                Product Metrics & KPIs
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award/>Success Metrics & KPIs</CardTitle>
                        <CardDescription>How we measure the effectiveness and success of this feature.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="qa-checklist" className="border-0">
            <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">
                Testing & QA Checklist
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bug/>Quality Assurance Checklist</CardTitle>
                        <CardDescription>Key validation points for ensuring tool reliability and fairness.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                           {qaChecklist.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
         <AccordionItem value="security" className="border-0">
            <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">
                Security & Privacy
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck/>Security & Privacy Rules</CardTitle>
                        <CardDescription>Core principles for protecting user and patient data in offline mode.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-3 text-sm text-muted-foreground">
                           {securityChecklist.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
         <AccordionItem value="admin-features" className="border-0">
            <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">
                Teacher & Admin Features
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Settings/>Teacher & Admin Features</CardTitle>
                        <CardDescription>How faculty and administrators will manage offline content and monitor its usage.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-3 text-sm text-muted-foreground">
                           {adminFeatures.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="analytics" className="border-0">
            <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">
                Analytics & Monitoring
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart/>Analytics & Monitoring</CardTitle>
                        <CardDescription>How we track the usage and performance of the offline mode feature.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-3 text-sm text-muted-foreground">
                           {analyticsPoints.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
}
