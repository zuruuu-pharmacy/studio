
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { checkDrugFoodInteraction, type CheckDrugFoodInteractionOutput } from "@/ai/flows/drug-food-interaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Salad, AlertTriangle, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMode } from "@/contexts/mode-context";

const formSchema = z.object({
  drugName: z.string().min(2, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

export function DrugFoodInteractionClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<CheckDrugFoodInteractionOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input. Check the form field." };
      }
      try {
        const result = await checkDrugFoodInteraction(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to check interaction. Please try again." };
      }
    },
    null
  );

  const { mode } = useMode();
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { drugName: "" },
  });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("drugName", data.drugName);
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Check Drug-Food Interaction</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField name="drugName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Warfarin" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Check Interaction
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {state && 'interactionExists' in state && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Salad className="h-6 w-6 text-green-500"/> Interaction Result</CardTitle>
               <CardDescription>Result for {form.getValues("drugName")}</CardDescription>
            </CardHeader>
            <CardContent>
              {state.interactionExists ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Potential Interaction Detected!</AlertTitle>
                  <AlertDescription>
                     <p className="font-semibold mt-4">Severity: {state.severity}</p>
                     <p className="mt-2"><strong>Details:</strong> {state.details}</p>
                     {mode === 'pharmacist' && <p className="mt-2"><strong>Mechanism:</strong> {state.mechanism}</p>}
                     <p className="mt-2"><strong>Management:</strong> {state.management}</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <AlertTitle>No Significant Interaction Found</AlertTitle>
                  <AlertDescription>{state.details}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
