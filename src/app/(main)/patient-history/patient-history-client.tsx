"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { HeartPulse, ClipboardPlus, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { usePatient, type PatientHistory } from "@/contexts/patient-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const historySchema = z.object({
  pastMedicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  socialHistory: z.string().optional(),
  medicationHistory: z.string().optional(),
});

type HistoryFormValues = z.infer<typeof historySchema>;

export function PatientHistoryClient() {
  const { patient, setPatient } = usePatient();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(!patient.history && !patient.isEmergency);

  const historyForm = useForm<HistoryFormValues>({
    resolver: zodResolver(historySchema),
    defaultValues: patient.history || {
      pastMedicalHistory: "",
      familyHistory: "",
      socialHistory: "",
      medicationHistory: "",
    },
  });

  const handleEmergency = () => {
    setPatient({ history: null, isEmergency: true });
    historyForm.reset();
    setShowDialog(false);
    toast({
      title: "Emergency Mode Activated",
      description: "Patient history will be bypassed for all tools.",
      duration: 3000,
    });
  };

  const handleNormal = () => {
    setShowDialog(false);
  };
  
  const handleHistorySubmit = historyForm.handleSubmit((data) => {
    setPatient({ history: data, isEmergency: false });
    toast({
      title: "Patient History Saved",
      description: "The patient's history has been updated and will be used by the AI tools.",
      duration: 3000,
    });
  });

  const handleReset = () => {
     setPatient({ history: null, isEmergency: false });
     historyForm.reset();
     setShowDialog(true);
  }

  if (patient.isEmergency) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Emergency Mode Active</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                <Alert variant="destructive" className="max-w-md">
                    <HeartPulse className="h-4 w-4"/>
                    <AlertTitle>Emergency Mode</AlertTitle>
                    <AlertDescription>
                        Patient history is currently being bypassed. All tools will operate with limited information.
                    </AlertDescription>
                </Alert>
                <Button onClick={handleReset}>Reset and Enter History</Button>
            </CardContent>
        </Card>
    )
  }

  if (patient.history) {
     return (
        <Card>
            <CardHeader>
                <CardTitle>Patient History on File</CardTitle>
                <CardDescription>This information is being used by the other AI tools.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                 <Alert variant="default" className="max-w-md bg-green-500/10 border-green-500 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 text-green-500"/>
                    <AlertTitle>History Saved</AlertTitle>
                    <AlertDescription>
                        You can now use the other tools with this patient's history.
                    </AlertDescription>
                </Alert>
                <Button onClick={handleReset}>Reset or Edit History</Button>
            </CardContent>
        </Card>
     )
  }


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Detailed Patient History</CardTitle>
          <CardDescription>Please fill out the patient's history. This will be used for a more comprehensive analysis by the AI tools.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...historyForm}>
            <form onSubmit={handleHistorySubmit} className="space-y-4">
              <FormField name="pastMedicalHistory" control={historyForm.control} render={({ field }) => (<FormItem><FormLabel>Past Medical History</FormLabel><FormControl><Textarea placeholder="Chronic illnesses, surgeries, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="familyHistory" control={historyForm.control} render={({ field }) => (<FormItem><FormLabel>Family History</FormLabel><FormControl><Textarea placeholder="Relevant genetic conditions, allergies in family, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="socialHistory" control={historyForm.control} render={({ field }) => (<FormItem><FormLabel>Social History</FormLabel><FormControl><Textarea placeholder="e.g., Smoking status, alcohol use, occupation" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="medicationHistory" control={historyForm.control} render={({ field }) => (<FormItem><FormLabel>Current Medication History</FormLabel><FormControl><Textarea placeholder="List all current medications, including OTC and supplements." {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="flex justify-end pt-4 gap-4">
                <Button type="button" variant="destructive" onClick={() => setShowDialog(true)}>Switch to Emergency</Button>
                <Button type="submit">
                  Save Patient History
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Select Check Type</DialogTitle><DialogDescription>Is this an emergency situation, or do you have time to enter the patient's history?</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button variant="destructive" size="lg" onClick={handleEmergency}><HeartPulse className="mr-2" />Emergency</Button>
            <Button variant="secondary" size="lg" onClick={handleNormal}><ClipboardPlus className="mr-2" />Enter History</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
