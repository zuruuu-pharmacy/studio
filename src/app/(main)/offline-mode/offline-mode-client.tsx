
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Download, CloudOff, BookOpen, CaseSensitive, History, Trash2, CheckCircle, WifiOff, FileDown, Award, Bug, ShieldCheck, Settings, BarChart, Milestone } from "lucide-react";
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
    { category: 'Downloads', test: 'Download single PDF note file.', expected: 'File downloads successfully, progress bar shows, notification on complete.' },
    { category: 'Sync', test: 'Make 5 annotations offline, then reconnect.', expected: 'App detects connection, initiates sync, all 5 annotations upload successfully.' },
    { category: 'Storage', test: 'Download files until 95% of allocated cache is full.', expected: '“Low Storage” warning appears. Subsequent downloads are blocked.' },
    { category: 'Conflict Resolution', test: 'Modify a note\'s annotation offline, while a collaborator modifies the same one online.', expected: 'On sync, conflict resolution pop-up appears with “Keep Local”/“Keep Server” options.' },
    { category: 'Performance', test: 'Load an offline-cached 100-page PDF.', expected: 'PDF renders in under 2 seconds.' },
    { category: 'Device Matrix', test: 'Test all core flows on: Chrome (Desktop), Safari (iOS), Chrome (Android).', expected: 'All features work consistently across browsers.' },
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

const rolloutPlan = [
    { phase: "Phase 1: MVP", focus: "Notes & Quizzes", description: "Core functionality to download lecture notes and attempt quizzes offline. Syncing is basic (last-write-wins).", metrics: "Adoption Rate > 10%; Sync Success > 98%" },
    { phase: "Phase 2: Rich Media & Study Tools", focus: "Videos & Flashcards", description: "Enable downloading of video lectures and flashcard decks. Introduce selective download by topic.", metrics: "Video download rate > 30%; Offline session length > 10 mins" },
    { phase: "Phase 3: Advanced Sync & Admin Tools", focus: "Annotations & Controls", description: "Implement offline annotations, conflict resolution sync logic, and teacher controls for content expiry.", metrics: "CSAT score > 4.0; Reduction in sync conflicts by 50%" },
]


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
         <AccordionItem value="rollout" className="border-0">
            <AccordionTrigger className="text-base text-muted-foreground flex justify-center p-2 hover:no-underline">
                Phased Rollout Plan
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Milestone/>Feature Rollout Plan</CardTitle>
                        <CardDescription>A phased approach to launching Offline Mode, starting with an MVP.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Phase</TableHead>
                                    <TableHead>Focus</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Success Metrics</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rolloutPlan.map(phase => (
                                    <TableRow key={phase.phase}>
                                        <TableCell className="font-semibold">{phase.phase}</TableCell>
                                        <TableCell>{phase.focus}</TableCell>
                                        <TableCell>{phase.description}</TableCell>
                                        <TableCell>{phase.metrics}</TableCell>
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
                Testing & QA Plan
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bug/>Quality Assurance Test Plan</CardTitle>
                        <CardDescription>Key validation points for ensuring tool reliability and fairness.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Test Case</TableHead>
                                    <TableHead>Expected Result</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {qaChecklist.map((item, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell>{item.test}</TableCell>
                                        <TableCell>{item.expected}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
