
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
import { AlertCircle, FileCheck, FileWarning, Globe, School, Trash2, PlusCircle, Save } from 'lucide-react';

const mockFlaggedSubmissions = [
  { student: 'Ali Ahmed', assignment: 'Pharmacology Essay', score: 42, date: '2024-05-20', status: 'Pending Review' },
  { student: 'Fatima Khan', assignment: 'Pharmaceutics Lab Report', score: 18, date: '2024-05-19', status: 'Reviewed' },
  { student: 'Zainab Omar', assignment: 'Final Year Project Thesis', score: 27, date: '2024-05-18', status: 'Pending Review' },
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
    </div>
  );
}
