"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePatient, UserProfile } from "@/contexts/patient-context";
import { useMode } from "@/contexts/mode-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, BriefcaseMedical, UserPlus, LogIn, ShieldEllipsis, School } from "lucide-react";

const PHARMACIST_CODE = "239773";

export default function RoleSelectionPage() {
  const [pharmacistModalOpen, setPharmacistModalOpen] = useState(false);
  const [patientOptionsModalOpen, setPatientOptionsModalOpen] = useState(false);
  const [patientLoginModalOpen, setPatientLoginModalOpen] = useState(false);
  const [studentLoginModalOpen, setStudentLoginModalOpen] = useState(false);
  
  const [pharmacistCode, setPharmacistCode] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");

  const { setMode } = useMode();
  const { patientState, setActiveUser, addOrUpdateUser, clearActiveUser } = usePatient();
  const router = useRouter();
  const { toast } = useToast();

  const handlePharmacistLogin = () => {
    if (pharmacistCode === PHARMACIST_CODE) {
      setMode("pharmacist");
      clearActiveUser();
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
    const existingUser = patientState.users.find(
      (p) =>
        p.role === 'patient' &&
        p.demographics?.name?.toLowerCase() === patientName.toLowerCase() &&
        p.demographics?.phoneNumber === patientPhone
    );

    setMode("patient");

    if (existingUser) {
      setActiveUser(existingUser.id);
      toast({ title: "Welcome Back!", description: `Loading profile for ${existingUser.demographics?.name}.` });
      router.push("/dashboard");
    } else {
       clearActiveUser();
       const newUser: Omit<UserProfile, 'id'> = {
         role: 'patient',
         demographics: { name: patientName, phoneNumber: patientPhone }
       };
       addOrUpdateUser(newUser);
       toast({ title: "Welcome!", description: "Let's create your patient history." });
       router.push("/patient-history");
    }
    setPatientLoginModalOpen(false);
  };
  
  const handleNewPatient = () => {
    setMode('patient');
    clearActiveUser();
    router.push('/patient-history');
  }

  const handleStudentLogin = () => {
    if (!studentName || !studentId) {
        toast({ variant: "destructive", title: "Missing Information", description: "Please enter your name and Student ID." });
        return;
    }
    if (!studentId.toLowerCase().includes('edu')) {
        toast({ variant: "destructive", title: "Invalid Student ID" });
        return;
    }

    const existingUser = patientState.users.find(
      (u) =>
        u.role === 'student' &&
        u.demographics?.name?.toLowerCase() === studentName.toLowerCase() &&
        u.studentId === studentId
    );
    
    setMode("student");

    if (existingUser) {
        setActiveUser(existingUser.id);
        toast({ title: "Welcome Back!", description: `Loading profile for ${existingUser.demographics?.name}.` });
    } else {
        const newUser: Omit<UserProfile, 'id'> = {
            role: 'student',
            demographics: { name: studentName },
            studentId: studentId,
        };
        addOrUpdateUser(newUser);
        toast({ title: "Welcome!", description: `Your student profile has been created, ${studentName}. Let's create your health record.` });
    }
    router.push("/dashboard");
    setStudentLoginModalOpen(false);
  };

  const handleEmergency = () => {
    setMode('patient'); // Emergency defaults to patient view
    clearActiveUser();
    router.push('/emergency');
  }

  const openPatientLogin = () => {
    setPatientOptionsModalOpen(false);
    setPatientLoginModalOpen(true);
  }
  
  const openStudentLogin = () => {
    setStudentLoginModalOpen(true);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-5xl shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                
            </div>
          <CardTitle className="text-3xl font-headline">Welcome to Zuruu AI Pharmacy</CardTitle>
          <CardDescription>Please select your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-8 p-8">
          <div
            onClick={() => setPatientOptionsModalOpen(true)}
            className="p-8 border rounded-lg text-center hover:bg-muted/50 hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center"
          >
            <User className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-2xl font-semibold">I am a Patient</h3>
            <p className="text-muted-foreground mt-2">Access your profile or get emergency help.</p>
          </div>
          <div
            onClick={() => setPharmacistModalOpen(true)}
            className="p-8 border rounded-lg text-center hover:bg-muted/50 hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center"
          >
            <BriefcaseMedical className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-2xl font-semibold">I am a Pharmacist</h3>
            <p className="text-muted-foreground mt-2">Access the full suite of clinical tools.</p>
          </div>
           <div
            onClick={openStudentLogin}
            className="p-8 border rounded-lg text-center hover:bg-muted/50 hover:shadow-lg transition cursor-pointer flex flex-col items-center justify-center"
          >
            <School className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-2xl font-semibold">I am a Student</h3>
            <p className="text-muted-foreground mt-2">Login to access learning modules.</p>
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

       {/* Student Login Modal */}
       <Dialog open={studentLoginModalOpen} onOpenChange={setStudentLoginModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Login</DialogTitle>
            <DialogDescription>Please enter your details to continue.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="student-name">Full Name</Label>
                <Input id="student-name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input id="student-id" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g., user@university.edu"/>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStudentLogin}>Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
