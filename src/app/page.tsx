"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePatient } from "@/contexts/patient-context";
import { useMode } from "@/contexts/mode-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Stethoscope, BriefcaseMedical, UserPlus, LogIn, ShieldEllipsis } from "lucide-react";

const PHARMACIST_CODE = "239773";

export default function RoleSelectionPage() {
  const [pharmacistModalOpen, setPharmacistModalOpen] = useState(false);
  const [patientOptionsModalOpen, setPatientOptionsModalOpen] = useState(false);
  const [patientLoginModalOpen, setPatientLoginModalOpen] = useState(false);
  
  const [pharmacistCode, setPharmacistCode] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  const { setMode } = useMode();
  const { patientState, setActivePatient, addOrUpdatePatient, clearActivePatient } = usePatient();
  const router = useRouter();
  const { toast } = useToast();

  const handlePharmacistLogin = () => {
    if (pharmacistCode === PHARMACIST_CODE) {
      setMode("pharmacist");
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Incorrect Code",
        description: "This is not for you as you are not a pharmacist.",
      });
    }
  };

  const handlePatientLogin = () => {
    if (!patientName || !patientPhone) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please enter your name and phone number." });
        return;
    }
    const existingPatient = patientState.patients.find(
      (p) =>
        p.demographics?.name?.toLowerCase() === patientName.toLowerCase() &&
        p.demographics?.phoneNumber === patientPhone
    );

    setMode("patient");

    if (existingPatient) {
      setActivePatient(existingPatient.id);
      toast({ title: "Welcome Back!", description: `Loading profile for ${existingPatient.demographics?.name}.` });
      router.push("/dashboard");
    } else {
      // If patient not found, treat as new registration
       clearActivePatient();
       addOrUpdatePatient({ demographics: { name: patientName, phoneNumber: patientPhone } });
       toast({ title: "Welcome!", description: "Let's create your patient history." });
       router.push("/patient-history");
    }
    setPatientLoginModalOpen(false);
  };
  
  const handleNewPatient = () => {
    setMode('patient');
    clearActivePatient();
    router.push('/patient-history');
  }

  const handleEmergency = () => {
    setMode('patient');
    router.push('/emergency');
  }

  const openPatientLogin = () => {
    setPatientOptionsModalOpen(false);
    setPatientLoginModalOpen(true);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                
            </div>
          <CardTitle className="text-3xl font-headline">Welcome to Zuruu AI Pharmacy</CardTitle>
          <CardDescription>Please select your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 p-8">
          <div
            onClick={() => setPatientOptionsModalOpen(true)}
            className="p-8 border rounded-lg text-center hover:bg-muted/50 hover:shadow-lg transition cursor-pointer"
          >
            <User className="mx-auto h-16 w-16 text-primary mb-4" />
            <h3 className="text-2xl font-semibold">I am a Patient</h3>
            <p className="text-muted-foreground mt-2">Access your profile or get emergency help.</p>
          </div>
          <div
            onClick={() => setPharmacistModalOpen(true)}
            className="p-8 border rounded-lg text-center hover:bg-muted/50 hover:shadow-lg transition cursor-pointer"
          >
            <BriefcaseMedical className="mx-auto h-16 w-16 text-primary mb-4" />
            <h3 className="text-2xl font-semibold">I am a Pharmacist</h3>
            <p className="text-muted-foreground mt-2">Access the full suite of clinical tools.</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Pharmacist Modal */}
      <Dialog open={pharmacistModalOpen} onOpenChange={setPharmacistModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pharmacist Access</DialogTitle>
            <DialogDescription>Please enter your access code to continue.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="pharmacist-code">Access Code</Label>
            <Input 
              id="pharmacist-code" 
              type="password" 
              value={pharmacistCode}
              onChange={(e) => setPharmacistCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePharmacistLogin()}
            />
          </div>
          <DialogFooter>
            <Button onClick={handlePharmacistLogin}>Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Patient Options Modal */}
      <Dialog open={patientOptionsModalOpen} onOpenChange={setPatientOptionsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Options</DialogTitle>
            <DialogDescription>How can we help you today?</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
             <Button onClick={openPatientLogin} variant="outline" size="lg" className="h-auto py-4">
              <LogIn className="mr-4"/>
              <div>
                <p className="font-semibold text-base text-left">Patient Login</p>
                <p className="font-normal text-sm text-muted-foreground text-left">Access your existing patient profile.</p>
              </div>
            </Button>
             <Button onClick={handleNewPatient} variant="outline" size="lg" className="h-auto py-4">
              <UserPlus className="mr-4"/>
              <div>
                <p className="font-semibold text-base text-left">New Patient Registration</p>
                <p className="font-normal text-sm text-muted-foreground text-left">Create a new patient history form.</p>
              </div>
            </Button>
             <Button onClick={handleEmergency} variant="destructive" size="lg" className="h-auto py-4">
              <ShieldEllipsis className="mr-4"/>
               <div>
                <p className="font-semibold text-base text-left">Emergency</p>
                <p className="font-normal text-sm text-destructive-foreground/80 text-left">Get immediate help and information.</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Patient Login Modal */}
      <Dialog open={patientLoginModalOpen} onOpenChange={setPatientLoginModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Login</DialogTitle>
            <DialogDescription>Please enter your details to find your profile.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="patient-name">Full Name</Label>
                <Input id="patient-name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="patient-phone">Phone Number</Label>
                <Input id="patient-phone" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePatientLogin}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
