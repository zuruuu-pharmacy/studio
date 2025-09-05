
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { checkPlagiarism, type PlagiarismResult } from "@/ai/flows/plagiarism-checker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ScanSearch, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const formSchema = z.object({
  text: z.string().min(50, "Text must be at least 50 characters to check for plagiarism."),
});
type FormValues = z.infer<typeof formSchema>;

const getSimilarityColor = (score: number) => {
    if (score > 25) return "bg-destructive text-destructive-foreground";
    if (score > 10) return "bg-amber-500 text-amber-foreground";
    return "bg-green-600 text-green-foreground";
}

export function PlagiarismCheckerClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<PlagiarismResult | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input. Check the form field." };
      }
      try {
        const result = await checkPlagiarism(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to perform plagiarism check. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: "" },
  });

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("text", data.text);
    startTransition(() => formAction(formData));
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Submit Document</CardTitle>
            <CardDescription>Paste your text into the box below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text to Check</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your essay, assignment, or abstract here..."
                          rows={15}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2" />}
                  Check for Plagiarism
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
              <p className="text-muted-foreground">Analyzing document...</p>
            </div>
          </div>
        )}
        
        {state && 'segments' in state ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plagiarism Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Overall Similarity</p>
                    <p className={`text-5xl font-bold ${state.overall_similarity_percentage > 25 ? 'text-destructive' : state.overall_similarity_percentage > 10 ? 'text-amber-500' : 'text-green-600'}`}>
                        {state.overall_similarity_percentage.toFixed(2)}%
                    </p>
                    <Progress value={state.overall_similarity_percentage} className="mt-2" />
                </div>
                <Alert variant={state.overall_similarity_percentage > 15 ? 'destructive' : 'default'}>
                    {state.overall_similarity_percentage > 15 ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                    <AlertTitle>Summary & Recommendation</AlertTitle>
                    <AlertDescription>{state.summary}</AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Detailed Segment Analysis</CardTitle>
                    <CardDescription>Segments from your text with potential matches.</CardDescription>
                </CardHeader>
                <CardContent>
                    {state.segments.length > 0 ? (
                        <div className="space-y-4">
                            {state.segments.map((segment, index) => (
                                <div key={index} className="p-4 border rounded-md">
                                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                        "{segment.original_text}"
                                    </blockquote>
                                    <div className="flex justify-between items-center mt-2 text-sm">
                                        <p><strong>Source:</strong> {segment.source}</p>
                                        <Badge className={getSimilarityColor(segment.similarity_score * 100)}>
                                            {(segment.similarity_score * 100).toFixed(0)}% Match
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center p-8">No specific plagiarized segments found. The document appears to be original.</p>
                    )}
                </CardContent>
            </Card>
          </div>
        ) : (
          !isPending && (
             <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
                <ScanSearch className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Your Report Will Appear Here</h3>
                <p className="text-muted-foreground/80 mt-2">Submit a document to begin the plagiarism check.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
