
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
import { Loader2, Search, HelpCircle, Check, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const formSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});
type FormValues = z.infer<typeof formSchema>;


export function McqBankClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<StudyMaterialGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input." };
      }
      try {
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
                <CardDescription>Review the questions and explanations below.</CardDescription>
            </CardHeader>
            <CardContent>
               <Accordion type="multiple" className="w-full space-y-4">
                {state.quiz.map((mcq, index) => (
                      <AccordionItem value={`mcq-${index}`} key={index} className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-left font-semibold hover:no-underline">{mcq.question}</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-4">
                            <ul className="space-y-2">
                              {mcq.options.map((opt, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    {mcq.correct_answer.startsWith(opt.charAt(0)) ? <Check className="h-5 w-5 text-green-500"/> : <X className="h-5 w-5 text-red-500"/>}
                                    <span className={mcq.correct_answer.startsWith(opt.charAt(0)) ? 'font-bold' : ''}>{opt}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="font-semibold">Correct Answer: {mcq.correct_answer}</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">{mcq.explanation}</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
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
