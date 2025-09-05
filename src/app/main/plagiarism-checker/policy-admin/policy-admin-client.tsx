
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, FileCheck, FileWarning, Globe, School, Trash2, PlusCircle, Save, Bug, Award } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const mockFlaggedSubmissions = [
  { student: 'Ali Ahmed', assignment: 'Pharmacology Essay', score: 42, date: '2024-05-20', status: 'Pending Review' },
  { student: 'Fatima Khan', assignment: 'Pharmaceutics Lab Report', score: 18, date: '2024-05-19', status: 'Reviewed' },
  { student: 'Zainab Omar', assignment: 'Final Year Project Thesis', score: 27, date: '2024-05-18', status: 'Pending Review' },
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

const kpiList = [
    "% of students using pre-check before submission.",
    "Reduction in flagged cases escalated to integrity office.",
    "Time saved for instructors in preliminary screening.",
    "Student improvement: percentage of students who reduce similarity after remediation.",
    "False positive rate (target < 5%) on paraphrase detection.",
];


export function PolicyAdminClient() {
  const [thresholds, setThresholds] = useState({ medium: 11, high: 25 });
  const [allowSelfPlagiarism, setAllowSelfPlagiarism] = useState(false);
  const [whitelist, setWhitelist] = useState(['www.umt.edu.pk/course-materials', 'www.wikipedia.org']);
  const [newWhitelistUrl, setNewWhitelistUrl] = useState('');

  const handleSaveSettings = () => {
    toast({ title: 'Settings Saved', description: 'Your plagiarism policy settings have been updated.' });
  }
  
  const handleAddWhitelist = () => {
    if (newWhitelistUrl && !whitelist.includes(newWhitelistUrl)) {
        setWhitelist(prev => [...prev, newWhitelistUrl]);
        setNewWhitelistUrl('');
    }
  }

  const handleRemoveWhitelist = (urlToRemove: string) => {
    setWhitelist(prev => prev.filter(url => url !== urlToRemove));
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Similarity Thresholds</CardTitle>
          <CardDescription>Define the risk levels for the overall similarity score.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="medium-risk">Medium Risk (Amber) starts at: {thresholds.medium}%</Label>
            <div className="flex items-center gap-4">
                <AlertCircle className="h-5 w-5 text-amber-500"/>
                <Slider
                    id="medium-risk"
                    min={1}
                    max={100}
                    step={1}
                    value={[thresholds.medium]}
                    onValueChange={([val]) => setThresholds(prev => ({...prev, medium: val}))}
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="high-risk">High Risk (Red) starts at: {thresholds.high}%</Label>
             <div className="flex items-center gap-4">
                 <FileWarning className="h-5 w-5 text-destructive"/>
                <Slider
                    id="high-risk"
                    min={1}
                    max={100}
                    step={1}
                    value={[thresholds.high]}
                    onValueChange={([val]) => setThresholds(prev => ({...prev, high: val}))}
                />
             </div>
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Allow Self-Plagiarism</Label>
                <p className="text-sm text-muted-foreground">
                    Permit students to re-use content from their own previously submitted assignments.
                </p>
              </div>
              <Switch checked={allowSelfPlagiarism} onCheckedChange={setAllowSelfPlagiarism} />
            </div>
            <div className="flex justify-end">
                <Button onClick={handleSaveSettings}><Save className="mr-2"/>Save Settings</Button>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Source Management</CardTitle>
            <CardDescription>Manage whitelisted sources that are excluded from similarity scoring.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="space-y-4">
                <Label>Add a URL to the whitelist</Label>
                <div className="flex gap-2">
                    <Input value={newWhitelistUrl} onChange={(e) => setNewWhitelistUrl(e.target.value)} placeholder="e.g., www.example.com"/>
                    <Button onClick={handleAddWhitelist}><PlusCircle className="mr-2"/>Add</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Whitelisted URL</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {whitelist.map(url => (
                            <TableRow key={url}>
                                <TableCell className="font-mono text-sm">{url}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveWhitelist(url)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flagged Submissions Queue</CardTitle>
          <CardDescription>Review student submissions that have been flagged for high similarity.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockFlaggedSubmissions.map(sub => (
                        <TableRow key={sub.student}>
                            <TableCell>{sub.student}</TableCell>
                            <TableCell>{sub.assignment}</TableCell>
                            <TableCell>
                                <Badge variant={sub.score > 25 ? 'destructive' : 'default'} className="bg-amber-500 hover:bg-amber-600">
                                    {sub.score}%
                                </Badge>
                            </TableCell>
                            <TableCell>{sub.date}</TableCell>
                            <TableCell>{sub.status}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">Review</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
                        <CardDescription>How we measure the effectiveness and success of this tool.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                           {kpiList.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
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
      </Accordion>
    </div>
  );
}
