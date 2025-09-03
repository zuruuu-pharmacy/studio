
"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateCrossword, type CrosswordGeneratorOutput } from "@/ai/flows/crossword-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Pilcrow, Check, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const topicFormSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
});
type TopicFormValues = z.infer<typeof topicFormSchema>;

type GridState = (string | null)[][];
type CheckState = ('correct' | 'incorrect' | 'unchecked')[][];

export function CrosswordClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<CrosswordGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = topicFormSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) return { error: "Invalid topic." };
      try {
        const result = await generateCrossword({ topic: parsed.data.topic, size: 10, wordCount: 8 });
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to generate crossword. The AI might be having trouble with this topic." };
      }
    },
    null
  );

  const { toast } = useToast();
  const topicForm = useForm<TopicFormValues>({ resolver: zodResolver(topicFormSchema), defaultValues: { topic: "" } });
  
  const [gridState, setGridState] = useState<GridState>([]);
  const [checkState, setCheckState] = useState<CheckState>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    } else if (state?.grid) {
      const size = state.grid.length;
      setGridState(Array(size).fill(null).map(() => Array(size).fill('')));
      setCheckState(Array(size).fill(null).map(() => Array(size).fill('unchecked')));
      setShowAnswers(false);
    }
  }, [state, toast]);

  const handleTopicSubmit = topicForm.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", data.topic);
    startTransition(() => formAction(formData));
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const value = e.target.value.toUpperCase();
    const newGridState = [...gridState];
    newGridState[row][col] = value.slice(-1);
    setGridState(newGridState);

    // Move focus to the next input if a letter is entered
    if (value && e.target.nextElementSibling instanceof HTMLInputElement) {
        e.target.nextElementSibling.focus();
    }
  };

  const handleCheckAnswers = () => {
    if (!state?.grid) return;
    const newCheckState = gridState.map((row, rIdx) => 
        row.map((cell, cIdx) => {
            if (!state.grid[rIdx][cIdx].letter) return 'unchecked';
            return cell === state.grid[rIdx][cIdx].letter ? 'correct' : 'incorrect';
        })
    );
    setCheckState(newCheckState);
    toast({ title: "Answers Checked!", description: "Correct letters are green, incorrect are red." });
  };
  
  const handleRevealAnswers = () => {
     if (!state?.grid) return;
     const newGridState = state.grid.map(row => row.map(cell => cell.letter || ''));
     setGridState(newGridState);
     const newCheckState = state.grid.map(row => row.map(cell => cell.letter ? 'correct' : 'unchecked'));
     setCheckState(newCheckState);
     setShowAnswers(true);
  }

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating your crossword for "{topicForm.getValues('topic')}"...</p>
        <p className="text-xs text-muted-foreground">(This may take up to a minute)</p>
      </div>
    );
  }

  if (!state?.grid) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Generate a Crossword</CardTitle>
          <CardDescription>Enter a topic to generate a new puzzle.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...topicForm}>
            <form onSubmit={handleTopicSubmit} className="space-y-4">
              <FormField name="topic" control={topicForm.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Topic</FormLabel>
                  <FormControl><Input placeholder="e.g., Antihypertensives" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={isPending}>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Game
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle>Crossword: {state.topic}</CardTitle>
                <CardDescription>Fill in the grid based on the clues. Good luck!</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${state.grid.length}, minmax(0, 1fr))` }}>
                {state.grid.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                    <div key={`${rIdx}-${cIdx}`} className="relative aspect-square">
                        {cell.letter ? (
                        <>
                            {cell.number && <span className="absolute top-0 left-0.5 text-xs font-bold text-muted-foreground">{cell.number}</span>}
                            <Input
                            type="text"
                            maxLength={1}
                            value={gridState[rIdx]?.[cIdx] || ''}
                            onChange={(e) => handleInputChange(e, rIdx, cIdx)}
                            className={cn(
                                "w-full h-full p-0 text-center text-lg font-bold uppercase",
                                checkState[rIdx][cIdx] === 'correct' && 'bg-green-200 dark:bg-green-800',
                                checkState[rIdx][cIdx] === 'incorrect' && 'bg-red-200 dark:bg-red-800'
                            )}
                            />
                        </>
                        ) : (
                        <div className="w-full h-full bg-foreground" />
                        )}
                    </div>
                    ))
                )}
                </div>
            </CardContent>
            </Card>
        </div>
        <div>
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Across</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            {state.clues.across.map(c => <li key={`a-${c.number}`}><strong>{c.number}.</strong> {c.clue}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Down</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            {state.clues.down.map(c => <li key={`d-${c.number}`}><strong>{c.number}.</strong> {c.clue}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Alert>
                    <Lightbulb className="h-4 w-4"/>
                    <AlertTitle>Actions</AlertTitle>
                    <AlertDescription>
                        Finished or stuck? Check your answers or give up to see the solution.
                    </AlertDescription>
                    <div className="flex gap-4 mt-4">
                        <Button onClick={handleCheckAnswers} variant="default"><Check className="mr-2"/>Check Answers</Button>
                        <Button onClick={handleRevealAnswers} variant="secondary">Give Up</Button>
                    </div>
                </Alert>
            </div>
        </div>
        </div>
        {showAnswers && (
             <Card>
                <CardHeader><CardTitle>Answers</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Across</h3>
                        <Table>
                            <TableHeader><TableRow><TableHead>#</TableHead><TableHead>Answer</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {state.clues.across.map(c => (
                                    <TableRow key={`ans-a-${c.number}`}>
                                        <TableCell className="font-bold">{c.number}</TableCell>
                                        <TableCell>{c.answer}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Down</h3>
                         <Table>
                            <TableHeader><TableRow><TableHead>#</TableHead><TableHead>Answer</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {state.clues.down.map(c => (
                                    <TableRow key={`ans-d-${c.number}`}>
                                        <TableCell className="font-bold">{c.number}</TableCell>
                                        <TableCell>{c.answer}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
             </Card>
        )}
    </div>
  );
}
