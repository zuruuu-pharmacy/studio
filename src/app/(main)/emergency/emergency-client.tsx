
"use client";

import { useState, useEffect, useCallback }from "react";
import { usePatient, type PatientRecord } from "@/contexts/patient-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Siren, HeartPulse, ShieldAlert, Phone, Map, MessageSquare, Loader2, LocateFixed, CheckCircle, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";


type Mode = 'idle' | 'confirming' | 'activating' | 'ready' | 'error';
type LocationState = {
    status: 'idle' | 'fetching' | 'success' | 'error';
    lat?: number;
    lng?: number;
    accuracy?: number;
    error?: string;
};
type EmergencyPacket = {
    name?: string;
    age?: string;
    bloodGroup?: string;
    allergies?: string;
    medications?: string;
    conditions?: string;
    location?: string;
    mapsLink?: string;
    timestamp?: string;
};

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
                {!criticalInfo.some(i => i.value) && <p className="text-muted-foreground">No critical information available.</p>}
            </CardContent>
        </Card>
    );
}

export function EmergencyClient() {
    const [mode, setMode] = useState<Mode>('idle');
    const [locationState, setLocationState] = useState<LocationState>({ status: 'idle' });
    const [emergencyPacket, setEmergencyPacket] = useState<EmergencyPacket>({});
    const [caregiverNumber, setCaregiverNumber] = useState('');

    const { getActivePatientRecord } = usePatient();
    const activePatientRecord = getActivePatientRecord();

    const startEmergencySequence = useCallback(() => {
        setMode('activating');
        const packet: EmergencyPacket = {
            name: activePatientRecord?.history.name || 'Unknown',
            age: activePatientRecord?.history.age,
            allergies: activePatientRecord?.history.allergyHistory || 'Not Provided',
            medications: activePatientRecord?.history.medicationHistory || 'Not Provided',
            conditions: activePatientRecord?.history.pastMedicalHistory || 'Not Provided',
            timestamp: new Date().toLocaleString(),
        };

        if (!activePatientRecord?.history.caretakerPhoneNumber) {
            toast({ title: "Missing Caregiver Number", description: "Please add a caregiver number to enable alerts." });
        } else {
            setCaregiverNumber(activePatientRecord.history.caretakerPhoneNumber);
        }

        setLocationState({ status: 'fetching' });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                packet.location = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
                packet.mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                setLocationState({ status: 'success', lat: latitude, lng: longitude, accuracy: accuracy });
                setEmergencyPacket(packet);
                setMode('ready');
            },
            (err) => {
                setLocationState({ status: 'error', error: `Location Error: ${err.message}` });
                packet.location = "Unavailable";
                setEmergencyPacket(packet);
                setMode('ready'); 
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
    }, [activePatientRecord]);

    const handleCancel = () => {
        setMode('idle');
    };

    const whatsAppMessage = `🚨 EMERGENCY ALERT 🚨\nPatient: ${emergencyPacket.name}\nLocation: ${emergencyPacket.mapsLink || emergencyPacket.location}\nAllergies: ${emergencyPacket.allergies}\nMedications: ${emergencyPacket.medications}\nTime: ${emergencyPacket.timestamp}`;
    
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

    if(mode === 'activating') {
        return (
            <Card className="text-center py-12 bg-destructive/10 border-destructive/50">
                <CardHeader>
                    <Loader2 className="mx-auto h-16 w-16 text-destructive animate-spin mb-4" />
                    <CardTitle className="text-3xl text-destructive">Activating Emergency Mode</CardTitle>
                    <CardDescription className="flex items-center justify-center gap-2">
                       Getting location... Please allow location access.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleCancel} variant="secondary" size="lg">Cancel</Button>
                </CardContent>
            </Card>
        )
    }
    
     if (mode === 'ready') {
        return (
            <div className="space-y-6">
                <Alert variant="destructive">
                    <Siren className="h-4 w-4"/>
                    <AlertTitle>Emergency Mode Active</AlertTitle>
                    <AlertDescription>Your information is ready to be shared. Take action below.</AlertDescription>
                </Alert>

                <Card>
                    <CardHeader><CardTitle>Your Information Packet</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <MedicalSummary history={activePatientRecord.history}/>
                        <Card className="bg-background/50">
                           <CardHeader><CardTitle className="text-lg flex items-center gap-2"><LocateFixed/> Your Location</CardTitle></CardHeader>
                           <CardContent>
                                {locationState.status === 'success' ? (
                                    <>
                                        <p>{emergencyPacket.location}</p>
                                        {locationState.accuracy && <p className="text-xs text-muted-foreground">Accuracy: +/- {locationState.accuracy.toFixed(0)} meters</p>}
                                    </>
                                ) : (
                                    <p className="text-destructive">{locationState.error || 'Could not get location.'}</p>
                                )}
                           </CardContent>
                        </Card>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="tel:1122">
                            <Button variant="destructive" className="w-full h-20 text-xl"><Phone className="mr-4"/>Call 1122</Button>
                        </a>
                        {caregiverNumber && (
                           <a href={`https://wa.me/${caregiverNumber}?text=${encodeURIComponent(whatsAppMessage)}`} target="_blank" rel="noopener noreferrer">
                             <Button variant="secondary" className="w-full h-20 text-xl bg-green-500 hover:bg-green-600 text-white"><MessageSquare className="mr-4"/>Alert Caregiver</Button>
                           </a>
                        )}
                        <a href={`https://www.google.com/maps/search/?api=1&query=hospital+near+me`} target="_blank" rel="noopener noreferrer">
                             <Button variant="outline" className="w-full h-16"><Map className="mr-2"/>Find Nearby Hospitals</Button>
                        </a>
                         <a href={`https://www.google.com/maps/search/?api=1&query=pharmacy+near+me`} target="_blank" rel="noopener noreferrer">
                             <Button variant="outline" className="w-full h-16"><Map className="mr-2"/>Find Nearby Pharmacies</Button>
                        </a>
                    </CardContent>
                </Card>
                <Button onClick={handleCancel} variant="outline">Deactivate Emergency Mode</Button>
            </div>
        )
     }

    return (
        <Card className="text-center py-12">
            <CardHeader>
                <Siren className="mx-auto h-16 w-16 text-muted-foreground mb-4"/>
                <CardTitle className="text-3xl">Activate Emergency Mode</CardTitle>
                <CardDescription>This will start the process of gathering and sharing your critical information.</CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="lg" variant="destructive" className="text-xl h-16 px-12">
                            <ShieldAlert className="mr-4"/> Activate
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Emergency Activation</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will share your location and medical summary with caregivers and help services. Are you sure you want to proceed?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={startEmergencySequence}>Yes, Activate</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
