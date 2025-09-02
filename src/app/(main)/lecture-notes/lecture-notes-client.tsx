
"use client";

import { useTransition, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyzeLectureNotes, LectureNotesAnalyzerOutputSchema, type LectureNotesAnalyzerOutput } from "@/ai/flows/lecture-notes-analyzer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, ScanEye, BookOpen, BrainCircuit, Bot, BadgeInfo, Milestone, Sigma, FileText, CheckCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const formSchema = z.object({
  topicName: z.string().min(3, "Please provide a topic name."),
  noteFile: z.any().refine(file => file?.length === 1, "A file is required."),
});
type FormValues = z.infer<typeof formSchema>;

export function LectureNotesClient() {
  const [state, setState] = useState<LectureNotesAnalyzerOutput | { error: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({ variant: "destructive", title: "Error", description: "File size exceeds 4MB limit." });
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const formAction = async (data: FormValues) => {
    const file = data.noteFile[0];
    if (!file) {
      setState({ error: "Please upload a notes file." });
      return;
    }

    try {
      const noteDataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const result = await analyzeLectureNotes({ topicName: data.topicName, noteDataUri });
      setState(result);
    } catch (e) {
      console.error(e);
      setState({ error: "Failed to analyze notes. The file may be unreadable or in an unsupported format." });
    }
  };

  const handleFormSubmit = form.handleSubmit((data) => {
    startTransition(() => formAction(data));
  });
  
  const ResultDisplay = () => {
    if (!state || 'error' in state) return null;
    const { subject, topic, semester, difficulty, ai_summary, ai_flowchart, concept_map } = state;
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2"><CheckCircle className="text-green-500"/> Analysis Complete</CardTitle>
                <CardDescription>AI-enhanced study notes for: <span className="font-semibold text-primary">{topic}</span></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex flex-wrap gap-4 items-center">
                    <Badge variant="outline"><BookOpen className="mr-2"/>{subject}</Badge>
                    <Badge variant="outline"><BadgeInfo className="mr-2"/>{semester}</Badge>
                    <Badge variant="outline"><Sigma className="mr-2"/>{difficulty}</Badge>
                 </div>
                 
                 <Accordion type="multiple" defaultValue={['summary', 'flowchart', 'concepts']} className="w-full space-y-3">
                    <AccordionItem value="summary" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><FileText className="mr-3 text-primary"/>AI Summary</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                {ai_summary.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="flowchart" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><Milestone className="mr-3 text-primary"/>Process Flowchart</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                             <p className="font-mono text-sm p-4 bg-muted rounded-md">{ai_flowchart}</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="concepts" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><BrainCircuit className="mr-3 text-primary"/>Concept Map</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                            <div className="space-y-2">
                                <p className="font-bold text-base">{concept_map.mainTopic}</p>
                                <ul className="list-decimal list-inside ml-4 text-muted-foreground">
                                   {concept_map.relatedTopics.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                 </Accordion>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Upload Note</CardTitle>
            <CardDescription>Provide a topic and upload the note file.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField name="topicName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note Topic</FormLabel>
                    <FormControl><Input placeholder="e.g., Beta-blockers" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="noteFile" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,application/pdf,.doc,.docx"
                        ref={fileInputRef}
                        onChange={(e) => {
                           field.onChange(e.target.files);
                           handleFileChange(e);
                        }}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {preview && (
                  <div className="mt-4 border rounded-lg p-2 bg-muted">
                    <p className="text-sm font-medium mb-2 text-center">Image Preview</p>
                    <Image src={preview} alt="Notes preview" width={400} height={400} className="rounded-md w-full h-auto object-contain" />
                  </div>
                )}
                
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                  Analyze & Enhance Notes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        {isPending ? (
          <div className="flex flex-col justify-center items-center h-full text-center p-6 bg-muted/50 rounded-lg">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold text-muted-foreground">AI is analyzing your notes...</p>
            <p className="text-sm text-muted-foreground/80">This may take a moment for larger files.</p>
          </div>
        ) : state && 'subject' in state ? (
            <ResultDisplay />
        ) : (
          <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">Waiting for Lecture Notes</h3>
            <p className="text-muted-foreground/80 mt-2">Upload a file to start the AI analysis.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
