
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
import { Loader2, Forward, AlertTriangle, Activity, ShieldPlus, HeartPulse, Sparkles, Save, UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePatient, type PatientHistory, type UserProfile, type PatientRecord } from "@/contexts/patient-context";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useMode } from "@/contexts/mode-context";
import { useRouter } from "next/navigation";


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

const newPatientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phoneNumber: z.string().optional(),
});
type NewPatientValues = z.infer<typeof newPatientSchema>;

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
  const { mode } = useMode();
  const router = useRouter();
  const { getActivePatientRecord, addOrUpdatePatientRecord, addOrUpdateUser, setActiveUser, patientState } = usePatient();
  const activePatientRecord = getActivePatientRecord();
  
  const [currentStep, setCurrentStep] = useState<'symptoms' | 'questions' | 'analysis'>('symptoms');
  const [saveToHistoryModalOpen, setSaveToHistoryModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const symptomForm = useForm<SymptomFormValues>({ resolver: zodResolver(symptomFormSchema) });
  const answerForm = useForm<AnswerFormValues>();
  const newPatientForm = useForm<NewPatientValues>({
    resolver: zodResolver(newPatientSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
    },
  });

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

  const handleSaveToHistory = () => {
    if (mode === 'patient') {
      if (!activePatientRecord || !state?.analysis) return;
      
      const newNote = `[${new Date().toISOString().split('T')[0]}] Symptom Check: ${state.analysis.summaryForHistory}`;
      const system = state.analysis.mostRelevantSystem;
      
      const updatedHistory: PatientHistory = {
        ...activePatientRecord.history,
        systemicNotes: {
          ...activePatientRecord.history.systemicNotes,
          [system]: `${activePatientRecord.history.systemicNotes?.[system] || ''}\n\n${newNote}`.trim(),
        }
      };
      addOrUpdatePatientRecord(updatedHistory);
      toast({ title: 'Saved to History', description: `Analysis saved to the ${system} section.` });
      resetFlow();
    } else { // Pharmacist
      setSaveToHistoryModalOpen(true);
    }
  };

  const handlePharmacistSave = newPatientForm.handleSubmit(async (data: NewPatientValues) => {
    if (!state?.analysis) return;
    setIsSaving(true);
    
    // Find existing patient record by name and phone number.
    const existingRecord = patientState.patientRecords.find(
      (r) =>
        r.history.name?.toLowerCase() === data.name.toLowerCase() &&
        r.history.phoneNumber === data.phoneNumber
    );

    const newNote = `[${new Date().toISOString().split('T')[0]}] Symptom Check (Pharmacist Assisted): ${state.analysis.summaryForHistory}`;
    const system = state.analysis.mostRelevantSystem;

    if (existingRecord) {
      // Update existing record
      const historyToUpdate = existingRecord.history;
      const updatedHistory: PatientHistory = {
        ...historyToUpdate,
        systemicNotes: {
          ...historyToUpdate.systemicNotes,
          [system]: `${historyToUpdate.systemicNotes?.[system] || ''}\n\n${newNote}`.trim(),
        },
      };
      addOrUpdatePatientRecord(updatedHistory, existingRecord.id);
      toast({ title: "History Updated", description: `Analysis saved to existing record for ${data.name}.` });

    } else {
      // Create new record for a new patient
      const newHistory: PatientHistory = {
        name: data.name,
        phoneNumber: data.phoneNumber,
        systemicNotes: {
          [system]: newNote,
        },
      };
      addOrUpdatePatientRecord(newHistory);
      toast({ title: "New Patient Record Created", description: `Analysis saved for new patient ${data.name}.` });
    }
    
    setIsSaving(false);
    setSaveToHistoryModalOpen(false);
    resetFlow();
  });


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
                    <p className="text-sm text-muted-foreground">Most Relevant System: <Badge variant="outline">{analysis.mostRelevantSystem}</Badge></p>
                    {analysis.possibleConditions.map((cond, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-md">
                           <div className="flex justify-between items-center">
                             <p className="font-semibold text-primary">{cond.name}</p>
                             <Badge variant={cond.likelihood === 'High' ? 'default' : 'secondary'}>{cond.likelihood} Likelihood</Badge>
                           </div>
                        </div>
                    ))}
                </div>
                
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Save Analysis?</AlertTitle>
                    <AlertDescription>Would you like to save a summary of this analysis to the health history?</AlertDescription>
                    <div className="flex gap-4 mt-4">
                        <Button onClick={handleSaveToHistory}><Save className="mr-2"/>Save to History</Button>
                        <Button onClick={resetFlow} variant="outline">Start New Analysis</Button>
                    </div>
                </Alert>
                 {/* Pharmacist Save Modal */}
                <Dialog open={saveToHistoryModalOpen} onOpenChange={setSaveToHistoryModalOpen}>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save to Patient History</DialogTitle>
                        <DialogDescription>Find an existing patient or create a new record.</DialogDescription>
                    </DialogHeader>
                    <Form {...newPatientForm}>
                        <form onSubmit={handlePharmacistSave} className="space-y-4">
                            <FormField name="name" control={newPatientForm.control} render={({ field }) => (
                                <FormItem><FormLabel>Patient Name</FormLabel><FormControl><Input {...field} placeholder="Full Name" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="phoneNumber" control={newPatientForm.control} render={({ field }) => (
                                <FormItem><FormLabel>Patient Phone (Optional)</FormLabel><FormControl><Input {...field} placeholder="Phone Number" /></FormControl><FormMessage /></FormItem>
                            )} />
                             <DialogFooter>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                    </DialogContent>
                </Dialog>
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

    
