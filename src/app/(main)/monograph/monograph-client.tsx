"use client";

import { useActionState, useEffect, useMemo, useTransition } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { drugMonographLookup, type DrugMonographLookupOutput } from "@/ai/flows/drug-monograph-lookup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { useMode } from '@/contexts/mode-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  drugName: z.string().min(2, { message: "Drug name must be at least 2 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const patientSections = {
    "Indications": "indications",
    "Side Effects": "sideEffects",
    "Dosing": "dosing",
    "Administration": "administration"
};

const pharmacistSections = {
    pharmacology: {
        "Mechanism of Action": "mechanismOfAction",
        "Pharmacokinetics": "pharmacokinetics",
        "Indications": "indications",
        "Contraindications": "contraindications",
        "Side Effects": "sideEffects",
        "Monitoring": "monitoring",
    },
    pharmaceutical: {
        "Dosing": "dosing",
        "Administration": "administration",
        "Storage": "storage",
        "Drug Interactions": "drugInteractions",
    },
    research: {
        "Pregnancy/Lactation": "pregnancyLactation",
        "Clinical Trials": "clinicalTrials",
        "Other Information": "otherInformation",
    }
};

function MonographSection({ title, content }: { title: string; content: string }) {
    if (!content) return null;
    return (
        <Card className="bg-background/50">
            <Accordion type="single" collapsible>
                <AccordionItem value={title} className="border-b-0">
                    <AccordionTrigger className="text-xl font-semibold p-4 hover:no-underline">{title}</AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                        <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap dark:prose-invert">
                           {content.split('\n').map((line, index) => {
                              const trimmedLine = line.trim();
                              if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                                return <p key={index} className="m-0 ml-4">{trimmedLine}</p>;
                              }
                              return <p key={index} className="m-0">{line}</p>;
                          })}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    );
}

export function MonographClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<DrugMonographLookupOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input." };
      }
      try {
        const result = await drugMonographLookup(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to fetch monograph. Please try again." };
      }
    },
    null
  );
  
  const { mode } = useMode();
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
  
  const monographData = useMemo(() => {
    if (state && 'pharmacology' in state) {
      return state;
    }
    return null;
  }, [state]);

  const handleFormSubmit = form.handleSubmit((data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
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
                        <Input placeholder="e.g., Lisinopril" {...field} />
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
        {monographData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline">Monograph for {form.getValues("drugName")}</CardTitle>
            </CardHeader>
            <CardContent>
              {mode === 'pharmacist' ? (
                <Tabs defaultValue="pharmacology" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pharmacology">Pharmacology</TabsTrigger>
                    <TabsTrigger value="pharmaceutical">Pharmaceutical</TabsTrigger>
                    <TabsTrigger value="research">Research</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pharmacology" className="mt-4 space-y-4">
                    {Object.entries(pharmacistSections.pharmacology).map(([title, key]) => (
                        <MonographSection key={key} title={title} content={monographData.pharmacology[key as keyof typeof monographData.pharmacology]} />
                    ))}
                  </TabsContent>
                  <TabsContent value="pharmaceutical" className="mt-4 space-y-4">
                    {Object.entries(pharmacistSections.pharmaceutical).map(([title, key]) => (
                         <MonographSection key={key} title={title} content={monographData.pharmaceutical[key as keyof typeof monographData.pharmaceutical]} />
                    ))}
                  </TabsContent>
                  <TabsContent value="research" className="mt-4 space-y-4">
                     {Object.entries(pharmacistSections.research).map(([title, key]) => (
                         <MonographSection key={key} title={title} content={monographData.research[key as keyof typeof monographData.research]} />
                    ))}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-4">
                  {Object.entries(patientSections).map(([title, key]) => {
                    const content = monographData.pharmacology[key as keyof typeof monographData.pharmacology] || monographData.pharmaceutical[key as keyof typeof monographData.pharmaceutical];
                    return <MonographSection key={key} title={title} content={content} />
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
