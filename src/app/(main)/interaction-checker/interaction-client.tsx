
"use client";

import { useActionState, useEffect, useMemo, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { checkDrugInteractions, type CheckDrugInteractionsOutput } from "@/ai/flows/ai-interaction-engine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, XCircle, AlertTriangle, ShieldCheck, ShieldQuestion, Salad, FlaskConical } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useMode } from "@/contexts/mode-context";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  medications: z.array(z.object({ value: z.string().min(2, "Required") })).min(2, "At least two medications are required"),
  labResults: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const severityMap: { [key: string]: { icon: React.ElementType, color: string, badge: "destructive" | "secondary" | "default" } } = {
  'high': { icon: AlertTriangle, color: 'text-red-500', badge: 'destructive' },
  'moderate': { icon: ShieldQuestion, color: 'text-yellow-500', badge: 'default' },
  'low': { icon: ShieldCheck, color: 'text-green-500', badge: 'secondary' },
};

export function InteractionClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<CheckDrugInteractionsOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const medications = formData.getAll("medications").map(m => m.toString()).filter(m => m.length > 1);
      const labResults = formData.get("labResults")?.toString();

      if (medications.length < 2) {
        return { error: "Please provide at least two medications." };
      }
      try {
        const result = await checkDrugInteractions({ medications, labResults });
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to check interactions. Please try again." };
      }
    },
    null
  );

  const { mode } = useMode();
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medications: [{ value: "" }, { value: "" }],
      labResults: "",
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  const { drugInteractions, foodInteractions } = useMemo(() => {
    if (!state || !('interactions' in state)) {
      return { drugInteractions: [], foodInteractions: [] };
    }
    const drugInteractions = state.interactions.filter(i => !i.interactingDrugs.includes('Food'));
    const foodInteractions = state.interactions.filter(i => i.interactingDrugs.includes('Food'));
    return { drugInteractions, foodInteractions };
  }, [state]);


  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit(() => {
    form.trigger().then(valid => {
        if (valid) {
            const formData = new FormData();
            const formValues = form.getValues();
            formValues.medications.forEach(med => {
                formData.append('medications', med.value);
            });
            if(formValues.labResults) {
                formData.append('labResults', formValues.labResults);
            }
            startTransition(() => {
              formAction(formData);
            });
        }
    });
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Medication List</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`medications.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication {index + 1}</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input placeholder="e.g., Warfarin" {...field} />
                          </FormControl>
                          {fields.length > 2 && (
                            <Button variant="ghost" size="icon" onClick={() => remove(index)} type="button">
                              <XCircle className="h-5 w-5 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
                </Button>
                <FormField control={form.control} name="labResults" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relevant Lab Results (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., INR 2.5, K+ 4.0" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Check Interactions
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2 space-y-6">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        
        {state && 'interactions' in state && (
          <>
            {state.interactions.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>No Interactions Found</CardTitle>
                  <CardDescription>No significant drug-drug or drug-food interactions were found.</CardDescription>
                </CardHeader>
              </Card>
            )}

            {drugInteractions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FlaskConical className="h-6 w-6 text-primary"/> Drug-Drug Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full" defaultValue={drugInteractions.map((_, i) => `item-d-${i}`)}>
                    {drugInteractions.map((interaction, index) => {
                      const severity = interaction.severity.toLowerCase();
                      const SeverityIcon = severityMap[severity]?.icon || ShieldQuestion;
                      return (
                        <AccordionItem value={`item-d-${index}`} key={index}>
                          <AccordionTrigger className="text-lg font-semibold">
                            <div className="flex items-center gap-4">
                              <SeverityIcon className={`h-6 w-6 ${severityMap[severity]?.color || 'text-gray-500'}`} />
                              <p>{interaction.interactingDrugs.join(' + ')}</p>
                              <Badge variant={severityMap[severity]?.badge || 'default'}>{interaction.severity}</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pl-10">
                             <p><strong>Interacting Drugs:</strong> {interaction.interactingDrugs.join(', ')}</p>
                             {mode === 'pharmacist' && <p><strong>Mechanism:</strong> {interaction.mechanism}</p>}
                             <p><strong>Suggested Actions:</strong> {interaction.suggestedActions}</p>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {foodInteractions.length > 0 && (
              <Card>
                 <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Salad className="h-6 w-6 text-green-500"/> Drug-Food Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full" defaultValue={foodInteractions.map((_, i) => `item-f-${i}`)}>
                    {foodInteractions.map((interaction, index) => {
                      const severity = interaction.severity.toLowerCase();
                      const SeverityIcon = severityMap[severity]?.icon || ShieldQuestion;
                       const drug = interaction.interactingDrugs.find(d => d !== 'Food');
                      return (
                        <AccordionItem value={`item-f-${index}`} key={index}>
                          <AccordionTrigger className="text-lg font-semibold">
                            <div className="flex items-center gap-4">
                              <SeverityIcon className={`h-6 w-6 ${severityMap[severity]?.color || 'text-gray-500'}`} />
                              <p>{drug} + Food</p>
                              <Badge variant={severityMap[severity]?.badge || 'default'}>{interaction.severity}</Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pl-10">
                             <p><strong>Interacting Drug:</strong> {drug}</p>
                             {mode === 'pharmacist' && <p><strong>Mechanism:</strong> {interaction.mechanism}</p>}
                             <p><strong>Suggested Actions:</strong> {interaction.suggestedActions}</p>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
