"use client";

import { useActionState, useEffect, useTransition, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateReference, type ReferenceGeneratorOutput } from "@/ai/flows/reference-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, BookA, Clipboard, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  sourceIdentifier: z.string().min(3, "Please provide a valid reference string, DOI, PMID, or URL."),
  style: z.enum(['Vancouver', 'APA', 'Harvard', 'MLA']),
});
type FormValues = z.infer<typeof formSchema>;

export function ReferenceGeneratorClient() {
  const [isPending, startTransition] = useTransition();
  // State is now an array to prepare for bibliography features
  const [results, setResults] = useState<(ReferenceGeneratorOutput | { error: string })[]>([]);

  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceIdentifier: "",
      style: "Vancouver",
    },
  });

  const formAction = async (formData: FormData) => {
    const parsed = formSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      toast({ variant: "destructive", title: "Error", description: "Invalid input. Please check the form."});
      return;
    }
    startTransition(async () => {
      try {
        const result = await generateReference(parsed.data);
        setResults([result]); // Set the result as the first item in the array
      } catch (e) {
        console.error(e);
        toast({ variant: "destructive", title: "Error", description: "Failed to generate reference. The AI may not have a suitable reference for this text." });
        setResults([{ error: "Failed to generate reference." }]);
      }
    });
  };

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("sourceIdentifier", data.sourceIdentifier);
    formData.append("style", data.style);
    formAction(formData);
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Generate Citation</CardTitle>
            <CardDescription>Enter a source and select a style.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField control={form.control} name="sourceIdentifier" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Identifier</FormLabel>
                    <FormControl>
                      <Input placeholder="Paste a DOI, PMID, URL, or citation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="style" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Citation Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Vancouver">Vancouver</SelectItem>
                        <SelectItem value="APA">APA</SelectItem>
                        <SelectItem value="Harvard">Harvard</SelectItem>
                        <SelectItem value="MLA">MLA</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2" />}
                  Generate
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
              <p className="text-muted-foreground">Finding and formatting the best reference...</p>
            </div>
          </div>
        )}
        
        {results.length > 0 && 'formattedCitation' in results[0] ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Generated Citation</CardTitle>
              <CardDescription>Style: {form.getValues('style')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg relative">
                <p className="font-mono text-sm whitespace-pre-wrap">{results[0].formattedCitation}</p>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => handleCopy(results[0].formattedCitation)}>
                  {hasCopied ? <Check className="h-5 w-5 text-green-500"/> : <Clipboard className="h-5 w-5"/>}
                </Button>
              </div>
              <Alert>
                <BookA className="h-4 w-4" />
                <AlertTitle>Reference Rationale</AlertTitle>
                <AlertDescription>
                  {results[0].explanation}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          !isPending && (
            <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
              <BookA className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground">Your Citation Will Appear Here</h3>
              <p className="text-muted-foreground/80 mt-2">Enter a source identifier to get started.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
