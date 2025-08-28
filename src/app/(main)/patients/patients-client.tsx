"use client";

import { useState, useMemo } from "react";
import { usePatient, PatientHistory } from "@/contexts/patient-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, User, Search, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

function PatientCard({ patient, onSelect, onEdit, isActive }: { patient: PatientHistory, onSelect: () => void, onEdit: () => void, isActive: boolean }) {
    return (
        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${isActive ? 'border-primary ring-2 ring-primary' : ''}`} onClick={onSelect}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{patient.demographics?.name || "Unnamed Patient"}</CardTitle>
                        <CardDescription>
                            {patient.demographics?.age || 'N/A'} | {patient.demographics?.gender || 'N/A'}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
                 {isActive && <Badge className="w-fit">Active</Badge>}
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Phone:</span> {patient.demographics?.phoneNumber || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                     <span className="font-semibold">CNIC:</span> {patient.demographics?.cnicOrPassport || "N/A"}
                </p>
            </CardContent>
        </Card>
    )
}

export function PatientsClient() {
  const { patientState, setActivePatient, clearActivePatient } = usePatient();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patientState.patients;
    const lowercasedFilter = searchTerm.toLowerCase();
    return patientState.patients.filter((patient) => {
      const name = patient.demographics?.name?.toLowerCase() || "";
      const phone = patient.demographics?.phoneNumber || "";
      const cnic = patient.demographics?.cnicOrPassport || "";
      return (
        name.includes(lowercasedFilter) ||
        phone.includes(lowercasedFilter) ||
        cnic.includes(lowercasedFilter)
      );
    });
  }, [searchTerm, patientState.patients]);

  const handleAddNew = () => {
    clearActivePatient();
    router.push('/patient-history');
  }

  const handleSelectPatient = (patientId: string) => {
    setActivePatient(patientId);
  }
  
  const handleEditPatient = (patientId: string) => {
    setActivePatient(patientId);
    router.push('/patient-history');
  }

  return (
    <div className="space-y-6">
       <Card>
            <CardHeader>
                <CardTitle>Search & Add Patients</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, phone, or CNIC..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Patient
                </Button>
            </CardContent>
       </Card>

      {patientState.patients.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>Select a patient to make them active.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPatients.map((p) => (
                  <PatientCard 
                    key={p.id} 
                    patient={p} 
                    onSelect={() => handleSelectPatient(p.id)}
                    onEdit={() => handleEditPatient(p.id)}
                    isActive={patientState.activePatient?.id === p.id}
                   />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
            <CardHeader>
                 <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle>No Patients Found</CardTitle>
                <CardDescription>Get started by adding your first patient record.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Patient
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
