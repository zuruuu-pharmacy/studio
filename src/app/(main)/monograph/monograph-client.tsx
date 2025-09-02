
"use client";

import { useActionState, useEffect, useMemo, useTransition } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { drugFormularyLookup, type DrugFormularyOutput } from "@/ai/flows/drug-monograph-lookup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pill, FlaskConical, AlertTriangle, User, GitCompareArrows, BookText } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  drugName: z.string().min(2, { message: "Drug name must be at least 2 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

function InfoSection({ title, content, icon: Icon }: { title: string; content?: string; icon: React.ElementType }) {
    if (!content) return null;
    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                <Icon className="h-5 w-5"/>
                {title}
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap pl-7">{content}</p>
        </div>
    );
}

export function MonographClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<DrugFormularyOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input." };
      }
      try {
        const result = await drugFormularyLookup(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to fetch formulary data. Please try again." };
      }
    },
    null
  );
  
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drugName: "",
    },
  });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state, toast]);
  
  const formularyData = useMemo(() => {
    if (state && 'genericName' in state) {
      return state;
    }
    return null;
  }, [state]);

  const handleFormSubmit = form.handleSubmit((data: FormValues) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("drugName", data.drugName);
      formAction(formData);
    });
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Search Formulary</CardTitle>
             <CardDescription>Enter a drug name to get its formulary summary.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="drugName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drug Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Metoprolol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Look Up Drug
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {formularyData ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline">{formularyData.genericName}</CardTitle>
              <CardDescription>{formularyData.therapeuticClass}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-muted/50">
                        <h4 className="font-semibold text-sm mb-2">Brand Names</h4>
                        <p className="text-sm text-muted-foreground">{formularyData.brandNames}</p>
                    </Card>
                    <Card className="p-4 bg-muted/50">
                        <h4 className="font-semibold text-sm mb-2">Dosage Forms</h4>
                        <p className="text-sm text-muted-foreground">{formularyData.dosageForms}</p>
                    </Card>
                </div>
                
                <Alert variant="default" className="border-primary/50 bg-primary/10">
                    <GitCompareArrows className="h-4 w-4 text-primary"/>
                    <AlertTitle>Formulary Comparison Notes (BNF vs. USP vs. Local)</AlertTitle>
                    <AlertDescription>
                       {formularyData.formularyComparisonNotes}
                    </AlertDescription>
                </Alert>

                <Accordion type="multiple" className="w-full space-y-4" defaultValue={['dosing', 'indications']}>
                    <AccordionItem value="dosing" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><User className="mr-2"/>Dosing Information</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-4">
                            <InfoSection title="Adult" content={formularyData.dosing.adult} icon={User}/>
                            <InfoSection title="Pediatric" content={formularyData.dosing.pediatric} icon={User}/>
                            <InfoSection title="Renal Impairment" content={formularyData.dosing.renalImpairment} icon={User}/>
                            <InfoSection title="Hepatic Impairment" content={formularyData.dosing.hepaticImpairment} icon={User}/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="indications" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><Pill className="mr-2"/>Indications</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <p className="text-muted-foreground whitespace-pre-wrap">{formularyData.indications}</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="contraindications" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><AlertTriangle className="mr-2 text-destructive"/>Contraindications & Warnings</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <p className="text-muted-foreground whitespace-pre-wrap">{formularyData.contraindicationsAndWarnings}</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="adrs" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><AlertTriangle className="mr-2 text-yellow-500"/>Adverse Drug Reactions</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <p className="text-muted-foreground whitespace-pre-wrap">{formularyData.adverseDrugReactions}</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="interactions" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><FlaskConical className="mr-2"/>Drug Interactions</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <p className="text-muted-foreground whitespace-pre-wrap">{formularyData.drugInteractions}</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="alternatives" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline"><GitCompareArrows className="mr-2"/>Therapeutic Alternatives</AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <p className="text-muted-foreground whitespace-pre-wrap">{formularyData.therapeuticAlternatives}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
          </Card>
        ) : (
            !isPending && (
                <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
                    <BookText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground">Digital Formulary</h3>
                    <p className="text-muted-foreground/80 mt-2">Enter a drug name to view its detailed formulary information.</p>
                </Card>
          )
        )}
      </div>
    </div>
  );
}
