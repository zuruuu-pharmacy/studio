
"use client";

import { useTransition, useState, useEffect } from 'react';
import { usePatient } from '@/contexts/patient-context';
import { getEmergencyAssistance, type EmergencyAssistanceOutput } from '@/ai/flows/emergency-assistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Siren, Phone, HeartPulse, User, ShieldAlert, MessageSquare, MapPin, Clipboard, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

function EmergencyActionButton({ href, icon: Icon, title, description, variant = 'default' }: { href: string; icon: React.ElementType; title: string; description: string; variant?: 'default' | 'destructive' | 'secondary' }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
            <Button size="lg" variant={variant} className="w-full h-auto justify-start py-4">
                <Icon className="h-8 w-8 mr-4" />
                <div className="text-left">
                    <p className="font-bold text-lg">{title}</p>
                    <p className="text-sm opacity-90">{description}</p>
                </div>
            </Button>
        </a>
    )
}


export function EmergencyClient() {
    const [state, setState] = useState<EmergencyAssistanceOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const { getActivePatientRecord } = usePatient();
    const activePatientRecord = getActivePatientRecord();
    const { toast } = useToast();
    const [view, setView] = useState<'initial' | 'activated'>('initial');


    const handleActivation = () => {
        if (!activePatientRecord) {
            toast({ variant: 'destructive', title: 'No Patient Record', description: 'Cannot activate emergency mode without an active patient.' });
            return;
        }

        startTransition(async () => {
            try {
                const result = await getEmergencyAssistance({ detailedHistory: activePatientRecord.history });
                setState(result);
                setView('activated');
            } catch (e) {
                console.error(e);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to get emergency assistance data.' });
            }
        });
    }
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({ title: 'Copied to Clipboard', description: 'The emergency message is ready to be pasted.' });
        }, () => {
            toast({ variant: 'destructive', title: 'Failed to Copy' });
        });
    }
    
    if (!activePatientRecord) {
      return (
        <Card className="text-center">
            <CardHeader>
            <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
            <CardTitle>No Active Patient Case</CardTitle>
            <CardDescription>
                Please select a patient from the list or create a new one to use the emergency feature.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Link href="/patients" passHref>
                <Button><User className="mr-2"/>Go to Patient Records</Button>
            </Link>
            </CardContent>
      </Card>
      )
    }

    if (view === 'activated' && state) {
        return (
            <div className="space-y-6">
                 <Alert variant="destructive">
                    <Siren className="h-4 w-4" />
                    <AlertTitle>Emergency Mode Activated</AlertTitle>
                    <AlertDescription>
                        Use the buttons below to contact help immediately. Your medical summary has been prepared.
                    </AlertDescription>
                </Alert>
                <div className="grid md:grid-cols-2 gap-4">
                    <EmergencyActionButton href="tel:1122" icon={Siren} title="Call Ambulance (1122)" description="Immediately contact emergency services." variant="destructive"/>
                    <EmergencyActionButton href={`tel:${activePatientRecord.history.phoneNumber || ''}`} icon={Phone} title="Call Emergency Contact" description="Contact family or a caregiver." variant="secondary"/>
                    <EmergencyActionButton href="https://maps.google.com" icon={MapPin} title="Share Location" description="Send a map of your current location." variant="secondary"/>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare />Pre-formatted Emergency Message</CardTitle>
                        <CardDescription>Copy this message and send it via SMS or WhatsApp.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm p-4 bg-muted rounded-md whitespace-pre-wrap">{state.formattedSms}</p>
                        <Button onClick={() => copyToClipboard(state.formattedSms)} className="mt-4 w-full">
                            <Clipboard className="mr-2"/> Copy Message
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HeartPulse />Critical Medical Info</CardTitle>
                         {state.primaryRisk && <p className="text-sm text-destructive font-semibold pt-2">{state.primaryRisk}</p>}
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div><strong>Name:</strong> {state.patientSummary.name}</div>
                        <div><strong>Age:</strong> {state.patientSummary.age}</div>
                        <div><strong>Gender:</strong> {state.patientSummary.gender}</div>
                        <div><strong>Chronic Conditions:</strong> {state.patientSummary.chronicConditions}</div>
                        <div><strong>Current Medications:</strong> {state.patientSummary.currentMedications}</div>
                        <div><strong>Allergies:</strong> {state.patientSummary.allergies}</div>
                    </CardContent>
                </Card>

                 {state.firstAidTips && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Info />First Aid Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{state.firstAidTips}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center">
            <Card className="w-full max-w-lg text-center p-8 border-4 border-destructive/50 bg-destructive/10">
                <CardHeader>
                    <CardTitle className="text-4xl font-extrabold text-destructive">
                        Emergency Assistance
                    </CardTitle>
                    <CardDescription className="text-lg text-destructive/80">
                        This will prepare your medical data and contact options.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleActivation}
                        disabled={isPending}
                        variant="destructive"
                        size="lg"
                        className="w-full h-24 text-2xl rounded-full shadow-lg animate-pulse"
                    >
                        {isPending ? <Loader2 className="h-12 w-12 animate-spin" /> : <Siren className="h-12 w-12 mr-4" />}
                        TAP FOR HELP
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">Only use in a genuine emergency.</p>
                </CardContent>
            </Card>
        </div>
    );
}
