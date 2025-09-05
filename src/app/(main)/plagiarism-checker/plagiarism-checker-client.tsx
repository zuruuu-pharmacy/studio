
"use client";

import { useActionState, useEffect, useTransition, useState, useRef, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { checkPlagiarism, type PlagiarismResult } from "@/ai/flows/plagiarism-checker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ScanSearch, CheckCircle, AlertTriangle, ShieldCheck, Upload, Lightbulb, Bot, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  documentFile: z
    .any()
    .refine((files) => files?.length === 1, "A document file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) =>
        [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
          "image/jpeg",
          "image/png",
          "image/webp",
        ].includes(files?.[0]?.type),
      "Only .pdf, .docx, .txt, and image files are supported."
    ),
});
type FormValues = z.infer<typeof formSchema>;

const getSimilarityBadge = (score: number) => {
    if (score > 25) return "destructive";
    if (score > 10) return "default";
    return "secondary";
}

const getSimilarityBadgeClass = (score: number) => {
     if (score > 25) return "bg-destructive text-destructive-foreground";
    if (score > 10) return "bg-amber-500 text-amber-foreground";
    return "bg-green-600 text-green-foreground";
}

const getSimilarityLabel = (score: number) => {
    if (score > 25) return "High Similarity - Revision Required";
    if (score > 10) return "Medium Similarity - Review Suggested";
    return "Low Similarity - Original Work";
}

export function PlagiarismCheckerClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<PlagiarismResult | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const file = formData.get('documentFile') as File;
      if (!file) {
        return { error: "File not provided." };
      }

      try {
         const documentDataUri = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        const result = await checkPlagiarism({ documentDataUri });
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
    defaultValues: { documentFile: undefined },
  });
  const fileRef = form.register("documentFile");


  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("documentFile", data.documentFile[0]);
    startTransition(() => formAction(formData));
  });

  const topSources = useMemo(() => {
    if (!state || !('segments' in state)) return [];
    
    const sourceCounts: { [key: string]: { count: number, totalScore: number } } = {};
    state.segments.forEach(segment => {
        if (!sourceCounts[segment.source]) {
            sourceCounts[segment.source] = { count: 0, totalScore: 0 };
        }
        sourceCounts[segment.source].count++;
        sourceCounts[segment.source].totalScore += segment.similarity_score;
    });

    const overallTotalScore = state.segments.reduce((acc, seg) => acc + seg.similarity_score, 1);

    return Object.entries(sourceCounts)
        .map(([source, data]) => ({
            name: source,
            percentage: (data.totalScore / overallTotalScore) * state.overall_similarity_percentage
        }))
        .sort((a,b) => b.percentage - a.percentage)
        .slice(0, 5); // Get top 5 sources

  }, [state]);

  return (
    <div className="grid md:grid-cols-3 gap-6 items-start">
      <div className="md:col-span-1 sticky top-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Document</CardTitle>
            <CardDescription>Upload your file. We’ll scan for overlap and help you fix issues before submission.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="documentFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document File (PDF, DOCX, TXT, Image)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.docx,.txt,image/*"
                          {...fileRef}
                          onChange={(e) => field.onChange(e.target.files)}
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
              <p className="text-muted-foreground">We’re checking your document — this may take up to 90s (longer for scanned pages)...</p>
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
                <div className="text-center p-4 rounded-lg bg-muted flex items-center justify-center gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground">Overall Similarity</p>
                        <p className={`text-6xl font-bold ${getSimilarityBadgeClass(state.overall_similarity_percentage).split(' ')[0]}`}>
                            {state.overall_similarity_percentage.toFixed(0)}%
                        </p>
                    </div>
                     <Badge className={`px-4 py-2 text-base ${getSimilarityBadgeClass(state.overall_similarity_percentage)}`}>{getSimilarityLabel(state.overall_similarity_percentage)}</Badge>
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
                    <CardTitle>Top Matched Sources</CardTitle>
                    <CardDescription>The primary sources contributing to the similarity score.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Contribution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topSources.map(source => (
                          <TableRow key={source.name}>
                            <TableCell className="font-medium flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 text-muted-foreground"/>
                                {source.name}
                            </TableCell>
                            <TableCell className="text-right font-bold">{source.percentage.toFixed(1)}%</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                   </Table>
                </CardContent>
            </Card>

            {state.writing_suggestions && state.writing_suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bot /> AI Writing Assistant</CardTitle>
                  <CardDescription>Suggestions to improve grammar, clarity, and style.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.writing_suggestions.map((item, index) => (
                    <div key={index} className="p-3 border rounded-md">
                        <Badge variant="secondary" className="mb-2">{item.type}</Badge>
                        <p className="text-sm text-muted-foreground line-through">"{item.original_text}"</p>
                        <p className="text-sm text-primary font-medium mt-1">"{item.suggestion}"</p>
                        <p className="text-xs text-muted-foreground mt-2"><strong>Reason:</strong> {item.explanation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
                 <CardHeader>
                    <CardTitle>Detailed Segment Analysis</CardTitle>
                    <CardDescription>Segments from your text with potential matches. Review and fix these issues before submitting.</CardDescription>
                </CardHeader>
                <CardContent>
                    {state.segments.length > 0 ? (
                        <div className="space-y-4">
                            {state.segments.map((segment, index) => (
                                <div key={index} className="p-4 border rounded-md space-y-3">
                                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                        "{segment.original_text}"
                                    </blockquote>
                                    <div className="flex justify-between items-center mt-2 text-sm">
                                        <p><strong>Source:</strong> {segment.source}</p>
                                        <Badge variant={getSimilarityBadge(segment.similarity_score * 100)}>
                                            {(segment.similarity_score * 100).toFixed(0)}% Match
                                        </Badge>
                                    </div>
                                    {segment.remediation_suggestion && (
                                         <Alert variant="default" className="bg-amber-500/10 border-amber-500/50">
                                            <Lightbulb className="h-4 w-4 text-amber-600"/>
                                            <AlertTitle className="text-amber-700">AI Suggestion</AlertTitle>
                                            <AlertDescription>
                                            {segment.remediation_suggestion}
                                            </AlertDescription>
                                        </Alert>
                                    )}
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
