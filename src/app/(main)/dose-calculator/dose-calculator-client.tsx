"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { calculateDosage, type CalculateDosageOutput } from "@/ai/flows/ai-dose-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Beaker, FileText, CheckCircle } from "lucide-react";
import { useMode } from "@/contexts/mode-context";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  drugName: z.string().min(2, "Required"),
  indication: z.string().min(3, "Indication is required"),
  patientWeightKg: z.coerce.number().positive("Must be positive"),
  patientAgeYears: z.coerce.number().int().positive("Must be a positive integer"),
  renalFunction: z.string().optional(),
  hepaticFunction: z.string().optional(),
  availableFormulations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function DoseCalculatorClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<CalculateDosageOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input. Check the form fields." };
      }
      try {
        const result = await calculateDosage(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to calculate dosage. Please try again." };
      }
    },
    null
  );

  const { mode } = useMode();
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
      indication: "",
      renalFunction: "",
      hepaticFunction: "",
      availableFormulations: "",
    },
  });
  
  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
     startTransition(() => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
      formAction(formData);
    });
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Patient & Drug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField name="drugName" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Drug Name</FormLabel><FormControl><Input placeholder="e.g., Amoxicillin" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField name="indication" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Indication for Use</FormLabel><FormControl><Input placeholder="e.g., Pneumonia" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="patientWeightKg" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Patient Weight (kg)</FormLabel><FormControl><Input type="number" placeholder="e.g., 70" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="patientAgeYears" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Patient Age (years)</FormLabel><FormControl><Input type="number" placeholder="e.g., 45" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="renalFunction" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Renal Function</FormLabel><FormControl><Input placeholder="e.g., CrCl 50 ml/min" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="hepaticFunction" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Hepatic Function</FormLabel><FormControl><Input placeholder="e.g., Mild impairment" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="availableFormulations" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Available Formulations</FormLabel><FormControl><Input placeholder="e.g., 250mg, 500mg tablets" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate Dose
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {state && 'calculatedDosage' in state && (
          <Card className="bg-gradient-to-br from-background to-secondary/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">Dosage Calculation Results</CardTitle>
              <CardDescription>Results for {form.getValues("drugName")} for {form.getValues("indication")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-primary/10 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-primary-foreground/80">Calculated Dosage</h3>
                <p className="text-4xl font-bold text-primary">{state.calculatedDosage}</p>
              </div>

              {state.roundedDosageSuggestion && (
                 <div className="p-4 bg-accent/20 rounded-lg flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-accent" />
                  <div>
                    <h4 className="font-semibold">Rounding Suggestion</h4>
                    <p className="text-muted-foreground">{state.roundedDosageSuggestion}</p>
                  </div>
                 </div>
              )}

              {mode === 'pharmacist' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2"><Beaker className="h-5 w-5 text-primary"/>Calculation Steps</h3>
                    <p className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap font-code">{state.calculationSteps}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>References</h3>
                    <p className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap font-code text-sm">{state.references}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
