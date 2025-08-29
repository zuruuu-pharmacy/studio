
"use client";

import { useState, useMemo } from "react";
import { usePatient, type PatientRecord } from "@/contexts/patient-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, User, Search, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useMode } from "@/contexts/mode-context";

function PatientCard({ record, onSelect, onEdit, isActive, mode }: { record: PatientRecord, onSelect: () => void, onEdit: () => void, isActive: boolean, mode: string }) {
    const { history } = record;
    return (
        <Card className={`hover:shadow-md transition-shadow ${isActive && mode !== 'student' ? 'border-primary ring-2 ring-primary' : ''} ${mode === 'student' ? 'cursor-default' : 'cursor-pointer'}`} onClick={onSelect}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{history.name || "Unnamed Patient"}</CardTitle>
                        <CardDescription>
                            {history.age || 'N/A'} | {history.gender || 'N/A'}
                        </CardDescription>
                    </div>
                    {mode === 'pharmacist' && (
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                 {isActive && <Badge className="w-fit">Active Patient Case</Badge>}
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Phone:</span> {history.phoneNumber || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                     <span className="font-semibold">CNIC:</span> {history.cnicOrPassport || "N/A"}
                </p>
            </CardContent>
        </Card>
    )
}

export function PatientsClient() {
  const { patientState, setActiveUser, clearActiveUser } = usePatient();
  const { mode } = useMode();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredRecords = useMemo(() => {
    if (!searchTerm) return patientState.patientRecords;
    const lowercasedFilter = searchTerm.toLowerCase();
    return patientState.patientRecords.filter((record) => {
      const { history } = record;
      const name = history.name?.toLowerCase() || "";
      const phone = history.phoneNumber || "";
      const cnic = history.cnicOrPassport || "";
      return (
        name.includes(lowercasedFilter) ||
        phone.includes(lowercasedFilter) ||
        cnic.includes(lowercasedFilter)
      );
    });
  }, [searchTerm, patientState.patientRecords]);

  const handleAddNew = () => {
    if (mode !== 'pharmacist') return;
    clearActiveUser();
    router.push('/patient-history');
  }

  const handleSelectRecord = (recordId: string) => {
    if (mode === 'student') return; // Students cannot select patients
    const user = patientState.users.find(u => u.patientHistoryId === recordId);
    if(user){
        setActiveUser(user.id);
    } else {
        clearActiveUser();
        handleEditRecord(recordId);
    }
  }
  
  const handleEditRecord = (recordId: string) => {
    if (mode !== 'pharmacist') return;
    const user = patientState.users.find(u => u.patientHistoryId === recordId);
    if(user){
        setActiveUser(user.id);
    } else {
        const tempUser = { 
            id: `temp_${recordId}`, 
            role: 'pharmacist', 
            patientHistoryId: recordId 
        };
        setActiveUser(tempUser.id);
    }
    router.push('/patient-history');
  }

  return (
    <div className="space-y-6">
       <Card>
            <CardHeader>
                <CardTitle>Search & Add Patient Records</CardTitle>
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
                {mode === 'pharmacist' && (
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Record
                    </Button>
                )}
            </CardContent>
       </Card>

      {patientState.patientRecords.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Patient Record List</CardTitle>
            <CardDescription>
                {mode === 'pharmacist' ? "Select a record to make it the active case for the AI tools." : "Viewing all patient cases for educational purposes."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRecords.map((record) => (
                  <PatientCard 
                    key={record.id} 
                    record={record}
                    onSelect={() => handleSelectRecord(record.id)}
                    onEdit={() => handleEditRecord(record.id)}
                    isActive={patientState.activeUser?.patientHistoryId === record.id}
                    mode={mode}
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
                <CardTitle>No Patient Records Found</CardTitle>
                <CardDescription>
                    {mode === 'pharmacist' ? "Get started by adding your first patient record." : "There are no patient records to display."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {mode === 'pharmacist' && (
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Patient Record
                    </Button>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
