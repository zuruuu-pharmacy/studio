
"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { simulateClinicalCase, type ClinicalCaseSimulatorOutput } from "@/ai/flows/clinical-case-simulator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, User, FileText, FlaskConical, Microscope, HeartPulse, ShieldPlus, Activity, Lightbulb, ClipboardCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

// Step 1 Form: Topic Selection
const topicFormSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});
type TopicFormValues = z.infer<typeof topicFormSchema>;

// Step 2 Form: Answering Questions
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

export function ClinicalCaseSimulatorClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<ClinicalCaseSimulatorOutput | { error: string } | null, FormData>(
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
        const result = await simulateClinicalCase({
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
  const [step, setStep] = useState<'topic' | 'case' | 'feedback'>('topic');

  const topicForm = useForm<TopicFormValues>({ resolver: zodResolver(topicFormSchema) });
  const answerForm = useForm<AnswerFormValues>();

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
    setStep('topic');
  }

  // Loading spinner
  if (isPending) {
    return (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating your clinical case...</p>
        </div>
    )
  }

  // Step 3: Feedback View
  if (step === 'feedback' && state?.feedback) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Case Feedback & Analysis</CardTitle>
                <CardDescription>Review the AI-powered evaluation of your answers.</CardDescription>
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
                <Button onClick={resetAll}>Start a New Case</Button>
            </CardContent>
        </Card>
    )
  }

  // Step 2: Case View
  if (step === 'case' && state?.caseDetails && state?.questions) {
    const { caseDetails, questions } = state;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Clinical Case: {topicForm.getValues("topic")}</CardTitle>
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
                       <Button type="submit" disabled={isPending}>Submit Answers for Feedback</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
  }

  // Step 1: Topic Selection
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Generate a Clinical Case</CardTitle>
        <CardDescription>Enter a topic to generate a new case study.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...topicForm}>
          <form onSubmit={handleTopicSubmit} className="space-y-4">
            <FormField name="topic" control={topicForm.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Case Topic</FormLabel>
                <FormControl><Input placeholder="e.g., Hypertension, Diabetes, Asthma" {...field}/></FormControl>
                <FormMessage/>
              </FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
              Generate Case
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
