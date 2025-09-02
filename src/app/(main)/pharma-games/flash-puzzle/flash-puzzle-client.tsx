
"use client";

import { useActionState, useEffect, useState, useTransition, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateMatchingGame, type MatchingGameOutput } from "@/ai/flows/matching-game-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Trophy, Shuffle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";


const topicFormSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});
type TopicFormValues = z.infer<typeof topicFormSchema>;

type GameItem = { id: number; value: string; };

export function FlashPuzzleClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<MatchingGameOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = topicFormSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) return { error: "Invalid topic." };
      try {
        const result = await generateMatchingGame({ topic: parsed.data.topic });
        return result;
      } catch (e) {
        return { error: "Failed to generate a matching game for this topic." };
      }
    },
    null
  );

  const { toast } = useToast();
  const topicForm = useForm<TopicFormValues>({ resolver: zodResolver(topicFormSchema), defaultValues: { topic: "" } });
  
  const [column1, setColumn1] = useState<GameItem[]>([]);
  const [column2, setColumn2] = useState<GameItem[]>([]);
  const [selection1, setSelection1] = useState<GameItem | null>(null);
  const [correctPairs, setCorrectPairs] = useState<Set<number>>(new Set());
  const [incorrectPair, setIncorrectPair] = useState<[number, number] | null>(null);
  const [score, setScore] = useState(0);

  const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    } else if (state?.pairs) {
      const items1 = state.pairs.map((p, i) => ({ id: i, value: p.item1 }));
      const items2 = state.pairs.map((p, i) => ({ id: i, value: p.item2 }));
      setColumn1(items1);
      setColumn2(shuffleArray(items2));
      setSelection1(null);
      setCorrectPairs(new Set());
      setIncorrectPair(null);
      setScore(0);
    }
  }, [state, toast]);

  const handleTopicSubmit = topicForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", data.topic);
    startTransition(() => formAction(formData));
  });

  const handleColumn1Select = (item: GameItem) => {
    if (correctPairs.has(item.id)) return;
    setSelection1(item);
    setIncorrectPair(null);
  };

  const handleColumn2Select = (item2: GameItem) => {
    if (!selection1) return; // Must select from column 1 first
    
    if (selection1.id === item2.id) { // Correct match
      setCorrectPairs(prev => new Set(prev).add(selection1.id));
      setScore(prev => prev + 1);
      setSelection1(null);
      setIncorrectPair(null);
    } else { // Incorrect match
      setIncorrectPair([selection1.id, item2.id]);
      setSelection1(null);
    }
  };
  
  const handleRestart = () => {
    if (!state?.pairs) return;
    const items2 = state.pairs.map((p, i) => ({ id: i, value: p.item2 }));
    setColumn2(shuffleArray(items2));
    setSelection1(null);
    setCorrectPairs(new Set());
    setIncorrectPair(null);
    setScore(0);
  }
  
  const handleNewGame = () => {
    topicForm.reset({ topic: ""});
    startTransition(() => formAction(new FormData()));
  }

  const isGameOver = state?.pairs && correctPairs.size === state.pairs.length;

  if (isGameOver) {
      return (
         <Card className="text-center max-w-lg mx-auto">
            <CardHeader><Trophy className="mx-auto h-12 w-12 text-yellow-400"/><CardTitle>Congratulations!</CardTitle><CardDescription>You matched all the pairs for {state.topic}.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <p className="text-2xl font-bold">Your final score: {score} / {state.pairs.length}</p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={handleRestart} variant="secondary"><Shuffle className="mr-2"/>Play Again</Button>
                    <Button onClick={handleNewGame}>Start New Game</Button>
                </div>
            </CardContent>
         </Card>
      )
  }

  if (!state?.pairs || state.pairs.length === 0) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardHeader><CardTitle>Generate a Matching Game</CardTitle><CardDescription>Enter a topic to create pairs for matching.</CardDescription></CardHeader>
        <CardContent>
          <Form {...topicForm}>
            <form onSubmit={handleTopicSubmit} className="space-y-4">
              <FormField name="topic" control={topicForm.control} render={({ field }) => (
                <FormItem><FormLabel>Game Topic</FormLabel><FormControl><Input placeholder="e.g., Painkillers" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={isPending}>{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}Generate Game</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
        <Card><CardHeader><CardTitle>Matching Game: {state.topic}</CardTitle><CardDescription>Score: {score} / {state.pairs.length}</CardDescription></CardHeader></Card>
        {incorrectPair && <p className="text-center text-destructive font-semibold">That's not a match. Try again!</p>}
        <div className="grid grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-2">
                <h3 className="font-bold text-center">{state.column1Title}</h3>
                {column1.map(item => (
                    <Button
                        key={item.id}
                        variant={correctPairs.has(item.id) ? 'default' : selection1?.id === item.id ? 'secondary' : 'outline'}
                        className={cn("w-full h-auto min-h-12 py-2 text-wrap", 
                            correctPairs.has(item.id) && "bg-green-600 hover:bg-green-700",
                            incorrectPair?.[0] === item.id && "bg-red-200 border-red-500 text-red-900 animate-pulse"
                        )}
                        onClick={() => handleColumn1Select(item)}
                        disabled={correctPairs.has(item.id)}
                    >
                         {correctPairs.has(item.id) && <Check className="mr-2"/>} {item.value}
                    </Button>
                ))}
            </div>
            {/* Column 2 */}
            <div className="space-y-2">
                <h3 className="font-bold text-center">{state.column2Title}</h3>
                 {column2.map(item => (
                    <Button
                        key={item.id}
                        variant={correctPairs.has(item.id) ? 'default' : 'outline'}
                        className={cn("w-full h-auto min-h-12 py-2 text-wrap", 
                            correctPairs.has(item.id) && "bg-green-600 hover:bg-green-700",
                            incorrectPair?.[1] === item.id && "bg-red-200 border-red-500 text-red-900 animate-pulse"
                        )}
                        onClick={() => handleColumn2Select(item)}
                        disabled={!selection1 || correctPairs.has(item.id)}
                    >
                         {correctPairs.has(item.id) && <Check className="mr-2"/>} {item.value}
                    </Button>
                ))}
            </div>
        </div>
    </div>
  )
}
