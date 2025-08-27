"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { allergyChecker, type AllergyCheckerOutput } from "@/ai/flows/allergy-checker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, ShieldCheck, HeartPulse, ClipboardPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMode } from "@/contexts/mode-context";

const formSchema = z.object({
  medicationName: z.string().min(2, "Required"),
  patientAllergies: z.string().min(2, "Required"),
});

const historySchema = z.object({
  pastMedicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  socialHistory: z.string().optional(),
  medicationHistory: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type HistoryFormValues = z.infer<typeof historySchema>;

export function AllergyClient() {
  const [state, setState] = useState<AllergyCheckerOutput | { error: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  
  const { mode } = useMode();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { medicationName: "", patientAllergies: "" },
  });

  const historyForm = useForm<HistoryFormValues>({
    resolver: zodResolver(historySchema),
    defaultValues: {
      pastMedicalHistory: "",
      familyHistory: "",
      socialHistory: "",
      medicationHistory: "",
    },
  });

  const handleInitialSubmit = form.handleSubmit(() => {
    setShowHistoryDialog(true);
  });

  const runAllergyCheck = (isEmergency: boolean, historyData?: HistoryFormValues) => {
    const mainData = form.getValues();
    startTransition(async () => {
      try {
        const result = await allergyChecker({
          ...mainData,
          isEmergency,
          detailedHistory: isEmergency ? undefined : historyData,
        });
        setState(result);
      } catch (e) {
        console.error(e);
        setState({ error: "Failed to check allergies. Please try again." });
      }
    });
    setShowHistoryDialog(false);
    setShowHistoryForm(false);
  };
  
  const handleEmergency = () => {
    runAllergyCheck(true);
  };

  const handleNormal = () => {
    setShowHistoryDialog(false);
    setShowHistoryForm(true);
  };

  const handleHistorySubmit = historyForm.handleSubmit((data) => {
    runAllergyCheck(false, data);
  });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Patient & Medication Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={handleInitialSubmit} className="space-y-4">
                  <FormField name="medicationName" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Medication to Check</FormLabel><FormControl><Input placeholder="e.g., Penicillin" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="patientAllergies" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Patient's Known Allergies</FormLabel><FormControl><Textarea placeholder="e.g., Sulfa drugs, Aspirin" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Check for Allergies
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
          {state && 'allergyRiskDetected' in state && (
            <Card>
              <CardHeader><CardTitle>Allergy Check Results</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {state.allergyRiskDetected ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Allergy Risk Detected!</AlertTitle>
                    <AlertDescription>{state.riskDetails}</AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <AlertTitle>No Allergy Risk Detected</AlertTitle>
                    <AlertDescription>{state.riskDetails}</AlertDescription>
                  </Alert>
                )}
                <Card className="bg-background/50"><CardHeader><CardTitle className="text-lg">Alternative Options</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{state.alternativeMedicationOptions}</p></CardContent></Card>
                {mode === 'pharmacist' && (
                  <Card className="bg-background/50"><CardHeader><CardTitle className="text-lg">Pharmacist Guidance</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{state.guidance}</p></CardContent></Card>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Select Check Type</DialogTitle><DialogDescription>Is this an emergency check, or do you have time for a full patient history workup?</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button variant="destructive" size="lg" onClick={handleEmergency}><HeartPulse className="mr-2" />Emergency</Button>
            <Button variant="secondary" size="lg" onClick={handleNormal}><ClipboardPlus className="mr-2" />Normal Check</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showHistoryForm} onOpenChange={setShowHistoryForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Detailed Patient History</DialogTitle><DialogDescription>Please fill out the patient's history for a more comprehensive allergy check.</DialogDescription></DialogHeader>
          <Form {...historyForm}>
            <form onSubmit={handleHistorySubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
               <FormField name="pastMedicalHistory" control={historyForm.control} render={({ field }) => (<FormItem><FormLabel>Past Medical History</FormLabel><FormControl><Textarea placeholder="Chronic illnesses, surgeries, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
               <FormField name="familyHistory" control={historyForm.control} render={({ field }) => (<FormItem><FormLabel>Family History</FormLabel><FormControl><Textarea placeholder="Relevant genetic conditions, allergies in family, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
               <FormField name="socialHistory" control={historyForm.control} render={({ field }) => (<FormItem><FormLabel>Social History</FormLabel><FormControl><Textarea placeholder="e.g., Smoking status, alcohol use, occupation" {...field} /></FormControl><FormMessage /></FormItem>)} />
               <FormField name="medicationHistory" control={historyForm.control} render={({ field }) => (<FormItem><FormLabel>Current Medication History</FormLabel><FormControl><Textarea placeholder="List all current medications, including OTC and supplements." {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Run Full Allergy Check
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
