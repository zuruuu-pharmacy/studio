
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { generateAdherenceReport, type AdherenceReportOutput } from "@/ai/flows/adherence-reporter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, XCircle, FileClock, PieChart, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePatient } from "@/contexts/patient-context";

const formSchema = z.object({
  medications: z.array(z.object({
    medicineName: z.string().min(2, "Required"),
    dosageStrength: z.string().min(2, "Required"),
    frequency: z.string().optional(),
    dosesPrescribed: z.coerce.number().int().min(0, "Must be >= 0"),
    dosesTaken: z.coerce.number().int().min(0, "Cannot be negative"),
  })).min(1, "At least one medication is required"),
});

type FormValues = z.infer<typeof formSchema>;

const defaultMedication = { medicineName: "", dosageStrength: "", frequency: "", dosesPrescribed: 0, dosesTaken: 0 };


export function AdherenceTrackerClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<AdherenceReportOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const medications = [];
      let i = 0;
      while (formData.has(`medications[${i}].medicineName`)) {
        medications.push({
          medicineName: formData.get(`medications[${i}].medicineName`) as string,
          dosageStrength: formData.get(`medications[${i}].dosageStrength`) as string,
          frequency: formData.get(`medications[${i}].frequency`) as string,
          dosesPrescribed: formData.get(`medications[${i}].dosesPrescribed`) as string,
          dosesTaken: formData.get(`medications[${i}].dosesTaken`) as string,
        });
        i++;
      }

      const parsed = formSchema.safeParse({ medications });

      if (!parsed.success) {
        return { error: "Invalid input. Check the form fields." };
      }
      try {
        const result = await generateAdherenceReport({ medications: parsed.data.medications });
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to generate report. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const { patientState, clearLastPrescription } = usePatient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medications: [defaultMedication],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "medications",
  });
  
  useEffect(() => {
    if (patientState.lastPrescription) {
      const newMedications = patientState.lastPrescription.medications.map(med => ({
        medicineName: med.name,
        dosageStrength: med.dosage,
        frequency: med.frequency,
        dosesPrescribed: 0, // Default to 0, user must input this
        dosesTaken: 0,      // Default to 0, user must input this
      }));
      if (newMedications.length > 0) {
        replace(newMedications);
      }
      // Important: Clear the prescription from context so it doesn't pre-fill again on subsequent visits
      clearLastPrescription(); 
    }
  }, [patientState.lastPrescription, replace, clearLastPrescription]);


  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
     startTransition(() => {
        const formData = new FormData();
        data.medications.forEach((med, index) => {
            Object.entries(med).forEach(([key, value]) => {
                formData.append(`medications[${index}].${key}`, value.toString());
            })
        });
        formAction(formData);
    });
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Medication Adherence Input</CardTitle>
            <CardDescription>Enter details for the past 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="p-4 bg-muted/50 relative">
                        <FormLabel className="font-semibold">Medication {index + 1}</FormLabel>
                        <div className="space-y-2 mt-2">
                           <FormField control={form.control} name={`medications.${index}.medicineName`} render={({ field }) => (<FormItem><FormControl><Input placeholder="Medicine Name" {...field} /></FormControl><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name={`medications.${index}.dosageStrength`} render={({ field }) => (<FormItem><FormControl><Input placeholder="Dosage (e.g., 500mg tablet)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name={`medications.${index}.frequency`} render={({ field }) => (<FormItem><FormControl><Input placeholder="Frequency (e.g., Twice daily)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                           <div className="grid grid-cols-2 gap-2">
                                <FormField control={form.control} name={`medications.${index}.dosesPrescribed`} render={({ field }) => (<FormItem><FormLabel>Doses Prescribed</FormLabel><FormControl><Input type="number" placeholder="e.g., 14" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name={`medications.${index}.dosesTaken`} render={({ field }) => (<FormItem><FormLabel>Doses Taken</FormLabel><FormControl><Input type="number" placeholder="e.g., 12" {...field} /></FormControl><FormMessage /></FormItem>)} />
                           </div>
                        </div>
                        {fields.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => remove(index)} type="button" className="absolute top-2 right-2 h-6 w-6">
                              <XCircle className="h-5 w-5 text-destructive" />
                            </Button>
                        )}
                      </Card>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => append(defaultMedication)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Another Medication
                </Button>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Report
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {state && 'overallAdherence' in state ? (
          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PieChart className="text-primary"/>Weekly Adherence Report</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-lg text-muted-foreground">Overall Adherence Rate</p>
                    <p className="text-6xl font-bold text-primary">{state.overallAdherence}</p>
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>Adherence by Medication</CardTitle></CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Medication</TableHead>
                            <TableHead>Doses Taken</TableHead>
                            <TableHead>Doses Missed</TableHead>
                            <TableHead className="text-right">Adherence</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {state.medications.map((med, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{med.medicineName} <span className="text-xs text-muted-foreground">({med.dosageStrength})</span></TableCell>
                                <TableCell>{med.dosesTaken}</TableCell>
                                <TableCell>{med.dosesMissed}</TableCell>
                                <TableCell className="text-right font-bold">{med.adherenceRate}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Info className="text-primary"/>Summary & Notes</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{state.summaryNotes}</p>
                </CardContent>
            </Card>
          </div>
        ) : (
            !isPending && (
             <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
                <FileClock className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Adherence Report</h3>
                <p className="text-muted-foreground/80 mt-2">Enter your medication details to generate a report.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
