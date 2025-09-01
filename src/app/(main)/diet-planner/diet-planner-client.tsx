
"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { generateDietPlan, type DietPlannerOutput } from "@/ai/flows/diet-planner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Apple, Soup, ClipboardCheck, User } from "lucide-react";
import { useMode } from "@/contexts/mode-context";
import { usePatient } from "@/contexts/patient-context";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";


function ResultCard({ title, content, icon: Icon }: { title: string, content: string, icon: React.ElementType }) {
    if (!content) return null;
    return (
        <Card className="bg-background/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
            </CardContent>
        </Card>
    );
}

export function DietPlannerClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<DietPlannerOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const activePatient = getActivePatientRecord();
      if (!activePatient) {
        return { error: "No active patient selected." };
      }
      try {
        const result = await generateDietPlan({
          detailedHistory: activePatient.history,
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

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleGeneratePlan = () => {
    startTransition(() => {
        const formData = new FormData();
        formAction(formData);
    })
  }

  const dietPlan = useMemo(() => {
    if (state && 'diet_plan' in state) {
        return `Breakfast: ${state.diet_plan.breakfast}\nLunch: ${state.diet_plan.lunch}\nSnack: ${state.diet_plan.snack}\nDinner: ${state.diet_plan.dinner}`;
    }
    return null;
  }, [state]);

  const warnings = useMemo(() => {
     if (state && 'warnings' in state) {
        return state.warnings.map(w => `- ${w}`).join('\n');
    }
    return null;
  }, [state]);
  
  const detailedNotes = useMemo(() => {
    if (state && 'detailed_notes' in state) {
        const notes = state.detailed_notes;
        return `Total Calories: ${notes.calories}\nMacronutrient Split: ${notes.macros}\nSodium Limit: ${notes.sodium_limit}\nFiber Goal: ${notes.fiber_goal}`;
    }
    return null;
  }, [state]);

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

  return (
    <div>
        {!state && (
             <Card className="text-center">
                 <CardHeader>
                    <CardTitle>Generate a Diet Plan</CardTitle>
                    <CardDescription>
                        Click the button below to generate a personalized diet and nutrition plan for <span className="font-bold">{activePatientRecord.history.name}</span>. The plan will be based on their complete health history.
                    </CardDescription>
                 </CardHeader>
                 <CardContent>
                     <Button onClick={handleGeneratePlan} disabled={isPending} size="lg">
                         {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Apple className="mr-2"/>}
                         Generate Diet Plan
                     </Button>
                 </CardContent>
             </Card>
        )}
      
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

        {state && 'diet_plan' in state && (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Diet Plan for {activePatientRecord.history.name}</CardTitle>
                        <CardDescription>
                            This is a sample meal plan. Portions should be adjusted based on individual needs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {dietPlan && <ResultCard title="Meal Plan" content={dietPlan} icon={Soup} />}
                        {warnings && <ResultCard title="Important Warnings & Interactions" content={warnings} icon={AlertTriangle} />}
                        {mode === 'pharmacist' && detailedNotes && <ResultCard title="Detailed Clinical Notes" content={detailedNotes} icon={ClipboardCheck} />}
                        <Alert>
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertTitle>Disclaimer</AlertTitle>
                            <AlertDescription>This diet plan is AI-generated and not a substitute for professional medical advice. Consult a doctor or registered dietitian before making significant dietary changes.</AlertDescription>
                        </Alert>
                         <Button onClick={() => formAction(new FormData())} disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Regenerate Plan
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}
    </div>
  );
}
