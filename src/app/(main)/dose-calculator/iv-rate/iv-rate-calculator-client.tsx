
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ivRateCalculator, type IvRateCalculatorOutput } from "@/ai/flows/iv-rate-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Beaker, FileText, Droplets } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  totalVolumeMl: z.coerce.number().positive("Must be positive"),
  totalTimeMinutes: z.coerce.number().positive("Must be positive"),
  dropFactorGttMl: z.coerce.number().positive("Must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

export function IvRateCalculatorClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<IvRateCalculatorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input. Check the form fields." };
      }
      try {
        const result = await ivRateCalculator(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to calculate IV rate. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalVolumeMl: "" as any,
      totalTimeMinutes: "" as any,
      dropFactorGttMl: "" as any,
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
            <CardTitle>Infusion Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField name="totalVolumeMl" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Total Volume (mL)</FormLabel><FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="totalTimeMinutes" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Total Time (minutes)</FormLabel><FormControl><Input type="number" placeholder="e.g., 480" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="dropFactorGttMl" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Drop Factor (gtt/mL)</FormLabel><FormControl><Input type="number" placeholder="e.g., 20" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Calculate Rate
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {state && 'infusionRateMlHr' in state && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-background to-secondary/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">IV Rate Calculation Results</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary-foreground/80">Infusion Rate</h3>
                  <p className="text-3xl font-bold text-primary">{state.infusionRateMlHr}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary-foreground/80">Drop Rate</h3>
                  <p className="text-3xl font-bold text-primary">{state.dropsPerMinute}</p>
                </div>
              </CardContent>
            </Card>

            
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Beaker className="h-5 w-5 text-primary"/>Calculation Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Droplets className="h-4 w-4"/>mL/hour Calculation</h3>
                    <p className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap font-code">{state.mlHrCalculationSteps}</p>
                  </div>
                   <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Droplets className="h-4 w-4"/>gtt/minute Calculation</h3>
                    <p className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap font-code">{state.gttMinCalculationSteps}</p>
                  </div>
                </CardContent>
              </Card>
            
          </div>
        )}
      </div>
    </div>
  );
}
