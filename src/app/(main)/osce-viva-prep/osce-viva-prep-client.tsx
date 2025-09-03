
"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateOsceStation, type OsceStationGeneratorOutput, type OsceStationGeneratorInput } from "@/ai/flows/osce-station-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, User, FileText, FlaskConical, Microscope, HeartPulse, ShieldPlus, Activity, Lightbulb, ClipboardCheck, Zap, CaseSensitive, BookCopy, Repeat, Check, X, Forward, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { useOsceSessions } from "@/contexts/osce-sessions-context";
import { useRouter } from "next/navigation";


type Mode = "exam" | "practice" | "review" | "drill" | "adaptive";

type AppStep = 'mode' | 'topic' | 'case' | 'feedback';

// Schemas
const topicFormSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});
type TopicFormValues = z.infer<typeof topicFormSchema>;

const examAnswerFormSchema = z.object({
  answers: z.array(z.object({
    question: z.string(),
    answer: z.string().min(1, "Please provide an answer."),
  })),
});
type ExamAnswerFormValues = z.infer<typeof examAnswerFormSchema>;

const practiceAnswerFormSchema = z.object({
    answer: z.string().min(1, "Please provide an answer."),
});
type PracticeAnswerFormValues = z.infer<typeof practiceAnswerFormSchema>;

// Helper components
function CaseSection({ title, content, icon: Icon }: { title: string, content: string | undefined, icon: React.ElementType }) {
    if (!content) return null;
    return (
        <div>
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-1"><Icon className="h-5 w-5 text-primary"/>{title}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap pl-7">{content}</p>
        </div>
    )
}

