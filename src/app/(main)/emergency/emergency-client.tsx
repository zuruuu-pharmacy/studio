
"use client";

import { useState, useEffect, useCallback }from "react";
import { usePatient, type PatientRecord, type PatientHistory } from "@/contexts/patient-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Siren, HeartPulse, ShieldAlert, Phone, Map, MessageSquare, Loader2, LocateFixed, CheckCircle, User, AlertTriangle, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


type Mode = 'idle' | 'confirming' | 'activating' | 'ready' | 'error';

type LocationState = {
    status: 'idle' | 'fetching' | 'success' | 'error';
    lat?: number;
    lng?: number;
    accuracy?: number;
    error?: string;
};

type EmergencyPacket = {
    packet_id: string;
    timestamp_local: string;
    patient_name: string;
    patient_age_or_DOB?: string;
    location_latitude?: number;
    location_longitude?: number;
    location_address?: string;
    location_accuracy_meters?: number;
    allergies_summary: string;
    key_medications: string;
    critical_conditions: string;
    primary_contact_name?: string;
    primary_contact_phone?: string;
};


function MedicalSummary({ packet }: { packet: EmergencyPacket | null }) {
    if (!packet) return null;

    const info = [
        { label: 'Allergies', value: packet.allergies_summary, important: packet.allergies_summary !== 'Not Provided' && packet.allergies_summary !== 'None known' },
        { label: 'Critical Conditions', value: packet.critical_conditions, important: true },
        { label: 'Key Medications', value: packet.key_medications, important: false },
    ];
    return (
        <Card className="bg-background/50">
            <CardHeader><CardTitle className="text-lg">Critical Medical Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {info.map(item => item.value && (
                    <div key={item.label}>
                        <h4 className="font-semibold">{item.label}</h4>
                        <p className={`text-muted-foreground ${item.important ? 'font-bold text-destructive' : ''}`}>{item.value}</p>
                    </div>
                ))}
                 {!info.some(i => i.value && i.value !== 'Not Provided') && <p className="text-muted-foreground">No critical information available.</p>}
            </CardContent>
        </Card>
    );
}

