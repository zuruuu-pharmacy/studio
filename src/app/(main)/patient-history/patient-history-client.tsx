"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import { usePatient } from "@/contexts/patient-context";
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

  const historyForm = useForm<HistoryFormValues>({
    resolver: zodResolver(historySchema),
    defaultValues: patient.history || {
      pastMedicalHistory: "",
      familyHistory: "",
      socialHistory: "",
      medicationHistory: "",
    },
  });

  const handleHistorySubmit = historyForm.handleSubmit((data) => {
    setPatient({ history: data });
    toast({
      title: "Patient History Saved",
      description: "The patient's history has been updated and will be used by the AI tools.",
      duration: 3000,
    });
  });

  const handleReset = () => {
     setPatient({ history: null });
     historyForm.reset();
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
                <Button type="submit">
                  Save Patient History
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
