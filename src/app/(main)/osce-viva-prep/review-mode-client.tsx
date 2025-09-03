
"use client";

import { useState } from 'react';
import { useOsceSessions } from '@/contexts/osce-sessions-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClipboardCheck, BookOpen, Trash2, ArrowLeft, CaseSensitive, FileText, FlaskConical, Microscope, HeartPulse, ShieldPlus, Activity, User } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function CaseSection({ title, content, icon: Icon }: { title: string, content: string | undefined, icon: React.ElementType }) {
    if (!content) return null;
    return (
        <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-1"><Icon className="h-5 w-5 text-primary"/>{title}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap pl-7">{content}</p>
        </div>
    )
}

export function ReviewModeClient() {
    const { sessions, deleteSession, getSession } = useOsceSessions();
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    const selectedSession = selectedSessionId ? getSession(selectedSessionId) : null;

    if (selectedSession) {
        const { feedback, caseDetails } = selectedSession.output;
        if (!feedback || !caseDetails) {
             return (
                <Card>
                    <CardHeader>
                        <CardTitle>Error Loading Session</CardTitle>
                        <CardDescription>This session data is incomplete or corrupted.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => setSelectedSessionId(null)}><ArrowLeft className="mr-2"/>Back to List</Button>
                    </CardContent>
                </Card>
            )
        }

        const { scoring } = feedback;
        const rubricRows = [
            { domain: 'Communication', score: scoring.communication },
            { domain: 'Clinical Reasoning', score: scoring.clinicalReasoning },
            { domain: 'Calculation Accuracy', score: scoring.calculationAccuracy },
            { domain: 'Safety & Interactions', score: scoring.safetyAndInteractions },
            { domain: 'Structure & Time Management', score: scoring.structureAndTimeManagement },
        ];

        return (
            <div>
                 <Button onClick={() => setSelectedSessionId(null)} variant="outline" className="mb-4"><ArrowLeft className="mr-2"/>Back to List</Button>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Reviewing Session: {selectedSession.topic}</CardTitle>
                        <CardDescription>Completed on: {new Date(selectedSession.date).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert variant="default" className="bg-primary/10 border-primary/50"><ClipboardCheck className="h-4 w-4 text-primary" /><AlertTitle>Overall Feedback</AlertTitle><AlertDescription>{feedback.overallFeedback}</AlertDescription></Alert>
                        
                        <Accordion type="multiple" className="w-full space-y-4" defaultValue={['case', 'feedback', 'model']}>
                            <AccordionItem value="case">
                                <AccordionTrigger className="font-semibold text-lg"><CaseSensitive className="mr-2"/>Case Details</AccordionTrigger>
                                <AccordionContent className="p-4 space-y-4">
                                     <CaseSection title="Patient Demographics" content={caseDetails.demographics} icon={User}/>
                                     <CaseSection title="Chief Complaint" content={caseDetails.chiefComplaint} icon={FileText}/>
                                     <CaseSection title="History of Present Illness" content={caseDetails.hpi} icon={Activity}/>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="feedback">
                                <AccordionTrigger className="font-semibold text-lg"><ClipboardCheck className="mr-2"/>Feedback Details</AccordionTrigger>
                                <AccordionContent className="p-4 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Table>
                                                <TableHeader><TableRow><TableHead>Domain</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader>
                                                <TableBody>
                                                    {rubricRows.map(row => (
                                                        <TableRow key={row.domain}>
                                                            <TableCell>{row.domain}</TableCell>
                                                            <TableCell className="text-right font-bold">{row.score !== null ? `${row.score} / 5` : 'N/A'}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                         <div>
                                            <p className="font-semibold mb-2">Rationale:</p>
                                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                                <li>Diagnosis: {feedback.diagnosisConfirmation}</li>
                                                <li>Drug Choice: {feedback.drugChoiceRationale}</li>
                                                <li>Monitoring: {feedback.monitoringPlan}</li>
                                                <li>Counseling: {feedback.lifestyleCounseling}</li>
                                            </ul>
                                         </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="model">
                                <AccordionTrigger className="font-semibold text-lg"><BookOpen className="mr-2"/>Model Answer</AccordionTrigger>
                                <AccordionContent className="p-4 whitespace-pre-wrap">{feedback.modelAnswer}</AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                 </Card>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Review Past Sessions</CardTitle>
                <CardDescription>Select a previously completed exam mode session to review your feedback.</CardDescription>
            </CardHeader>
            <CardContent>
                {sessions.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8">
                        <BookOpen className="mx-auto h-12 w-12 mb-4"/>
                        <p>No saved sessions found.</p>
                        <p className="text-sm">Complete a station in "Exam Mode" to save it for review.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {sessions.map(session => (
                            <li key={session.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50">
                                <div>
                                    <p className="font-semibold">{session.topic}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(session.date).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                     <Button onClick={() => setSelectedSessionId(session.id)}>Review</Button>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon"><Trash2/></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this session record.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteSession(session.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                     </AlertDialog>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
