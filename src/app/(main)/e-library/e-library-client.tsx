
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { searchELibrary, type SearchResult, type ESearchParams } from "@/ai/flows/e-library-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Library, FileText, Beaker, Lightbulb, GraduationCap, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  query: z.string().min(2, "Please enter a search term."),
});

type FormValues = z.infer<typeof formSchema>;

export function ELibraryClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<SearchResult | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input." };
      }
      try {
        const result = await searchELibrary(parsed.data);
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
    defaultValues: { query: "" },
  });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("query", data.query);
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>E-Library Search</CardTitle>
            <CardDescription>Search for a drug, concept, or formula.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Term</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="e.g., Bioavailability" className="pl-10" {...field} />
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
        
        {state && 'term' in state ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-between">
                <span>{state.term}</span>
                {state.exam_importance && <Badge><GraduationCap className="mr-2"/>{state.exam_importance}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2"><FileText className="text-primary"/>Definition</h3>
                    <p className="text-muted-foreground">{state.definition}</p>
                </div>

                {state.formula && (
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><Beaker className="text-primary"/>Formula</h3>
                        <p className="text-muted-foreground font-mono bg-muted p-2 rounded-md">{state.formula}</p>
                    </div>
                )}
                
                {state.example && (
                     <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-primary"/>Example</h3>
                        <p className="text-muted-foreground">{state.example}</p>
                    </div>
                )}

                {state.related_topics && state.related_topics.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><Link className="text-primary"/>Related Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            {state.related_topics.map(topic => (
                                <Button key={topic} variant="outline" size="sm" onClick={() => {
                                    form.setValue('query', topic);
                                    handleFormSubmit();
                                }}>{topic}</Button>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
        ) : (
          !isPending && (
             <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
                <Library className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Welcome to the E-Library</h3>
                <p className="text-muted-foreground/80 mt-2">Use the search bar to find information on any topic.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
