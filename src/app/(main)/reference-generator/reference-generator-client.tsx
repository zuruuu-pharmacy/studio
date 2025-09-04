
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
  sourceIdentifier: z.string().min(10, "Please provide a valid DOI, PMID, or URL."),
  style: z.enum(['Vancouver', 'APA', 'Harvard', 'MLA']),
});
type FormValues = z.infer<typeof formSchema>;

export function ReferenceGeneratorClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<ReferenceGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input. Please check the form." };
      }
      try {
        const result = await generateReference(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to generate reference. The AI may not have a suitable reference for this text." };
      }
    },
    null
  );

  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceIdentifier: "",
      style: "Vancouver",
    },
  });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("sourceIdentifier", data.sourceIdentifier);
    formData.append("style", data.style);
    startTransition(() => formAction(formData));
  });

  const handleCopy = () => {
    if (state && 'formattedCitation' in state) {
      navigator.clipboard.writeText(state.formattedCitation);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
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
                    <FormLabel>Source (DOI, PMID, or URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10.1056/NEJMoa2033700" {...field} />
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
        
        {state && 'formattedCitation' in state ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Generated Citation</CardTitle>
              <CardDescription>Style: {form.getValues('style')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg relative">
                <p className="font-mono text-sm whitespace-pre-wrap">{state.formattedCitation}</p>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}>
                  {hasCopied ? <Check className="h-5 w-5 text-green-500"/> : <Clipboard className="h-5 w-5"/>}
                </Button>
              </div>
              <Alert>
                <BookA className="h-4 w-4" />
                <AlertTitle>Reference Rationale</AlertTitle>
                <AlertDescription>
                  {state.explanation}
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
