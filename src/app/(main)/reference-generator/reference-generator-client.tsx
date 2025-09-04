
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

function CitationCard({ citation, onCopy }: { citation: ReferenceGeneratorOutput, onCopy: (text: string) => void }) {
    const [hasCopied, setHasCopied] = useState(false);

    const handleCopy = () => {
        onCopy(citation.formattedCitation);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    }
    
    return (
        <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-3">
                 <div className="relative">
                    <p className="font-mono text-sm whitespace-pre-wrap pr-12">{citation.formattedCitation}</p>
                    <Button variant="ghost" size="icon" className="absolute top-0 right-0" onClick={handleCopy}>
                      {hasCopied ? <Check className="h-5 w-5 text-green-500"/> : <Clipboard className="h-5 w-5"/>}
                    </Button>
                </div>
                 <Alert>
                    <BookA className="h-4 w-4" />
                    <AlertTitle>Reference Rationale</AlertTitle>
                    <AlertDescription>
                      {citation.explanation}
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}

export function ReferenceGeneratorClient() {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<ReferenceGeneratorOutput[]>([]);

  const { toast } = useToast();
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
      // The form's own validation will show messages, but we can have a fallback toast.
      toast({ variant: "destructive", title: "Error", description: "Invalid input. Please check the form."});
      return;
    }
    startTransition(async () => {
      try {
        const result = await generateReference(parsed.data);
        setResults(prev => [result, ...prev]); 
        form.reset({ ...form.getValues(), sourceIdentifier: "" });
      } catch (e) {
        console.error(e);
        toast({ variant: "destructive", title: "Error", description: "Failed to generate reference. The AI may not have a suitable reference for this text." });
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
    toast({ title: "Copied!", description: "The citation has been copied to your clipboard." });
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
                  Generate & Add to List
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
         <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Bibliography</CardTitle>
              <CardDescription>Generated citations will appear here as a running list.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isPending && (
                    <div className="flex justify-center items-center h-full p-8">
                        <div className="text-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                        <p className="text-muted-foreground">Finding and formatting reference...</p>
                        </div>
                    </div>
                )}
        
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <CitationCard key={index} citation={result} onCopy={handleCopy} />
                    ))
                ) : (
                  !isPending && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center p-6 bg-muted/50 rounded-lg">
                        <BookA className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold text-muted-foreground">Your Bibliography is Empty</h3>
                        <p className="text-muted-foreground/80 mt-2">Use the form to generate your first citation.</p>
                    </div>
                  )
                )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