function InstantFeedbackCard({ feedback }: { feedback: NonNullable<OsceStationGeneratorOutput['instantFeedback']> }) {
    return (
        <Card className="bg-amber-500/10 border-amber-500">
            <CardHeader>
                <CardTitle className="text-amber-600">Instant Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert variant="default" className="bg-green-500/10 border-green-500/50">
                    <Check className="h-4 w-4 text-green-600"/>
                    <AlertTitle>Strengths</AlertTitle>
                    <AlertDescription>{feedback.strengths}</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                    <X className="h-4 w-4"/>
                    <AlertTitle>Priority Fix</AlertTitle>
                    <AlertDescription>{feedback.priorityFix}</AlertDescription>
                </Alert>
                {feedback.safeAlternative && (
                     <Alert variant="default">
                        <Lightbulb className="h-4 w-4"/>
                        <AlertTitle>Suggestion</AlertTitle>
                        <AlertDescription>{feedback.safeAlternative}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}

export function OsceVivaPrepClient() {
  const [isPending, startTransition] = useTransition();
  const { addSession } = useOsceSessions();
  const router = useRouter();
  
  const [state, formAction] = useActionState<OsceStationGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const topic = formData.get("topic") as string;
      const caseDetails = formData.get("caseDetails") ? JSON.parse(formData.get("caseDetails") as string) : undefined;
      
      // Check for exam mode answers
      const examAnswers: { question: string, answer: string }[] = [];
      let i = 0;
      while (formData.has(`answers[${i}].question`)) {
        examAnswers.push({
          question: formData.get(`answers[${i}].question`) as string,
          answer: formData.get(`answers[${i}].answer`) as string,
        });
        i++;
      }

      // Check for practice mode answer
      const practiceAnswerQuestion = formData.get("practiceAnswer[question]");
      const practiceAnswerAnswer = formData.get("practiceAnswer[answer]");
      const practiceAnswer = practiceAnswerQuestion && practiceAnswerAnswer ? { question: practiceAnswerQuestion.toString(), answer: practiceAnswerAnswer.toString() } : undefined;

      try {
        const result = await generateOsceStation({
          topic,
          studentAnswers: examAnswers.length > 0 ? examAnswers : undefined,
          practiceAnswer: practiceAnswer,
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
  const [appStep, setAppStep] = useState<AppStep>('mode');
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  
  // State for practice mode
  const [practiceStep, setPracticeStep] = useState(0);
  const [practiceFeedback, setPracticeFeedback] = useState<OsceStationGeneratorOutput['instantFeedback'] | null>(null);


  const topicForm = useForm<TopicFormValues>({ resolver: zodResolver(topicFormSchema), defaultValues: { topic: "" } });
  const examAnswerForm = useForm<ExamAnswerFormValues>({ defaultValues: { answers: [] } });
  const practiceAnswerForm = useForm<PracticeAnswerFormValues>({ resolver: zodResolver(practiceAnswerFormSchema), defaultValues: { answer: "" }});


  useEffect(() => {
    if (state) {
      if ('error' in state) {
        toast({ variant: "destructive", title: "Error", description: state.error });
      } else if (state.caseDetails && state.questions) {
        examAnswerForm.reset({ answers: state.questions.map(q => ({ question: q.question, answer: '' })) });
        setAppStep('case');
      } else if (state.feedback) { // Exam mode feedback
        setAppStep('feedback');
      } else if (state.instantFeedback) { // Practice mode feedback
        setPracticeFeedback(state.instantFeedback);
      }
    }
  }, [state, toast, examAnswerForm]);

  const handleModeSelect = (mode: Mode) => {
    if (mode === 'exam' || mode === 'practice') {
        setSelectedMode(mode);
        setAppStep('topic');
    } else if (mode === 'review') {
        router.push('/osce-viva-prep?mode=review');
    }
    else {
        toast({ title: "Coming Soon", description: "This mode is currently under development."});
    }
  }

  const handleTopicSubmit = topicForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", data.topic);
    startTransition(() => formAction(formData));
  });

  const handleExamAnswerSubmit = examAnswerForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", topicForm.getValues("topic"));
    formData.append("caseDetails", JSON.stringify(state?.caseDetails));
    data.answers.forEach((ans, i) => {
      formData.append(`answers[${i}].question`, ans.question);
      formData.append(`answers[${i}].answer`, ans.answer);
    });
    startTransition(() => formAction(formData));
  });

  const handlePracticeAnswerSubmit = practiceAnswerForm.handleSubmit((data) => {
      if(!state?.caseDetails || !state?.questions) return;
      const currentQuestion = state.questions[practiceStep];

      const formData = new FormData();
      formData.append("topic", topicForm.getValues("topic"));
      formData.append("caseDetails", JSON.stringify(state.caseDetails));
      formData.append("practiceAnswer[question]", currentQuestion.question);
      formData.append("practiceAnswer[answer]", data.answer);
      startTransition(() => formAction(formData));
  });

  const handleNextPracticeQuestion = () => {
    practiceAnswerForm.reset({ answer: ""});
    setPracticeFeedback(null);
    setPracticeStep(prev => prev + 1);
  }
  
  const handleSaveSession = () => {
    if (!state || !state.feedback || !state.caseDetails) return;
    
    const sessionData: OsceStationGeneratorInput = {
        topic: topicForm.getValues("topic"),
        studentAnswers: examAnswerForm.getValues("answers"),
        caseDetails: state.caseDetails,
    }

    addSession({
        id: `session_${Date.now()}`,
        topic: topicForm.getValues("topic"),
        date: new Date().toISOString(),
        input: sessionData,
        output: state,
    });
    toast({ title: "Session Saved!", description: "You can review this session in Review Mode." });
    resetAll();
  }

  const resetAll = () => {
    topicForm.reset({ topic: ""});
    setAppStep('mode');
    setSelectedMode(null);
    setPracticeStep(0);
    setPracticeFeedback(null);
    // Important: Clear the AI state to avoid re-rendering old data
    const formData = new FormData();
    formData.append("topic", "reset"); // A dummy value to trigger a state clear
    startTransition(() => formAction(formData));
  }

  // ==== RENDER LOGIC ====

  if (isPending) {
    return (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating your OSCE Station...</p>
        </div>
    )
  }

  // Final Feedback View (Exam Mode)
  if (appStep === 'feedback' && state?.feedback) {
    return (
        <Card>
            <CardHeader><CardTitle className="text-2xl">Case Feedback & Analysis</CardTitle><CardDescription>Review the AI-powered evaluation of your answers for the {selectedMode} mode.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
                 <Alert variant="default" className="bg-primary/10 border-primary/50"><ClipboardCheck className="h-4 w-4 text-primary" /><AlertTitle>Overall Feedback</AlertTitle><AlertDescription>{state.feedback.overallFeedback}</AlertDescription></Alert>
                <Accordion type="multiple" className="w-full space-y-4" defaultValue={['diagnosis', 'drugs', 'monitoring', 'counseling']}><AccordionItem value="diagnosis"><AccordionTrigger className="font-semibold text-lg">Diagnosis Confirmation</AccordionTrigger><AccordionContent className="p-4">{state.feedback.diagnosisConfirmation}</AccordionContent></AccordionItem><AccordionItem value="drugs"><AccordionTrigger className="font-semibold text-lg">Drug Choice Rationale</AccordionTrigger><AccordionContent className="p-4">{state.feedback.drugChoiceRationale}</AccordionContent></AccordionItem><AccordionItem value="monitoring"><AccordionTrigger className="font-semibold text-lg">Monitoring Plan</AccordionTrigger><AccordionContent className="p-4">{state.feedback.monitoringPlan}</AccordionContent></AccordionItem><AccordionItem value="counseling"><AccordionTrigger className="font-semibold text-lg">Lifestyle Counseling</AccordionTrigger><AccordionContent className="p-4">{state.feedback.lifestyleCounseling}</AccordionContent></AccordionItem></Accordion>
                <div className="flex gap-4">
                    <Button onClick={handleSaveSession}><Save className="mr-2"/>Save Session for Review</Button>
                    <Button onClick={resetAll} variant="outline">Start a New Station</Button>
                </div>
            </CardContent>
        </Card>
    )
  }
  
  // Main Case View
  if (appStep === 'case' && state?.caseDetails && state?.questions) {
    const { caseDetails, questions } = state;
    const isPracticeFinished = selectedMode === 'practice' && practiceStep >= questions.length;
    
    // Practice mode finished summary
    if (isPracticeFinished) {
        return (
            <Card className="text-center">
                <CardHeader>
                    <CardTitle>Station Complete!</CardTitle>
                    <CardDescription>You have completed all questions for this practice station on "{topicForm.getValues("topic")}".</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={resetAll}>Start a New Station</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle className="text-2xl">OSCE Station: {topicForm.getValues("topic")}</CardTitle><CardDescription>Mode: {selectedMode} | Read the case and answer the questions.</CardDescription></CardHeader>
                <CardContent className="p-6 bg-muted/50 space-y-4 rounded-b-lg">
                    <CaseSection title="Patient Demographics" content={caseDetails.demographics} icon={User}/><CaseSection title="Chief Complaint" content={caseDetails.chiefComplaint} icon={FileText}/><CaseSection title="History of Present Illness" content={caseDetails.hpi} icon={Activity}/><CaseSection title="Past Medical & Family History" content={caseDetails.pmh} icon={ShieldPlus}/><CaseSection title="Current Medications & Allergies" content={caseDetails.medications} icon={FlaskConical}/><CaseSection title="Physical Examination" content={caseDetails.examination} icon={HeartPulse}/><CaseSection title="Lab & Diagnostics" content={caseDetails.labs} icon={Microscope}/>
                </CardContent>
            </Card>
            
            {/* EXAM MODE RENDER */}
            {selectedMode === 'exam' && (
                 <Card>
                    <CardHeader><CardTitle>Questions</CardTitle></CardHeader>
                    <CardContent>
                        <Form {...examAnswerForm}>
                            <form onSubmit={handleExamAnswerSubmit} className="space-y-6">
                               {questions.map((q, index) => (<FormField key={index} name={`answers.${index}.answer`} control={examAnswerForm.control} render={({ field }) => (<FormItem className="p-4 border rounded-lg"><FormLabel className="font-semibold text-base">{q.question}</FormLabel><FormControl>{q.type === 'multiple_choice' && q.options ? (<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="pt-2 space-y-1">{q.options.map((opt, i) => (<FormItem key={i} className="flex items-center space-x-3"><FormControl><RadioGroupItem value={opt}/></FormControl><Label className="font-normal">{opt}</Label></FormItem>))}</RadioGroup>) : (<Textarea placeholder="Your detailed answer..." {...field}/>)}</FormControl><FormMessage/><FormField name={`answers.${index}.question`} control={examAnswerForm.control} defaultValue={q.question} render={({ field }) => <input type="hidden" {...field} />}/></FormItem>)}/>))}
                               <Button type="submit" disabled={isPending}>Submit for Feedback</Button>
                            </form>
                        </Form>
                    </CardContent>
                 </Card>
            )}

            {/* PRACTICE MODE RENDER */}
            {selectedMode === 'practice' && (
                <Card>
                    <CardHeader><CardTitle>Question {practiceStep + 1} of {questions.length}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="font-semibold text-lg p-4 bg-muted/50 rounded-lg">{questions[practiceStep].question}</p>
                        <Form {...practiceAnswerForm}>
                            <form onSubmit={handlePracticeAnswerSubmit} className="space-y-4">
                                <FormField name="answer" control={practiceAnswerForm.control} render={({ field }) => (
                                    <FormItem><FormControl>{questions[practiceStep].type === 'multiple_choice' && questions[practiceStep].options ? (<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="pt-2 space-y-1">{questions[practiceStep].options?.map((opt, i) => (<FormItem key={i} className="flex items-center space-x-3"><FormControl><RadioGroupItem value={opt}/></FormControl><Label className="font-normal">{opt}</Label></FormItem>))}</RadioGroup>) : (<Textarea placeholder="Your answer..." {...field}/>)}</FormControl><FormMessage/></FormItem>
                                )} />
                                <Button type="submit" disabled={isPending || !!practiceFeedback}>Check Answer</Button>
                            </form>
                        </Form>

                        {practiceFeedback && (
                            <div className="space-y-4 pt-4">
                                <InstantFeedbackCard feedback={practiceFeedback}/>
                                <Button onClick={handleNextPracticeQuestion} className="w-full"><Forward className="mr-2"/>Next Question</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
  }

  // Topic Selection Step
  if (appStep === 'topic') {
    return (
        <Card className="max-w-xl mx-auto">
        <CardHeader><CardTitle>Generate OSCE Station</CardTitle><CardDescription>Enter a topic, domain, or scenario for your {selectedMode} session.</CardDescription></CardHeader>
        <CardContent>
            <Form {...topicForm}><form onSubmit={handleTopicSubmit} className="space-y-4"><FormField name="topic" control={topicForm.control} render={({ field }) => (<FormItem><FormLabel>Station Topic</FormLabel><FormControl><Input placeholder="e.g., Patient Counseling for Inhalers" {...field}/></FormControl><FormMessage/></FormItem>)} /><Button type="submit" className="w-full" disabled={isPending}>{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}Generate Station</Button><Button variant="link" onClick={() => setAppStep('mode')} className="w-full">Back to Mode Selection</Button></form></Form>
        </CardContent>
        </Card>
    );
  }
  
  // Default step: Mode selection
  return (
    <Card>
        <CardHeader><CardTitle>Select a Practice Mode</CardTitle><CardDescription>Choose how you want to prepare for your OSCE or Viva.</CardDescription></CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button onClick={() => handleModeSelect('exam')} className="p-4 border rounded-lg text-left hover:bg-muted/50 transition flex items-start gap-4"><CaseSensitive className="h-8 w-8 text-primary mt-1"/><div><h3 className="font-semibold text-lg">Exam Mode</h3><p className="text-sm text-muted-foreground">Full station with locked hints and feedback at the end. Simulates the real exam.</p></div></button>
            <button onClick={() => handleModeSelect('practice')} className="p-4 border rounded-lg text-left hover:bg-muted/50 transition flex items-start gap-4"><Lightbulb className="h-8 w-8 text-primary mt-1"/><div><h3 className="font-semibold text-lg">Practice Mode</h3><p className="text-sm text-muted-foreground">Get instant feedback after each question and access hints.</p></div></button>
            <button onClick={() => handleModeSelect('review')} className="p-4 border rounded-lg text-left hover:bg-muted/50 transition flex items-start gap-4"><BookCopy className="h-8 w-8 text-primary mt-1"/><div><h3 className="font-semibold text-lg">Review Mode</h3><p className="text-sm text-muted-foreground">Analyze your past performance with transcripts and model answers.</p></div></button>
            <button onClick={() => handleModeSelect('drill')} className="p-4 border rounded-lg text-left hover:bg-muted/50 transition flex items-start gap-4 disabled:opacity-50 disabled:cursor-not-allowed" disabled><Zap className="h-8 w-8 text-muted-foreground mt-1"/><div><h3 className="font-semibold text-lg text-muted-foreground">Drill Mode</h3><p className="text-sm text-muted-foreground">Rapid-fire short items on a single competency. (Coming Soon)</p></div></button>
            <button onClick={() => handleModeSelect('adaptive')} className="p-4 border rounded-lg text-left hover:bg-muted/50 transition flex items-start gap-4 disabled:opacity-50 disabled:cursor-not-allowed" disabled><Repeat className="h-8 w-8 text-muted-foreground mt-1"/><div><h3 className="font-semibold text-lg text-muted-foreground">Adaptive Mode</h3><p className="text-sm text-muted-foreground">Difficulty increases or decreases based on performance. (Coming Soon)</p></div></button>
        </CardContent>
    </Card>
  )
}
