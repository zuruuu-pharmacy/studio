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
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  drugName: z.string().min(2, { message: "Drug name must be at least 2 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const monographSections = [
    "Mechanism of Action (MOA)",
    "Pharmacokinetics/Pharmacodynamics (PK/PD)",
    "Indications",
    "Contraindications",
    "Side Effects",
    "Monitoring",
    "Dosing",
    "Administration",
    "Storage",
    "Pregnancy/Lactation Information",
    "Drug Interactions",
    "Clinical Trials Information",
    "Other Information",
];

function parseMonograph(text: string) {
    const sections: Record<string, string> = {};
    if (!text) return sections;

    let content = text;
    // Sometimes the model returns the drug name as a title, remove it.
    const firstLine = text.substring(0, text.indexOf('\n')).toLowerCase();
    if (firstLine.includes("monograph for")) {
        content = text.substring(text.indexOf('\n') + 1);
    }

    for (let i = 0; i < monographSections.length; i++) {
        const currentSection = monographSections[i];
        const nextSection = monographSections[i + 1];
        
        // Use a case-insensitive regex to find section headers
        const startIndex = content.toLowerCase().indexOf(currentSection.toLowerCase());
        if (startIndex === -1) continue;

        let endIndex = nextSection ? content.toLowerCase().indexOf(nextSection.toLowerCase(), startIndex) : content.length;
        if (endIndex === -1) endIndex = content.length;

        const sectionContent = content.substring(startIndex + currentSection.length, endIndex).trim().replace(/^-+|-+$/g, '').trim();
        if (sectionContent) {
          sections[currentSection] = sectionContent;
        }
    }
    
    if (Object.keys(sections).length > 0) return sections;
    
    // Fallback if no sections are found
    return { "Full Monograph": text };
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
    if (state && 'monograph' in state) {
      return parseMonograph(state.monograph);
    }
    return null;
  }, [state]);

  const defaultAccordionItems = useMemo(() => {
    if (!monographData) return [];
    if (mode === 'pharmacist') return Object.keys(monographData);
    // For patients, show key sections by default
    const patientSections = ["Indications", "Side Effects", "Dosing", "Administration"];
    return Object.keys(monographData).filter(section => patientSections.includes(section));
  }, [monographData, mode]);

  const handleFormSubmit = (data: FormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
        }
    });
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
              <Accordion type="multiple" defaultValue={defaultAccordionItems} className="w-full space-y-4">
                {Object.entries(monographData).map(([section, content]) => (
                   (mode === 'pharmacist' || defaultAccordionItems.includes(section)) && (
                  <Card key={section} className="bg-background/50">
                    <AccordionItem value={section} className="border-b-0">
                      <AccordionTrigger className="text-xl font-semibold p-4 hover:no-underline">{section}</AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap dark:prose-invert">
                          {content.split('\n').map((line, index) => {
                              if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                                return <p key={index} className="m-0 ml-4">{line}</p>;
                              }
                              return <p key={index} className="m-0">{line}</p>;
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                   )
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
