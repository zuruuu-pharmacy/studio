
"use client";

import { useState, useEffect, useCallback }from "react";
import { usePatient, type PatientRecord } from "@/contexts/patient-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Siren, HeartPulse, ShieldAlert, Phone, Map, MessageSquare, Loader2, LocateFixed, BadgeCheck, XCircle, Info, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";


type Mode = 'idle' | 'confirming' | 'activating' | 'ready' | 'error';
type Location = {
    lat: number;
    lng: number;
    accuracy: number;
} | null;

function MedicalSummary({ history }: { history: PatientRecord['history'] }) {
    const criticalInfo = [
        { label: 'Known Allergies', value: history.allergyHistory, important: true },
        { label: 'Past Medical History', value: history.pastMedicalHistory, important: false },
        { label: 'Current Medications', value: history.medicationHistory, important: false },
    ];
    return (
        <Card className="bg-background/50">
            <CardHeader><CardTitle className="text-lg">Critical Medical Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {criticalInfo.map(info => info.value && (
                    <div key={info.label}>
                        <h4 className="font-semibold">{info.label}</h4>
                        <p className={`text-muted-foreground ${info.important ? 'font-bold text-destructive' : ''}`}>{info.value}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export function EmergencyClient() {
    const [mode, setMode] = useState<Mode>('idle');
    const [location, setLocation] = useState<Location>(null);
    const [error, setError] = useState<string | null>(null);
    const { getActivePatientRecord } = usePatient();
    const activePatientRecord = getActivePatientRecord();

    const requestLocation = useCallback(() => {
        setMode('activating');
        setError(null);
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
                setMode('ready');
            },
            (err) => {
                setError(`Location Error: ${err.message}. Please enable location services.`);
                setMode('error');
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
    }, []);

    const handleActivate = () => {
        setMode('confirming');
    };
    
    const handleConfirm = () => {
        requestLocation();
    };

    const handleCancel = () => {
        setMode('idle');
    };
    
    if (!activePatientRecord) {
        return (
             <Card className="text-center">
                <CardHeader>
                    <CardTitle>No Active Patient</CardTitle>
                    <CardDescription>
                       Please select or create a patient profile to enable the Emergency Help feature.
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <Link href="/patient-history">
                        <Button><User className="mr-2"/> Go to Patient History</Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    const { name, caretakerPhoneNumber } = activePatientRecord.history;
    const whatsAppMessage = location
      ? `⚠️ EMERGENCY: ${name || 'Patient'} requires help. Current Location (±${location.accuracy.toFixed(0)}m): https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
      : `⚠️ EMERGENCY: ${name || 'Patient'} requires help. Location could not be determined.`;


    return (
        <div className="space-y-6">
            {mode === 'idle' && (
                 <Card className="text-center py-12 bg-destructive/10 border-destructive/50">
                    <CardHeader>
                        <Siren className="mx-auto h-16 w-16 text-destructive mb-4" />
                        <CardTitle className="text-3xl text-destructive">Emergency Mode</CardTitle>
                        <CardDescription className="max-w-md mx-auto">
                            Only use this feature in a genuine emergency. It will access your location and prepare to share your critical medical data with a caregiver or emergency services.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button size="lg" variant="destructive" onClick={handleActivate}>
                           Activate Emergency Mode
                        </Button>
                    </CardContent>
                </Card>
            )}

             <AlertDialog open={mode === 'confirming'} onOpenChange={(open) => !open && setMode('idle')}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Emergency Activation</AlertDialogTitle>
                        <AlertDialogDescription>
                           This will share your location and medical summary with caregivers and help services. Are you sure you want to proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} className="bg-destructive hover:bg-destructive/90">Yes, Share & Activate</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            {mode === 'activating' && (
                <Card className="text-center py-12">
                    <CardContent className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <p className="text-muted-foreground">Getting location... Please allow location access.</p>
                    </CardContent>
                </Card>
            )}
            
            {mode === 'error' && (
                 <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Activation Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    <div className="mt-4 flex gap-4">
                        <Button variant="secondary" onClick={requestLocation}>Retry</Button>
                        <a href="tel:1122"><Button>Call 1122 Directly</Button></a>
                    </div>
                </Alert>
            )}

            {mode === 'ready' && (
                <div className="space-y-6">
                    <Alert variant="default" className="bg-green-500/10 border-green-500">
                        <BadgeCheck className="h-4 w-4 text-green-600"/>
                        <AlertTitle className="text-green-700">Emergency Mode Activated</AlertTitle>
                        <AlertDescription className="flex justify-between items-center">
                            <span>Your information is ready to be shared.</span>
                            <Button variant="secondary" size="sm" onClick={handleCancel}>Cancel Emergency</Button>
                        </AlertDescription>
                    </Alert>

                     {location && (
                        <Card>
                            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><LocateFixed/>Your Location</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Location acquired with an accuracy of {location.accuracy.toFixed(0)} meters.</p>
                                 <div className="flex gap-2 mt-2">
                                     <a href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline"><Map className="mr-2"/>Open in Maps</Button>
                                    </a>
                                 </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <a href="tel:1122">
                                <Button variant="destructive" className="w-full h-full text-lg py-4"><Phone className="mr-2"/>Call 1122</Button>
                            </a>
                            <a href={`https://wa.me/${caretakerPhoneNumber}?text=${encodeURIComponent(whatsAppMessage)}`} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full h-full text-lg py-4 bg-green-600 hover:bg-green-700"><MessageSquare className="mr-2"/>Share Location (WhatsApp)</Button>
                            </a>
                            <a href={`tel:${caretakerPhoneNumber}`}>
                               <Button variant="secondary" className="w-full h-full text-lg py-4"><Phone className="mr-2"/>Call Caregiver</Button>
                            </a>
                        </CardContent>
                    </Card>

                    <MedicalSummary history={activePatientRecord.history} />
                </div>
            )}
        </div>
    );
}

