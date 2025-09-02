
"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateAnagrams, type AnagramGeneratorOutput } from "@/ai/flows/anagram-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Check, X, Sparkles, Trophy, Lightbulb, Repeat } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Zod schema for the topic selection form
const topicFormSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});
type TopicFormValues = z.infer<typeof topicFormSchema>;

// Zod schema for the answer submission form
const answerFormSchema = z.object({
    answer: z.string().min(1, "Please enter your answer."),
});
type AnswerFormValues = z.infer<typeof answerFormSchema>;

export function AnagramSolverClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<AnagramGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = topicFormSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) return { error: "Invalid topic." };
      try {
        const result = await generateAnagrams({ topic: parsed.data.topic });
        return result;
      } catch (e) {
        return { error: "Failed to generate anagrams." };
      }
    },
    null
  );

  const { toast } = useToast();
  
  const [gameState, setGameState] = useState({
      score: 0,
      currentIndex: 0,
      showResult: false,
      isCorrect: false,
  });

  const topicForm = useForm<TopicFormValues>({ resolver: zodResolver(topicFormSchema), defaultValues: { topic: "" } });
  const answerForm = useForm<AnswerFormValues>({ resolver: zodResolver(answerFormSchema), defaultValues: { answer: "" } });

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    } else if (state?.anagrams) {
      // Reset game when new anagrams are loaded
      setGameState({ score: 0, currentIndex: 0, showResult: false, isCorrect: false });
    }
  }, [state, toast]);

  const handleTopicSubmit = topicForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", data.topic);
    startTransition(() => formAction(formData));
  });
  
  const handleAnswerSubmit = answerForm.handleSubmit((data) => {
    if (!state?.anagrams) return;
    const currentAnagram = state.anagrams[gameState.currentIndex];
    const isCorrect = data.answer.trim().toLowerCase() === currentAnagram.answer.toLowerCase();

    setGameState(prev => ({
        ...prev,
        isCorrect,
        showResult: true,
        score: isCorrect ? prev.score + 1 : prev.score,
    }));
  });

  const handleNext = () => {
    setGameState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1, showResult: false }));
    answerForm.reset({ answer: "" });
  };
  
  const handleRestart = () => {
     setGameState({ score: 0, currentIndex: 0, showResult: false, isCorrect: false });
     answerForm.reset({ answer: "" });
  }
  
  const handleNewGame = () => {
    topicForm.reset({ topic: ""});
    // This will effectively clear the anagrams from state, showing the initial topic form
    startTransition(() => formAction(new FormData()));
  }

  const currentAnagram = state?.anagrams?.[gameState.currentIndex];
  const isGameOver = state?.anagrams && gameState.currentIndex >= state.anagrams.length;

  if (isGameOver) {
      return (
         <Card className="text-center">
            <CardHeader>
                <Trophy className="mx-auto h-12 w-12 text-yellow-400"/>
                <CardTitle>Game Over!</CardTitle>
                <CardDescription>You've completed the quiz on {topicForm.getValues('topic')}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-2xl font-bold">Your final score: {gameState.score} / {state.anagrams.length}</p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={handleRestart} variant="secondary"><Repeat className="mr-2"/>Play Again</Button>
                    <Button onClick={handleNewGame}>Start New Game</Button>
                </div>
            </CardContent>
         </Card>
      )
  }

  if (!state?.anagrams || state.anagrams.length === 0) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Generate Anagrams</CardTitle>
          <CardDescription>Enter a topic to generate a new anagram game.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...topicForm}>
            <form onSubmit={handleTopicSubmit} className="space-y-4">
              <FormField name="topic" control={topicForm.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Antibiotics, CNS Drugs..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Game
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Anagram #{gameState.currentIndex + 1} of {state.anagrams.length}</CardTitle>
                <div className="text-lg font-bold">Score: {gameState.score}</div>
            </div>
            <CardDescription>Unscramble the letters below.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
            <div className="p-8 bg-muted rounded-lg">
                <p className="text-4xl font-bold tracking-widest text-primary">{currentAnagram?.anagram}</p>
            </div>
            <Alert>
                <Lightbulb className="h-4 w-4"/>
                <AlertTitle>Clue</AlertTitle>
                <AlertDescription>{currentAnagram?.clue}</AlertDescription>
            </Alert>
            <Form {...answerForm}>
                <form onSubmit={handleAnswerSubmit} className="space-y-4">
                    <FormField name="answer" control={answerForm.control} render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Your answer..." {...field} disabled={gameState.showResult} autoComplete="off" />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    
                    {!gameState.showResult ? (
                        <Button type="submit" className="w-full">Check Answer</Button>
                    ) : (
                        <Button type="button" onClick={handleNext} className="w-full">Next Question</Button>
                    )}
                </form>
            </Form>
            
             {gameState.showResult && (
                <Alert variant={gameState.isCorrect ? "default" : "destructive"} className={gameState.isCorrect ? "border-green-500 bg-green-500/10" : ""}>
                    {gameState.isCorrect ? <Check className="h-4 w-4"/> : <X className="h-4 w-4"/>}
                    <AlertTitle>{gameState.isCorrect ? "Correct!" : "Incorrect!"}</AlertTitle>
                    <AlertDescription>
                        The correct answer is <strong>{currentAnagram?.answer}</strong>.
                    </AlertDescription>
                </Alert>
            )}
        </CardContent>
    </Card>
  )
}
