"use client";

import { useActionState, useEffect, useMemo } from 'react';
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

    for (let i = 0; i < monographSections.length; i++) {
        const currentSection = monographSections[i];
        const nextSection = monographSections[i + 1];
        
        const startIndex = text.indexOf(currentSection);
        if (startIndex === -1) continue;

        let endIndex = nextSection ? text.indexOf(nextSection, startIndex) : text.length;
        if (endIndex === -1) endIndex = text.length;

        const content = text.substring(startIndex + currentSection.length, endIndex).trim();
        sections[currentSection] = content;
    }
    
    if (Object.keys(sections).length > 0) return sections;
    
    return { "Full Monograph": text };
}


export function MonographClient() {
  const [state, formAction, isPending] = useActionState<DrugMonographLookupOutput | { error: string } | null, FormData>(
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
    return Object.keys(monographData).slice(0, 3); // Show first 3 sections for patients
  }, [monographData, mode]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    formAction(formData);
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
              <CardTitle>Monograph for {form.getValues("drugName")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={defaultAccordionItems} className="w-full">
                {Object.entries(monographData).map(([section, content]) => (
                  <AccordionItem value={section} key={section}>
                    <AccordionTrigger className="text-lg font-semibold">{section}</AccordionTrigger>
                    <AccordionContent className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                      {content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
