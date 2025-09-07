
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
import { Loader2, AlertTriangle, ShieldCheck, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMode } from "@/contexts/mode-context";
import { usePatient } from "@/contexts/patient-context";
import Link from "next/link";

const formSchema = z.object({
  medicationName: z.string().min(2, "Required"),
  patientAllergies: z.string().min(2, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

export function AllergyClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<AllergyCheckerOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input. Check the form fields." };
      }
      try {
        const result = await allergyChecker({
          ...parsed.data,
          detailedHistory: activePatientRecord?.history,
        });
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to check allergies. Please try again." };
      }
    },
    null
  );

  const { mode } = useMode();
  const { getActivePatientRecord } = usePatient();
  const activePatientRecord = getActivePatientRecord();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicationName: "",
      patientAllergies: activePatientRecord?.history.allergyHistory || "",
    },
  });
  
  useEffect(() => {
    form.reset({
      medicationName: "",
      patientAllergies: activePatientRecord?.history.allergyHistory || "",
    });
  }, [activePatientRecord, form]);

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    startTransition(() => {
      formAction(formData);
    });
  });

  if (!activePatientRecord) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Active Patient Case</CardTitle>
          <CardDescription>
            Please select a patient from the list or create a new one to use the allergy checker.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/patients" passHref>
            <Button><User className="mr-2"/>Go to Patient Records</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Patient & Medication Details</CardTitle>
              <CardDescription>
                Checking for {activePatientRecord.history.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <FormField name="medicationName" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Medication to Check</FormLabel><FormControl><Input placeholder="e.g., Penicillin" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="patientAllergies" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient's Known Allergies</FormLabel>
                      <FormControl><Textarea placeholder="e.g., Sulfa drugs, Aspirin" {...field} /></FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground pt-1">This is pre-filled from the Allergy & ADR History section.</p>
                    </FormItem>
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
    </>
  );
}
