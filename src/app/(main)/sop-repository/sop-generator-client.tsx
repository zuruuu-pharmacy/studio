
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateSop, type SopGeneratorOutput } from "@/ai/flows/sop-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, FileJson, Beaker, FlaskConical, AlertTriangle, ListOrdered, TestTube, Microscope, Bot, FileQuestion, GraduationCap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  experimentTitle: z.string().min(10, "Please enter a descriptive experiment title."),
});
type FormValues = z.infer<typeof formSchema>;

function SopSection({ title, content, icon: Icon, isList = false }: { title: string, content?: string | string[], icon: React.ElementType, isList?: boolean }) {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;
    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Icon className="h-5 w-5 text-primary"/>{title}</h3>
            {isList && Array.isArray(content) ? (
                <ul className="list-decimal list-inside pl-4 text-muted-foreground space-y-1">
                    {content.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            ) : (
                <p className="text-muted-foreground whitespace-pre-wrap">{content as string}</p>
            )}
        </div>
    );
}

export function SopGeneratorClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<SopGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input." };
      }
      try {
        const result = await generateSop(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to generate SOP. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { experimentTitle: "" },
  });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("experimentTitle", data.experimentTitle);
    startTransition(() => formAction(formData));
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Generate SOP</CardTitle>
            <CardDescription>Enter the title of the lab experiment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField control={form.control} name="experimentTitle" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experiment Title</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <FileJson className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="e.g., Antibiotic Sensitivity Testing..." className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2" />}
                  Generate SOP
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
                    <p className="text-muted-foreground">Generating SOP for "{form.getValues('experimentTitle')}"...</p>
                    <p className="text-xs text-muted-foreground/70">This might take a moment.</p>
                </div>
            </div>
        )}
        
        {state && 'title' in state ? (
          <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{state.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <SopSection title="Objectives" content={state.objectives} icon={GraduationCap} isList />
                <SopSection title="Theory / Background" content={state.theory} icon={Beaker} />
                
                <Accordion type="multiple" className="w-full space-y-4" defaultValue={['procedure', 'viva']}>
                    <AccordionItem value="requirements" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><FlaskConical className="mr-2"/>Requirements</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-4">
                            <SopSection title="Reagents" content={state.requirements.reagents} icon={Beaker} isList />
                            <SopSection title="Instruments" content={state.requirements.instruments} icon={Microscope} isList />
                            <SopSection title="Consumables" content={state.requirements.consumables} icon={TestTube} isList />
                            <SopSection title="Special Requirements" content={state.requirements.special} icon={AlertTriangle} />
                        </AccordionContent>
                    </AccordionItem>
                    
                     <AccordionItem value="procedure" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><ListOrdered className="mr-2"/>Procedure</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                {state.procedure.map((step, i) => <li key={i}>{step}</li>)}
                           </ol>
                        </AccordionContent>
                    </AccordionItem>

                     <AccordionItem value="viva" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><FileQuestion className="mr-2"/>Viva-Voce</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <dl className="space-y-4 text-muted-foreground">
                                {state.vivaVoce.map((viva, i) => (
                                    <div key={i}>
                                        <dt className="font-semibold text-foreground">{viva.question}</dt>
                                        <dd className="pl-4">{viva.answer}</dd>
                                    </div>
                                ))}
                           </dl>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="simulation" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><Bot className="mr-2"/>Virtual Lab Simulation</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <p className="text-muted-foreground whitespace-pre-wrap">{state.virtualLabSimulation}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-muted/50"><CardHeader><CardTitle>Observations</CardTitle></CardHeader><CardContent><p className="text-muted-foreground whitespace-pre-wrap">{state.observationGuidelines}</p></CardContent></Card>
                    <Card className="bg-muted/50"><CardHeader><CardTitle>Result & Interpretation</CardTitle></CardHeader><CardContent><p className="text-muted-foreground whitespace-pre-wrap">{state.resultAndInterpretation}</p></CardContent></Card>
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-muted/50"><CardHeader><CardTitle>Common Errors</CardTitle></CardHeader><CardContent><p className="text-muted-foreground whitespace-pre-wrap">{state.commonErrors}</p></CardContent></Card>
                    <Card className="bg-muted/50"><CardHeader><CardTitle>Compliance</CardTitle></CardHeader><CardContent><p className="text-muted-foreground whitespace-pre-wrap">{state.complianceNotes}</p></CardContent></Card>
                </div>

                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Safety Precautions</AlertTitle>
                    <AlertDescription>{state.safetyPrecautions}</AlertDescription>
                </Alert>
            </CardContent>
          </Card>
        ) : (
          !isPending && (
             <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
                <FileJson className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">SOP Will Appear Here</h3>
                <p className="text-muted-foreground/80 mt-2">Enter an experiment title to generate a new SOP.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
