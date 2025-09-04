
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { compoundingCalculator, type CompoundingCalculatorOutput } from "@/ai/flows/compounding-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Beaker, FileText } from "lucide-react";
import { useMode } from "@/contexts/mode-context";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  preparationType: z.enum(['w/v', 'v/v', 'w/w']),
  desiredVolumeMl: z.coerce.number().optional(),
  desiredWeightG: z.coerce.number().optional(),
  percentageStrength: z.coerce.number().positive("Must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

export function CompoundingCalculatorClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<CompoundingCalculatorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input. Check the form fields." };
      }
      try {
        const result = await compoundingCalculator(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: (e as Error).message || "Failed to calculate. Please try again." };
      }
    },
    null
  );

  const { mode } = useMode();
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preparationType: 'w/v',
      percentageStrength: "" as any,
    },
  });

  const prepType = form.watch('preparationType');
  
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
            <CardTitle>Preparation Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField name="preparationType" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Preparation Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="w/v">% w/v (weight/volume)</SelectItem>
                                <SelectItem value="v/v">% v/v (volume/volume)</SelectItem>
                                <SelectItem value="w/w">% w/w (weight/weight)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />

                { (prepType === 'w/v' || prepType === 'v/v') && (
                    <FormField name="desiredVolumeMl" control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Final Volume (mL)</FormLabel><FormControl><Input type="number" placeholder="e.g., 250" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                )}

                 { prepType === 'w/w' && (
                    <FormField name="desiredWeightG" control={form.control} render={({ field }) => (
                      <FormItem><FormLabel>Final Weight (g)</FormLabel><FormControl><Input type="number" placeholder="e.g., 100" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                )}

                <FormField name="percentageStrength" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Percentage Strength (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate Amount
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {state && 'soluteNeeded' in state && (
            <Card className="bg-gradient-to-br from-background to-secondary/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Compounding Calculation Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-primary/10 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-primary-foreground/80">Amount of Solute Needed</h3>
                    <p className="text-4xl font-bold text-primary">{state.soluteNeeded}</p>
                </div>
                
                {mode === 'pharmacist' && (
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
                )}
              </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
