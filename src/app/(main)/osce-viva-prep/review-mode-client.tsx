
"use client";

import { useState } from 'react';
import { useOsceSessions } from '@/contexts/osce-sessions-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClipboardCheck, BookOpen, Trash2, ArrowLeft } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function ReviewModeClient() {
    const { sessions, deleteSession, getSession } = useOsceSessions();
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    const selectedSession = selectedSessionId ? getSession(selectedSessionId) : null;

    if (selectedSession) {
        const { feedback } = selectedSession.output;
        if (!feedback) {
             return (
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>This session does not contain valid feedback to review.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => setSelectedSessionId(null)}><ArrowLeft className="mr-2"/>Back to List</Button>
                    </CardContent>
                </Card>
            )
        }
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
                        <Accordion type="multiple" className="w-full space-y-4" defaultValue={['diagnosis', 'drugs', 'monitoring', 'counseling']}>
                            <AccordionItem value="diagnosis"><AccordionTrigger className="font-semibold text-lg">Diagnosis Confirmation</AccordionTrigger><AccordionContent className="p-4">{feedback.diagnosisConfirmation}</AccordionContent></AccordionItem>
                            <AccordionItem value="drugs"><AccordionTrigger className="font-semibold text-lg">Drug Choice Rationale</AccordionTrigger><AccordionContent className="p-4">{feedback.drugChoiceRationale}</AccordionContent></AccordionItem>
                            <AccordionItem value="monitoring"><AccordionTrigger className="font-semibold text-lg">Monitoring Plan</AccordionTrigger><AccordionContent className="p-4">{feedback.monitoringPlan}</AccordionContent></AccordionItem>
                            <AccordionItem value="counseling"><AccordionTrigger className="font-semibold text-lg">Lifestyle Counseling</AccordionTrigger><AccordionContent className="p-4">{feedback.lifestyleCounseling}</AccordionContent></AccordionItem>
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
