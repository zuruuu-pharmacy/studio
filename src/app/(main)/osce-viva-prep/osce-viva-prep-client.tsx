
"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateOsceStation, type OsceStationGeneratorOutput } from "@/ai/flows/osce-station-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, User, FileText, FlaskConical, Microscope, HeartPulse, ShieldPlus, Activity, Lightbulb, ClipboardCheck, Zap, CaseSensitive, BookCopy, Repeat } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

type Mode = "exam" | "practice" | "review" | "drill" | "adaptive";

const topicFormSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});
type TopicFormValues = z.infer<typeof topicFormSchema>;

const answerFormSchema = z.object({
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string().min(1, "Please provide an answer."),
  })),
});
type AnswerFormValues = z.infer<typeof answerFormSchema>;

function CaseSection({ title, content, icon: Icon }: { title: string, content: string | undefined, icon: React.ElementType }) {
    if (!content) return null;
    return (
        <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-1"><Icon className="h-5 w-5 text-primary"/>{title}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap pl-7">{content}</p>
        </div>
    )
}

export function OsceVivaPrepClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<OsceStationGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const topic = formData.get("topic") as string;
      const answers: { question: string, answer: string }[] = [];
      let i = 0;
      while (formData.has(`answers[${i}].question`)) {
        answers.push({
          question: formData.get(`answers[${i}].question`) as string,
          answer: formData.get(`answers[${i}].answer`) as string,
        });
        i++;
      }
      
      const caseDetails = formData.get("caseDetails") ? JSON.parse(formData.get("caseDetails") as string) : undefined;

      try {
        const result = await generateOsceStation({
          topic,
          studentAnswers: answers.length > 0 ? answers : undefined,
          caseDetails: caseDetails
        });
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to process the case. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const [step, setStep] = useState<'mode' | 'topic' | 'case' | 'feedback'>('mode');
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  const topicForm = useForm<TopicFormValues>({ 
      resolver: zodResolver(topicFormSchema),
      defaultValues: {
          topic: ""
      }
  });
  const answerForm = useForm<AnswerFormValues>({
      defaultValues: {
          answers: []
      }
  });

  useEffect(() => {
    if (state) {
      if ('error' in state) {
        toast({ variant: "destructive", title: "Error", description: state.error });
      } else if (state.caseDetails && state.questions) {
        answerForm.reset({ answers: state.questions.map(q => ({ question: q.question, answer: '' })) });
        setStep('case');
      } else if (state.feedback) {
        setStep('feedback');
      }
    }
  }, [state, toast, answerForm]);

  const handleModeSelect = (mode: Mode) => {
    if (mode !== 'exam') {
        toast({ title: "Coming Soon", description: "This mode is currently under development."});
        return;
    }
    setSelectedMode(mode);
    setStep('topic');
  }

  const handleTopicSubmit = topicForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", data.topic);
    startTransition(() => formAction(formData));
  });

  const handleAnswerSubmit = answerForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", topicForm.getValues("topic")); // Carry over topic
    formData.append("caseDetails", JSON.stringify(state?.caseDetails));
    data.answers.forEach((ans, i) => {
      formData.append(`answers[${i}].question`, ans.question);
      formData.append(`answers[${i}].answer`, ans.answer);
    });
    startTransition(() => formAction(formData));
  });
  
  const resetAll = () => {
    topicForm.reset({ topic: ""});
    setStep('mode');
    setSelectedMode(null);
  }

  if (isPending) {
    return (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating your OSCE Station...</p>
        </div>
    )
  }

  if (step === 'feedback' && state?.feedback) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Case Feedback & Analysis</CardTitle>
                <CardDescription>Review the AI-powered evaluation of your answers for the {selectedMode} mode.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <Alert variant="default" className="bg-primary/10 border-primary/50">
                    <ClipboardCheck className="h-4 w-4 text-primary" />
                    <AlertTitle>Overall Feedback</AlertTitle>
                    <AlertDescription>{state.feedback.overallFeedback}</AlertDescription>
                </Alert>
                
                <Accordion type="multiple" className="w-full space-y-4" defaultValue={['diagnosis', 'drugs', 'monitoring', 'counseling']}>
                    <AccordionItem value="diagnosis"><AccordionTrigger className="font-semibold text-lg">Diagnosis Confirmation</AccordionTrigger><AccordionContent className="p-4">{state.feedback.diagnosisConfirmation}</AccordionContent></AccordionItem>
                    <AccordionItem value="drugs"><AccordionTrigger className="font-semibold text-lg">Drug Choice Rationale</AccordionTrigger><AccordionContent className="p-4">{state.feedback.drugChoiceRationale}</AccordionContent></AccordionItem>
                    <AccordionItem value="monitoring"><AccordionTrigger className="font-semibold text-lg">Monitoring Plan</AccordionTrigger><AccordionContent className="p-4">{state.feedback.monitoringPlan}</AccordionContent></AccordionItem>
                    <AccordionItem value="counseling"><AccordionTrigger className="font-semibold text-lg">Lifestyle Counseling</AccordionTrigger><AccordionContent className="p-4">{state.feedback.lifestyleCounseling}</AccordionContent></AccordionItem>
                </Accordion>
                <Button onClick={resetAll}>Start a New Station</Button>
            </CardContent>
        </Card>
    )
  }

  if (step === 'case' && state?.caseDetails && state?.questions) {
    const { caseDetails, questions } = state;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">OSCE Station: {topicForm.getValues("topic")}</CardTitle>
                <CardDescription>Read the case details and answer the questions below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card className="p-6 bg-muted/50 space-y-4">
                    <CaseSection title="Patient Demographics" content={caseDetails.demographics} icon={User}/>
                    <CaseSection title="Chief Complaint" content={caseDetails.chiefComplaint} icon={FileText}/>
                    <CaseSection title="History of Present Illness" content={caseDetails.hpi} icon={Activity}/>
                    <CaseSection title="Past Medical & Family History" content={caseDetails.pmh} icon={ShieldPlus}/>
                    <CaseSection title="Current Medications & Allergies" content={caseDetails.medications} icon={FlaskConical}/>
                    <CaseSection title="Physical Examination" content={caseDetails.examination} icon={HeartPulse}/>
                    <CaseSection title="Lab & Diagnostics" content={caseDetails.labs} icon={Microscope}/>
                </Card>

                <Form {...answerForm}>
                    <form onSubmit={handleAnswerSubmit} className="space-y-6">
                       {questions.map((q, index) => (
                         <FormField key={index} name={`answers.${index}.answer`} control={answerForm.control}
                           render={({ field }) => (
                               <FormItem className="p-4 border rounded-lg">
                                   <FormLabel className="font-semibold text-base">{q.question}</FormLabel>
                                   <FormControl>
                                       {q.type === 'multiple_choice' && q.options ? (
                                           <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="pt-2 space-y-1">
                                               {q.options.map((opt, i) => (
                                                   <FormItem key={i} className="flex items-center space-x-3"><FormControl><RadioGroupItem value={opt}/></FormControl><Label className="font-normal">{opt}</Label></FormItem>
                                               ))}
                                           </RadioGroup>
                                       ) : (
                                           <Textarea placeholder="Your detailed answer..." {...field}/>
                                       )}
                                   </FormControl>
                                   <FormMessage/>
                                   <FormField name={`answers.${index}.question`} control={answerForm.control} defaultValue={q.question} render={({ field }) => <input type="hidden" {...field} />}/>
                               </FormItem>
                           )}
                         />
                       ))}
                       <Button type="submit" disabled={isPending}>Submit for Feedback</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
  }

  if (step === 'topic') {
    return (
        <Card className="max-w-xl mx-auto">
        <CardHeader>
            <CardTitle>Generate OSCE Station</CardTitle>
            <CardDescription>Enter a topic, domain, or scenario for your {selectedMode} session.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...topicForm}>
            <form onSubmit={handleTopicSubmit} className="space-y-4">
                <FormField name="topic" control={topicForm.control} render={({ field }) => (
                <FormItem>
                    <FormLabel>Station Topic</FormLabel>
                    <FormControl><Input placeholder="e.g., Patient Counseling for Inhalers" {...field}/></FormControl>
                    <FormMessage/>
                </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                Generate Station
                </Button>
                 <Button variant="link" onClick={() => setStep('mode')} className="w-full">Back to Mode Selection</Button>
            </form>
            </Form>
        </CardContent>
        </Card>
    );
  }
  
  // Default step: Mode selection
  return (
    <Card>
        <CardHeader>
            <CardTitle>Select a Practice Mode</CardTitle>
            <CardDescription>Choose how you want to prepare for your OSCE or Viva.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button onClick={() => handleModeSelect('exam')} className="p-4 border rounded-lg text-left hover:bg-muted/50 transition flex items-start gap-4">
                <CaseSensitive className="h-8 w-8 text-primary mt-1"/>
                <div>
                    <h3 className="font-semibold text-lg">Exam Mode</h3>
                    <p className="text-sm text-muted-foreground">Full station with locked hints and feedback at the end. Simulates the real exam.</p>
                </div>
            </button>
             <button onClick={() => handleModeSelect('practice')} className="p-4 border rounded-lg text-left hover:bg-muted/50 transition flex items-start gap-4 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <Lightbulb className="h-8 w-8 text-muted-foreground mt-1"/>
                <div>
                    <h3 className="font-semibold text-lg text-muted-foreground">Practice Mode</h3>
                    <p className="text-sm text-muted-foreground">Get instant feedback after each question and access hints. (Coming Soon)</p>
                </div>
            </button>
             <button onClick={() => handleModeSelect('review')} className="p-4 border rounded-lg text-left hover:bg-muted/50 transition flex items-start gap-4 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <BookCopy className="h-8 w-8 text-muted-foreground mt-1"/>
                <div>
                    <h3 className="font-semibold text-lg text-muted-foreground">Review Mode</h3>
                    <p className="text-sm text-muted-foreground">Analyze your past performance with transcripts and model answers. (Coming Soon)</p>
                </div>
            </button>
            <button onClick={() => handleModeSelect('drill')} className="p-4 border rounded-lg text-left hover:bg-muted/50 transition flex items-start gap-4 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <Zap className="h-8 w-8 text-muted-foreground mt-1"/>
                <div>
                    <h3 className="font-semibold text-lg text-muted-foreground">Drill Mode</h3>
                    <p className="text-sm text-muted-foreground">Rapid-fire questions on a single competency to build speed. (Coming Soon)</p>
                </div>
            </button>
             <button onClick={() => handleModeSelect('adaptive')} className="p-4 border rounded-lg text-left hover:bg-muted/50 transition flex items-start gap-4 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <Repeat className="h-8 w-8 text-muted-foreground mt-1"/>
                <div>
                    <h3 className="font-semibold text-lg text-muted-foreground">Adaptive Mode</h3>
                    <p className="text-sm text-muted-foreground">Difficulty increases or decreases based on your performance. (Coming Soon)</p>
                </div>
            </button>
        </CardContent>
    </Card>
  )
}
