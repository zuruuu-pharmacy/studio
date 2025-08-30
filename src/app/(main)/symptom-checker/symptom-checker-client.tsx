
"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getSymptomAnalysis, type GetSymptomAnalysisOutput } from "@/ai/flows/symptom-checker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Forward, AlertTriangle, Activity, ShieldPlus, HeartPulse, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePatient } from "@/contexts/patient-context";
import { Badge } from "@/components/ui/badge";

// Form schema for the initial symptom input
const symptomFormSchema = z.object({
  initialSymptoms: z.string().min(5, "Please describe your symptoms in more detail."),
});
type SymptomFormValues = z.infer<typeof symptomFormSchema>;

// Form schema for answering the AI's triage questions
const answerFormSchema = z.object({
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string().min(1, "Please answer this question."),
  })),
});
type AnswerFormValues = z.infer<typeof answerFormSchema>;

// Severity styling map
const severityMap: { [key: string]: { icon: React.ElementType, color: string, badge: "destructive" | "secondary" | "default" } } = {
  'Red': { icon: HeartPulse, color: 'text-red-500', badge: 'destructive' },
  'Yellow': { icon: AlertTriangle, color: 'text-yellow-500', badge: 'default' },
  'Green': { icon: ShieldPlus, color: 'text-green-500', badge: 'secondary' },
};


export function SymptomCheckerClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<GetSymptomAnalysisOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      // This action handles both steps of the flow
      const initialSymptoms = formData.get("initialSymptoms") as string;
      const answers: { question: string, answer: string }[] = [];
      let i = 0;
      while(formData.has(`answers[${i}].question`)) {
          answers.push({
            question: formData.get(`answers[${i}].question`) as string,
            answer: formData.get(`answers[${i}].answer`) as string,
          });
          i++;
      }

      try {
        const result = await getSymptomAnalysis({ 
            initialSymptoms, 
            detailedHistory: activePatientRecord?.history,
            answers: answers.length > 0 ? answers : undefined,
        });
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to get analysis. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const { getActivePatientRecord } = usePatient();
  const activePatientRecord = getActivePatientRecord();

  const [currentStep, setCurrentStep] = useState<'symptoms' | 'questions' | 'analysis'>('symptoms');
  
  const symptomForm = useForm<SymptomFormValues>({ resolver: zodResolver(symptomFormSchema) });
  const answerForm = useForm<AnswerFormValues>();

  useEffect(() => {
    if (state) {
        if ('error' in state) {
            toast({ variant: "destructive", title: "Error", description: state.error });
        } else if (state.triageQuestions) {
            answerForm.reset({ answers: state.triageQuestions.map(q => ({ question: q.question, answer: '' })) });
            setCurrentStep('questions');
        } else if (state.analysis) {
            setCurrentStep('analysis');
        }
    }
  }, [state, toast, answerForm]);

  const handleSymptomSubmit = symptomForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append('initialSymptoms', data.initialSymptoms);
    startTransition(() => formAction(formData));
  });

  const handleAnswerSubmit = answerForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append('initialSymptoms', symptomForm.getValues('initialSymptoms'));
    data.answers.forEach((ans, i) => {
        formData.append(`answers[${i}].question`, ans.question);
        formData.append(`answers[${i}].answer`, ans.answer);
    });
    startTransition(() => formAction(formData));
  });

  const resetFlow = () => {
    symptomForm.reset({ initialSymptoms: '' });
    setCurrentStep('symptoms');
  }

  // RENDER LOGIC
  if (isPending) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (currentStep === 'analysis' && state?.analysis) {
    const { analysis } = state;
    const severityConfig = severityMap[analysis.severity] || severityMap['Yellow'];
    return (
        <Card className={`border-2 ${severityConfig.color.replace('text-', 'border-')}`}>
            <CardHeader>
                <CardTitle className={`flex items-center gap-3 text-2xl ${severityConfig.color}`}>
                   <severityConfig.icon className="h-8 w-8" />
                   Symptom Analysis Complete
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert variant={severityConfig.badge === 'destructive' ? 'destructive' : 'default'} className="bg-background">
                    <severityConfig.icon className={`h-4 w-4 ${severityConfig.color}`} />
                    <AlertTitle className="text-lg">Recommendation: {analysis.recommendation}</AlertTitle>
                    <AlertDescription>{analysis.disclaimer}</AlertDescription>
                </Alert>

                <div className="space-y-3">
                    <h3 className="font-semibold text-xl">Possible Conditions</h3>
                    {analysis.possibleConditions.map((cond, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-md">
                           <div className="flex justify-between items-center">
                             <p className="font-semibold text-primary">{cond.name}</p>
                             <Badge variant={cond.likelihood === 'High' ? 'default' : 'secondary'}>{cond.likelihood} Likelihood</Badge>
                           </div>
                        </div>
                    ))}
                </div>

                <Button onClick={resetFlow} className="w-full">Start New Analysis</Button>
            </CardContent>
        </Card>
    );
  }

  if (currentStep === 'questions' && state?.triageQuestions) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>AI Follow-up Questions</CardTitle>
                <CardDescription>Please answer these questions to help narrow down the possibilities.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...answerForm}>
                    <form onSubmit={handleAnswerSubmit} className="space-y-6">
                        {state.triageQuestions.map((q, index) => (
                            <FormField key={index} name={`answers.${index}.answer`} control={answerForm.control}
                                render={({ field }) => (
                                    <FormItem className="p-4 border rounded-lg">
                                        <FormLabel className="font-semibold text-base">{q.question}</FormLabel>
                                        <FormControl>
                                            {q.type === 'yes_no' ? (
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Yes" id={`q${index}_yes`} /></FormControl><Label htmlFor={`q${index}_yes`}>Yes</Label></FormItem>
                                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="No" id={`q${index}_no`} /></FormControl><Label htmlFor={`q${index}_no`}>No</Label></FormItem>
                                                </RadioGroup>
                                            ) : q.type === 'multiple_choice' && q.choices ? (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
                                                    <SelectContent>
                                                        {q.choices.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input {...field} placeholder="Your answer..."/>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                        {/* Hidden input to store the question itself */}
                                        <FormField name={`answers.${index}.question`} control={answerForm.control} defaultValue={q.question} render={({ field }) => <input type="hidden" {...field} />} />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button type="submit" className="w-full">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get My Analysis'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
  }

  // Default to symptom input step
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Activity />Symptom Input</CardTitle>
        <CardDescription>
            Describe your symptoms in plain language. Example: "I have a fever, cough, and chest pain."
            {activePatientRecord && ` Analyzing for ${activePatientRecord.history.name}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...symptomForm}>
          <form onSubmit={handleSymptomSubmit} className="space-y-4">
            <FormField name="initialSymptoms" control={symptomForm.control} render={({ field }) => (
              <FormItem>
                <FormLabel>My Symptoms</FormLabel>
                <FormControl><Textarea placeholder="Describe your symptoms here..." {...field} rows={4}/></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Next"}
              <Forward className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
