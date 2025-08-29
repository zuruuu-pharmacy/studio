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

function PatientCard({ record, onSelect, onEdit, isActive }: { record: PatientRecord, onSelect: () => void, onEdit: () => void, isActive: boolean }) {
    const { history } = record;
    return (
        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${isActive ? 'border-primary ring-2 ring-primary' : ''}`} onClick={onSelect}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{history.name || "Unnamed Patient"}</CardTitle>
                        <CardDescription>
                            {history.age || 'N/A'} | {history.gender || 'N/A'}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                        <Edit className="h-4 w-4" />
                    </Button>
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
    clearActiveUser();
    router.push('/patient-history');
  }

  const handleSelectRecord = (recordId: string) => {
    // Find the user associated with this patient record to make them active.
    // This allows other tools to use this patient's context.
    // If no user is associated, we can still proceed to edit.
    const user = patientState.users.find(u => u.patientHistoryId === recordId);
    if(user){
        setActiveUser(user.id);
    } else {
        // If no user is directly linked, we create a temporary active user context
        // to hold the history ID, allowing editing.
        // This is a bit of a workaround.
        clearActiveUser();
        // A better approach would be to ensure a user is always linked
        // For now, let's just go to edit.
        handleEditRecord(recordId);
    }
  }
  
  const handleEditRecord = (recordId: string) => {
    const user = patientState.users.find(u => u.patientHistoryId === recordId);
    if(user){
        setActiveUser(user.id);
    } else {
        // Create a temporary user to hold the patientHistoryId
        // This is a new concept to handle unlinked records
        const tempUser = { 
            id: `temp_${recordId}`, 
            role: 'pharmacist', // Assume pharmacist is editing
            patientHistoryId: recordId 
        };
        setActiveUser(tempUser.id);
        // This temp user won't be saved, it's just for the session
        // Note: this part of the logic might need refinement based on desired UX
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
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Record
                </Button>
            </CardContent>
       </Card>

      {patientState.patientRecords.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Patient Record List</CardTitle>
            <CardDescription>Select a record to make it the active case for the AI tools.</CardDescription>
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
                <CardDescription>Get started by adding your first patient record.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Patient Record
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
