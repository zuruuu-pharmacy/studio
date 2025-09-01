
"use client";

import { useTransition, useState, useEffect } from 'react';
import { usePatient } from '@/contexts/patient-context';
import { getEmergencyAssistance, type EmergencyAssistanceOutput } from '@/ai/flows/emergency-assistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Siren, Phone, User, ShieldAlert, MessageSquare, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

interface LocationState {
    lat: number;
    lng: number;
}

function EmergencyActionButton({ href, icon: Icon, title, description, variant = 'default', onClick, disabled }: { href?: string; icon: React.ElementType; title: string; description: string; variant?: 'default' | 'destructive' | 'secondary', onClick?: () => void; disabled?: boolean }) {
    const content = (
         <Button size="lg" variant={variant} className="w-full h-auto justify-start py-4" onClick={onClick} disabled={disabled}>
            <Icon className="h-8 w-8 mr-4" />
            <div className="text-left">
                <p className="font-bold text-lg">{title}</p>
                <p className="text-sm opacity-90">{description}</p>
            </div>
        </Button>
    );
    
    if (href && !onClick) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
    }

    return content;
}


export function EmergencyClient() {
    const [state, setState] = useState<EmergencyAssistanceOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const { getActivePatientRecord } = usePatient();
    const activePatientRecord = getActivePatientRecord();
    const { toast } = useToast();
    const [view, setView] = useState<'initial' | 'activated'>('initial');
    const [location, setLocation] = useState<LocationState | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);


    const handleActivation = () => {
        if (!activePatientRecord) {
            toast({ variant: 'destructive', title: 'No Patient Record', description: 'Cannot activate emergency mode without an active patient.' });
            return;
        }

        startTransition(async () => {
            try {
                // Request location first
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                        setLocationError(null);
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        setLocationError("Could not get location. Please enable location services.");
                        toast({ variant: 'destructive', title: 'Location Error', description: 'Could not get your location. Please enable it in your browser.' });
                    }
                );
                
                const result = await getEmergencyAssistance({ detailedHistory: activePatientRecord.history });
                setState(result);
                setView('activated');
            } catch (e) {
                console.error(e);
                toast({ variant: 'destructive', title: 'Error', description: 'Failed to get emergency assistance data.' });
            }
        });
    }

    const handleShareLocation = () => {
        if (!location) {
            toast({ variant: 'destructive', title: 'Location not available', description: 'Cannot share location. Please ensure it is enabled.'});
            return;
        }
        if (!activePatientRecord?.history.caretakerPhoneNumber) {
             toast({ variant: 'destructive', title: 'No Caregiver Number', description: 'There is no caretaker phone number in the patient record to send the location to.'});
            return;
        }
        
        const mapsLink = `https://maps.google.com/?q=${location.lat},${location.lng}`;
        const message = encodeURIComponent(`🚨 Emergency Alert 🚨\nHelp needed for ${activePatientRecord.history.name}. My current location is: ${mapsLink}`);
        // Format number for WhatsApp: remove non-digits. Assume it includes country code.
        const whatsAppNumber = activePatientRecord.history.caretakerPhoneNumber.replace(/\D/g, '');

        window.open(`https://wa.me/${whatsAppNumber}?text=${message}`, '_blank');
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
                    <EmergencyActionButton 
                        icon={MessageSquare} 
                        title="Share Location via WhatsApp" 
                        description="Send location to your caregiver." 
                        variant="secondary"
                        onClick={handleShareLocation}
                        disabled={!location}
                    />
                </div>
                {locationError && <p className="text-sm text-center text-destructive">{locationError}</p>}
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
