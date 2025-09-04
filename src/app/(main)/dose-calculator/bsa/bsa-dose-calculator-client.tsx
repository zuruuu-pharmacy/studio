
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bsaDoseCalculator, type BsaDoseCalculatorOutput } from "@/ai/flows/bsa-dose-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Beaker, FileText, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  drugName: z.string().min(2, "Required"),
  dosePerM2: z.string().min(1, "Dose per m² is required (e.g., 100mg/m²)"),
  patientWeightKg: z.coerce.number().positive("Must be positive"),
  patientHeightCm: z.coerce.number().positive("Must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

export function BsaDoseCalculatorClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<BsaDoseCalculatorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input. Check the form fields." };
      }
      try {
        const result = await bsaDoseCalculator(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to calculate BSA-based dose. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
      dosePerM2: "",
      patientWeightKg: "" as any,
      patientHeightCm: "" as any,
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
            formData.append(key, value.toString());
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
                  <FormItem><FormLabel>Drug Name</FormLabel><FormControl><Input placeholder="e.g., Carboplatin" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField name="dosePerM2" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Dose per m²</FormLabel><FormControl><Input placeholder="e.g., 100mg/m²" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="patientWeightKg" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Patient Weight (kg)</FormLabel><FormControl><Input type="number" placeholder="e.g., 70" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="patientHeightCm" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Patient Height (cm)</FormLabel><FormControl><Input type="number" placeholder="e.g., 175" {...field} /></FormControl><FormMessage /></FormItem>
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
        {state && 'totalDose' in state && (
            <Card className="bg-gradient-to-br from-background to-secondary/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">BSA Dose Calculation Results</CardTitle>
                <CardDescription>Results for {form.getValues("drugName")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-primary/10 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary-foreground/80">Calculated BSA</h3>
                        <p className="text-3xl font-bold text-primary">{state.bodySurfaceArea} m²</p>
                    </div>
                     <div className="p-4 bg-primary/10 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary-foreground/80">Final Total Dose</h3>
                        <p className="text-3xl font-bold text-primary">{state.totalDose}</p>
                    </div>
                </div>

                
                  <>
                    <Separator />
                    {state.calculationSteps && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2"><Beaker className="h-5 w-5 text-primary"/>Calculation Steps</h3>
                        <p className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap font-code">{state.calculationSteps}</p>
                      </div>
                    )}
                    {state.explanation && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Explanation</h3>
                        <p className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap text-sm">{state.explanation}</p>
                      </div>
                    )}
                  </>
                
              </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
