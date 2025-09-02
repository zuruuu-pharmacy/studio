
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getHerbalInfo, type HerbalInfoOutput } from "@/ai/flows/herbal-knowledge-hub";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Leaf, Sprout, TestTube, Pill, FlaskConical, AlertTriangle, GitCompareArrows, ScrollText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  plantName: z.string().min(2, "Please enter a plant name."),
});

type FormValues = z.infer<typeof formSchema>;

function InfoCard({ title, content, icon: Icon }: { title: string, content?: string, icon: React.ElementType }) {
    if (!content) return null;
    return (
        <Card className="bg-background/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
            </CardContent>
        </Card>
    );
}


export function HerbalHubClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<HerbalInfoOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input." };
      }
      try {
        const result = await getHerbalInfo(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to perform search. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { plantName: "" },
  });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("plantName", data.plantName);
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Plant Search</CardTitle>
            <CardDescription>Search by common or botanical name.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField control={form.control} name="plantName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plant Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="e.g., Sarpagandha" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2" />}
                  Search
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        
        {state && 'botanicalName' in state ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Leaf className="text-green-600"/>
                {state.botanicalName}
              </CardTitle>
              <CardDescription>
                {state.commonNames} | Family: {state.family}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <InfoCard title="Morphology" content={state.morphologicalFeatures} icon={Sprout} />
                    <InfoCard title="Active Constituents" content={state.activeConstituents} icon={TestTube} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <InfoCard title="Therapeutic Uses" content={state.therapeuticUses} icon={Pill} />
                    <InfoCard title="Dosage Forms" content={state.dosageForms} icon={FlaskConical} />
                </div>

                <Accordion type="multiple" className="w-full space-y-4">
                    <AccordionItem value="interactions" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline flex items-center gap-2">
                           <AlertTriangle className="text-destructive"/> Herbal-Drug Interactions
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <p className="text-muted-foreground whitespace-pre-wrap">{state.herbalDrugInteractions}</p>
                        </AccordionContent>
                    </AccordionItem>

                     <AccordionItem value="alternatives" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline flex items-center gap-2">
                           <GitCompareArrows className="text-primary"/> Synthetic Alternatives
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <p className="text-muted-foreground whitespace-pre-wrap">{state.syntheticAlternatives}</p>
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="history" className="border rounded-lg bg-background/50">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline flex items-center gap-2">
                           <ScrollText className="text-primary"/> Historical & Cultural Use
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                           <p className="text-muted-foreground whitespace-pre-wrap">{state.historicalCulturalUse}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
          </Card>
        ) : (
          !isPending && (
             <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
                <Leaf className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Welcome to the Herbal Hub</h3>
                <p className="text-muted-foreground/80 mt-2">Use the search bar to find information on any medicinal plant.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
