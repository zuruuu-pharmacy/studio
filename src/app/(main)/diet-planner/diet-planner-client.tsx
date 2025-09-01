
"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateDietPlan, type DietPlannerOutput } from "@/ai/flows/diet-planner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Apple, Soup, ClipboardCheck, User, Sparkles, Utensils, ShoppingCart, Leaf, Ban, ArrowLeft } from "lucide-react";
import { useMode } from "@/contexts/mode-context";
import { usePatient } from "@/contexts/patient-context";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  conditions: z.string().min(1, "At least one condition is required."),
  allergies: z.string().optional(),
  preferences: z.string().optional(),
  goal: z.string().min(1, "A health goal is required."),
});
type FormValues = z.infer<typeof formSchema>;


function ResultCard({ title, content, icon: Icon }: { title: string, content: string | string[], icon: React.ElementType }) {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;
    return (
        <Card className="bg-background/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                 {Array.isArray(content) ? (
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {content.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                 ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
                 )}
            </CardContent>
        </Card>
    );
}

export function DietPlannerClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<DietPlannerOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
          return { error: "Invalid input. Please check the form." };
      }
      if (!activePatientRecord) {
        return { error: "No active patient selected." };
      }
      try {
        const result = await generateDietPlan({
          ...parsed.data,
          detailedHistory: activePatientRecord.history,
        });
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to generate diet plan. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const { mode } = useMode();
  const { getActivePatientRecord } = usePatient();
  const activePatientRecord = getActivePatientRecord();
  const [currentStep, setCurrentStep] = useState<'form' | 'result'>('form');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      conditions: activePatientRecord?.history.pastMedicalHistory || "",
      allergies: activePatientRecord?.history.allergyHistory || "",
      preferences: "",
      goal: "General Wellness",
    },
  });

  useEffect(() => {
    form.reset({
      conditions: activePatientRecord?.history.pastMedicalHistory || "",
      allergies: activePatientRecord?.history.allergyHistory || "",
      preferences: "",
      goal: "General Wellness",
    });
  }, [activePatientRecord, form]);

  useEffect(() => {
    if (state) {
        if ('error' in state && state.error) {
            toast({ variant: "destructive", title: "Error", description: state.error });
        } else if ('diet_plan' in state) {
            setCurrentStep('result');
        }
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    startTransition(() => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
        formAction(formData);
    })
  });

  if (!activePatientRecord) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Active Patient Case</CardTitle>
          <CardDescription>
            Please {mode === 'pharmacist' ? 'select a patient from the list or create a new one' : 'create your patient profile'} to generate a diet plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={mode === 'pharmacist' ? "/patients" : "/patient-history"} passHref>
            <Button><User className="mr-2"/>{mode === 'pharmacist' ? 'Go to Patient Records' : 'Go to My History'}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 'result' && state && 'diet_plan' in state) {
     return (
        <div className="space-y-6">
            <Button onClick={() => setCurrentStep('form')} variant="outline">
                <ArrowLeft className="mr-2"/> Back to Form
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Diet Plan for {activePatientRecord.history.name}</CardTitle>
                    <CardDescription>
                        A personalized plan based on the provided health information and goals.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ResultCard title="Meal Plan" content={`Breakfast: ${state.diet_plan.breakfast}\n\nLunch: ${state.diet_plan.lunch}\n\nSnack: ${state.diet_plan.snack}\n\nDinner: ${state.diet_plan.dinner}`} icon={Utensils} />
                    <div className="grid md:grid-cols-2 gap-6">
                        <ResultCard title="Foods to Favor" content={state.foods_to_favor} icon={Leaf} />
                        <ResultCard title="Foods to Avoid" content={state.foods_to_avoid} icon={Ban} />
                    </div>
                    <ResultCard title="Shopping List" content={state.shopping_list} icon={ShoppingCart} />
                    <ResultCard title="Clinical Notes & Justification" content={state.clinical_notes} icon={ClipboardCheck} />
                    <Alert>
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>Disclaimer</AlertTitle>
                        <AlertDescription>{state.disclaimer}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
     );
  }


  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Create a Personalized Diet Plan</CardTitle>
                <CardDescription>
                    Confirm the details for <span className="font-bold">{activePatientRecord.history.name}</span> and add any preferences to generate a new plan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <FormField name="conditions" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Health Conditions</FormLabel>
                                <FormControl><Textarea placeholder="e.g., Diabetes, Hypertension" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField name="allergies" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Known Food Allergies</FormLabel>
                                <FormControl><Textarea placeholder="e.g., Peanuts, Gluten" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField name="preferences" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Food Preferences & Dislikes (Optional)</FormLabel>
                                <FormControl><Textarea placeholder="e.g., Prefers chicken, dislikes eggplant, vegetarian" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="goal" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Primary Health Goal</FormLabel>
                                <FormControl><Input placeholder="e.g., Weight loss, better blood sugar control" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button type="submit" disabled={isPending} size="lg" className="w-full">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2"/>}
                            Generate AI Diet Plan
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
