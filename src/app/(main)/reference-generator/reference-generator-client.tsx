
"use client";

import { useTransition, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateReference, type ReferenceGeneratorOutput } from "@/ai/flows/reference-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, BookA, Clipboard, Check, Plus, Library } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  sourceIdentifier: z.string().min(10, "Please provide a valid reference string, DOI, PMID, URL, or a list of references to format."),
  style: z.enum(['Vancouver', 'APA', 'Harvard', 'MLA']),
});
type FormValues = z.infer<typeof formSchema>;

const styleDescriptions: Record<FormValues['style'], string> = {
    Vancouver: "A numbered style common in medical and scientific journals.",
    APA: "An author-date style widely used in social sciences and psychology.",
    Harvard: "A simple author-date style used across many disciplines.",
    MLA: "A style commonly used in the humanities.",
};

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

  const selectedStyle = form.watch('style');

  const handleFormSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
       try {
        const result = await generateReference(data);
        setResults(prev => [result, ...prev]); 
        form.reset({ ...form.getValues(), sourceIdentifier: "" });
      } catch (e) {
        console.error(e);
        toast({ variant: "destructive", title: "Error", description: "Failed to generate reference. The AI may not have a suitable reference for this text." });
      }
    });
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "The citation has been copied to your clipboard." });
  };

  return (
    <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add"><Plus className="mr-2"/> Add Reference</TabsTrigger>
            <TabsTrigger value="bibliography"><Library className="mr-2"/> Formatted Bibliography ({results.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="add">
            <Card className="mt-4">
            <CardHeader>
                <CardTitle>Generate Formatted References</CardTitle>
                <CardDescription>Paste your full bibliography or a single citation to format it correctly.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <FormField control={form.control} name="sourceIdentifier" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Source Text</FormLabel>
                        <FormControl>
                            <Textarea rows={8} placeholder="Paste your references here..." {...field}/>
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
                        <FormDescription>
                            {styleDescriptions[selectedStyle]}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2" />}
                    Format & Add to Bibliography
                    </Button>
                </form>
                </Form>
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="bibliography">
            <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-2xl">Bibliography</CardTitle>
              <CardDescription>Your formatted citations will appear here as a running list.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isPending && (
                    <div className="flex justify-center items-center h-full p-8">
                        <div className="text-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                        <p className="text-muted-foreground">Finding and formatting reference(s)...</p>
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
                        <p className="text-muted-foreground/80 mt-2">Use the "Add Reference" tab to generate your first citation.</p>
                    </div>
                  )
                )}
            </CardContent>
          </Card>
        </TabsContent>
    </Tabs>
  );
}
