
"use client";

import { useActionState, useEffect, useState, useTransition, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateStudyMaterial, type StudyMaterialGeneratorOutput } from "@/ai/flows/study-material-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Trophy, Timer, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const topicFormSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});
type TopicFormValues = z.infer<typeof topicFormSchema>;

const GAME_DURATION = 30; // 30 seconds

export function RapidFireQuizClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<StudyMaterialGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = topicFormSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) return { error: "Invalid topic." };
      try {
        const result = await generateStudyMaterial(parsed.data);
        return result;
      } catch (e) {
        return { error: "Failed to generate quiz." };
      }
    },
    null
  );

  const { toast } = useToast();
  const topicForm = useForm<TopicFormValues>({ resolver: zodResolver(topicFormSchema), defaultValues: { topic: "" } });

  const [gameState, setGameState] = useState({
    status: 'idle', // 'idle', 'playing', 'finished'
    score: 0,
    currentIndex: 0,
    timeLeft: GAME_DURATION,
    answerStatus: 'none', // 'none', 'correct', 'incorrect'
  });

  const questions = state && 'quiz' in state ? state.quiz : [];

  const handleNextQuestion = useCallback(() => {
    setGameState(prev => {
      if (prev.currentIndex + 1 >= questions.length) {
        return { ...prev, status: 'finished' };
      }
      return { ...prev, currentIndex: prev.currentIndex + 1, answerStatus: 'none' };
    });
  }, [questions.length]);

  useEffect(() => {
    if (gameState.status !== 'playing') return;

    if (gameState.timeLeft <= 0) {
      setGameState(prev => ({ ...prev, status: 'finished' }));
      return;
    }

    const timer = setInterval(() => {
      setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status, gameState.timeLeft]);

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
      setGameState(prev => ({ ...prev, status: 'idle' }));
    } else if (state?.quiz) {
      setGameState({ status: 'playing', score: 0, currentIndex: 0, timeLeft: GAME_DURATION, answerStatus: 'none' });
    }
  }, [state, toast]);

  const handleTopicSubmit = topicForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", data.topic);
    startTransition(() => formAction(formData));
  });

  const handleAnswerClick = (option: string) => {
    if (gameState.answerStatus !== 'none') return;
    
    const isCorrect = questions[gameState.currentIndex]?.correct_answer.startsWith(option.charAt(0));
    setGameState(prev => ({
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        answerStatus: isCorrect ? 'correct' : 'incorrect',
    }));

    setTimeout(handleNextQuestion, 1000); // Automatically move to next question after 1 second
  };

  const handleRestart = () => {
    const topic = topicForm.getValues("topic");
    handleTopicSubmit({ topic });
  };
  
  const handleNewGame = () => {
    topicForm.reset({ topic: ""});
    setGameState({ status: 'idle', score: 0, currentIndex: 0, timeLeft: GAME_DURATION, answerStatus: 'none' });
    // Clear the state to show the topic form
    startTransition(() => formAction(new FormData()));
  }

  if (gameState.status === 'finished') {
    return (
      <Card className="text-center max-w-lg mx-auto">
        <CardHeader><Trophy className="mx-auto h-12 w-12 text-yellow-400"/><CardTitle>Time's Up!</CardTitle><CardDescription>You completed the quiz on {topicForm.getValues('topic')}.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
            <p className="text-2xl font-bold">Your final score: {gameState.score}</p>
            <div className="flex gap-4 justify-center">
                <Button onClick={handleRestart} variant="secondary">Play Again</Button>
                <Button onClick={handleNewGame}>Start New Topic</Button>
            </div>
        </CardContent>
      </Card>
    );
  }

  if (gameState.status === 'playing' && questions.length > 0) {
    const currentQuestion = questions[gameState.currentIndex];
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Rapid Fire: {state?.topic}</CardTitle>
                    <div className="flex items-center gap-2 font-bold text-lg"><Timer className="h-5 w-5"/> {gameState.timeLeft}s</div>
                </div>
                <Progress value={(gameState.timeLeft / GAME_DURATION) * 100} />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg min-h-[100px] flex items-center justify-center">
                    <p className="text-center font-semibold text-lg">{currentQuestion.question}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, i) => {
                        const isSelected = gameState.answerStatus !== 'none' && currentQuestion.correct_answer.startsWith(option.charAt(0));
                        const isCorrect = currentQuestion.correct_answer.startsWith(option.charAt(0));

                        return (
                             <Button
                                key={i}
                                variant="outline"
                                className={cn(
                                    "h-auto py-4 text-wrap justify-start",
                                    gameState.answerStatus === 'correct' && isCorrect && "bg-green-100 border-green-500 text-green-800",
                                    gameState.answerStatus === 'incorrect' && isSelected && "bg-red-100 border-red-500 text-red-800"
                                )}
                                onClick={() => handleAnswerClick(option)}
                                disabled={gameState.answerStatus !== 'none'}
                             >
                                 {gameState.answerStatus === 'correct' && isCorrect && <Check className="mr-2"/>}
                                 {gameState.answerStatus === 'incorrect' && isSelected && <X className="mr-2"/>}
                                 {option}
                             </Button>
                        )
                    })}
                </div>
                <p className="text-center text-muted-foreground">Score: {gameState.score}</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Start Rapid Fire Quiz</CardTitle>
        <CardDescription>Enter a topic to begin the timed challenge.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...topicForm}>
          <form onSubmit={handleTopicSubmit} className="space-y-4">
            <FormField name="topic" control={topicForm.control} render={({ field }) => (
              <FormItem><FormLabel>Game Topic</FormLabel><FormControl><Input placeholder="e.g., Antifungals" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={isPending}>{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}Start Game</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
