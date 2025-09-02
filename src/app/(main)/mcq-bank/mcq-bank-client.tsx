
"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateStudyMaterial, type StudyMaterialGeneratorOutput } from "@/ai/flows/study-material-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, HelpCircle, Check, X, Sparkles } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const formSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});
type FormValues = z.infer<typeof formSchema>;

const quizFormSchema = z.object({
    answers: z.array(z.string()),
});
type QuizFormValues = z.infer<typeof quizFormSchema>;

export function McqBankClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<StudyMaterialGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input." };
      }
      try {
        // Reset quiz state when generating new questions
        setQuizState({ submitted: false, score: 0 });
        quizForm.reset({ answers: [] });
        const result = await generateStudyMaterial(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to generate quiz. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "" },
  });

  const quizForm = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: { answers: [] }
  });

  const [quizState, setQuizState] = useState({ submitted: false, score: 0 });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", data.topic);
    startTransition(() => formAction(formData));
  });

  const handleQuizSubmit = quizForm.handleSubmit((data) => {
    if (!state || !('quiz' in state)) return;

    let correctAnswers = 0;
    state.quiz.forEach((mcq, index) => {
      if (data.answers[index] && mcq.correct_answer.startsWith(data.answers[index].charAt(0))) {
        correctAnswers++;
      }
    });

    setQuizState({ submitted: true, score: correctAnswers });
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Generate Quiz</CardTitle>
            <CardDescription>Enter the topic for your practice quiz.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField control={form.control} name="topic" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Topic</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="e.g., Diuretics" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2" />}
                  Generate Quiz
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {isPending && (
            <div className="flex justify-center items-center h-full">
                <div className="text-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Generating your quiz for "{form.getValues('topic')}"...</p>
                    <p className="text-xs text-muted-foreground/70">This might take a moment.</p>
                </div>
            </div>
        )}
        
        {state && 'quiz' in state && state.quiz.length > 0 ? (
          <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Quiz on {state.topic}</CardTitle>
                <CardDescription>Select your answer for each question and submit.</CardDescription>
            </CardHeader>
            <CardContent>
              {quizState.submitted && (
                <Alert className="mb-6 bg-primary/10 border-primary/50">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <AlertTitle>Quiz Result</AlertTitle>
                    <AlertDescription>You scored {quizState.score} out of {state.quiz.length}. Review the explanations below.</AlertDescription>
                </Alert>
              )}

              <Form {...quizForm}>
                <form onSubmit={handleQuizSubmit} className="space-y-6">
                    {state.quiz.map((mcq, index) => (
                        <Card key={index} className="p-4 bg-muted/50">
                            <p className="font-semibold mb-4">{index + 1}. {mcq.question}</p>
                            <FormField
                                control={quizForm.control}
                                name={`answers.${index}`}
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                                disabled={quizState.submitted}
                                            >
                                                {mcq.options.map((option, i) => {
                                                    const isCorrect = mcq.correct_answer.startsWith(option.charAt(0));
                                                    const isSelected = field.value === option;
                                                    
                                                    let itemClass = "";
                                                    if (quizState.submitted) {
                                                        if (isCorrect) itemClass = "text-green-600 font-bold";
                                                        else if (isSelected && !isCorrect) itemClass = "text-red-600 line-through";
                                                    }

                                                    return (
                                                         <FormItem key={i} className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value={option} />
                                                            </FormControl>
                                                            <Label className={`font-normal ${itemClass}`}>
                                                                {option}
                                                            </Label>
                                                        </FormItem>
                                                    )
                                                })}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {quizState.submitted && (
                                <div className="mt-4 p-4 bg-background/70 rounded-lg text-sm">
                                    <p className="font-bold">Correct Answer: {mcq.correct_answer}</p>
                                    <p className="text-muted-foreground whitespace-pre-wrap mt-2">{mcq.explanation}</p>
                                </div>
                            )}
                        </Card>
                    ))}
                    
                    {!quizState.submitted ? (
                         <Button type="submit" className="w-full">Check Answers</Button>
                    ) : (
                        <Button type="button" onClick={handleFormSubmit} className="w-full" disabled={isPending}>
                           {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Generate New Quiz'}
                        </Button>
                    )}
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          !isPending && (
             <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
                <HelpCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Your Quiz Will Appear Here</h3>
                <p className="text-muted-foreground/80 mt-2">Enter a topic to generate a new quiz.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