export function EmergencyClient() {
    const [mode, setMode] = useState<Mode>('idle');
    const [locationState, setLocationState] = useState<LocationState>({ status: 'idle' });
    const [emergencyPacket, setEmergencyPacket] = useState<EmergencyPacket | null>(null);
    const [consentGiven, setConsentGiven] = useState(false);
    const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);
    const [tempCaregiverNumber, setTempCaregiverNumber] = useState('');

    const { getActivePatientRecord } = usePatient();
    const activePatientRecord = getActivePatientRecord();
    const caregiverNumber = activePatientRecord?.history.caretakerPhoneNumber;

    const startEmergencySequence = useCallback(() => {
        setMode('activating');
        const packet: EmergencyPacket = {
            packet_id: `emg_${Date.now()}`,
            timestamp_local: new Date().toLocaleString(),
            patient_name: activePatientRecord?.history.name || 'Unknown Patient',
            patient_age_or_DOB: activePatientRecord?.history.age || 'N/A',
            allergies_summary: activePatientRecord?.history.allergyHistory || 'Not Provided',
            key_medications: activePatientRecord?.history.medicationHistory || 'Not Provided',
            critical_conditions: activePatientRecord?.history.pastMedicalHistory || 'Not Provided',
            primary_contact_name: "Caretaker", // Placeholder
            primary_contact_phone: caregiverNumber,
        };

        setLocationState({ status: 'fetching' });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setLocationState({ status: 'success', lat: latitude, lng: longitude, accuracy });
                setEmergencyPacket({
                    ...packet,
                    location_latitude: latitude,
                    location_longitude: longitude,
                    location_accuracy_meters: accuracy,
                    location_address: `Approx. location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` // Placeholder for reverse geocoding
                });
                setMode('ready');
            },
            (err) => {
                setLocationState({ status: 'error', error: `Location Error: ${err.message}` });
                setEmergencyPacket({ ...packet, location_address: 'Unavailable' });
                setMode('ready'); 
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
        );
    }, [activePatientRecord, caregiverNumber]);

    const handleCancel = () => {
        setMode('idle');
        setConsentGiven(false);
    };

    const whatsAppMessage = `🚨 EMERGENCY: ${emergencyPacket?.patient_name} needs help.\n\nLocation: https://www.google.com/maps/search/?api=1&query=${emergencyPacket?.location_latitude},${emergencyPacket?.location_longitude}\n\nAllergies: ${emergencyPacket?.allergies_summary}\nKey Meds: ${emergencyPacket?.key_medications}\n\nTime: ${emergencyPacket?.timestamp_local}`;
    
    const handleAlertCaregiver = (number?: string) => {
        const targetNumber = number || caregiverNumber;
        if (!targetNumber) {
            setIsCaregiverModalOpen(true);
            return;
        }
        window.open(`https://wa.me/${targetNumber}?text=${encodeURIComponent(whatsAppMessage)}`, '_blank');
        setIsCaregiverModalOpen(false);
        setTempCaregiverNumber('');
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
    
     if (mode === 'ready' && emergencyPacket) {
        let accuracyBadgeColor = "bg-red-500";
        let accuracyText = "Low accuracy";
        if (locationState.accuracy) {
            if (locationState.accuracy <= 30) {
                accuracyBadgeColor = "bg-green-500";
                accuracyText = "Precise location"
            }
            else if (locationState.accuracy <= 100) {
                 accuracyBadgeColor = "bg-amber-500";
                 accuracyText = "Approximate"
            };
        }
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
                        <MedicalSummary packet={emergencyPacket}/>
                        <Card className="bg-background/50">
                           <CardHeader><CardTitle className="text-lg flex items-center gap-2"><LocateFixed/> Your Location</CardTitle></CardHeader>
                           <CardContent>
                                {locationState.status === 'success' ? (
                                    <>
                                        <p>{emergencyPacket.location_address}</p>
                                        {locationState.accuracy && (
                                            <Badge className={`mt-2 ${accuracyBadgeColor}`}>
                                                {accuracyText}: +/- {locationState.accuracy.toFixed(0)} meters
                                            </Badge>
                                        )}
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
                        <Button variant="secondary" className="w-full h-20 text-xl bg-green-500 hover:bg-green-600 text-white" onClick={() => handleAlertCaregiver()}>
                            <MessageSquare className="mr-4"/>Alert Caregiver
                        </Button>
                        <a href={`https://www.google.com/maps/search/?api=1&query=hospital+near+me`} target="_blank" rel="noopener noreferrer">
                             <Button variant="outline" className="w-full h-16"><Map className="mr-2"/>Find Nearby Hospitals</Button>
                        </a>
                         <a href={`https://www.google.com/maps/search/?api=1&query=pharmacy+near+me`} target="_blank" rel="noopener noreferrer">
                             <Button variant="outline" className="w-full h-16"><Map className="mr-2"/>Find Nearby Pharmacies</Button>
                        </a>
                    </CardContent>
                </Card>
                 <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important Disclaimer</AlertTitle>
                    <AlertDescription>
                       This is not a medical diagnosis. This is an alert based on symptoms matching a critical condition. Please seek immediate medical attention.
                    </AlertDescription>
                </Alert>
                <Button onClick={handleCancel} variant="outline">Deactivate Emergency Mode</Button>
                
                 <Dialog open={isCaregiverModalOpen} onOpenChange={setIsCaregiverModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enter Caregiver Number</DialogTitle>
                            <DialogDescription>
                                No caregiver number is saved. Please enter a phone number to send the emergency alert.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="caregiver-phone">Caregiver's Phone Number</Label>
                            <Input
                                id="caregiver-phone"
                                value={tempCaregiverNumber}
                                onChange={(e) => setTempCaregiverNumber(e.target.value)}
                                placeholder="+923001234567"
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button onClick={() => handleAlertCaregiver(tempCaregiverNumber)}>Send Alert</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                                This will attempt to access your location and share your medical summary with caregivers and emergency services. Are you sure you want to proceed?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex items-center space-x-2 my-4">
                            <Checkbox id="terms" checked={consentGiven} onCheckedChange={(checked) => setConsentGiven(checked as boolean)} />
                            <Label htmlFor="terms" className="text-sm text-muted-foreground">
                                I consent to share my location and emergency medical summary with caregivers and emergency services for this emergency.
                            </Label>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setConsentGiven(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={startEmergencySequence} disabled={!consentGiven}>Yes, Activate</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
