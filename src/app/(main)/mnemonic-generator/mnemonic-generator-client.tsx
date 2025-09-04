
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateMnemonics, type MnemonicGeneratorOutput } from "@/ai/flows/mnemonic-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Sparkles, Lightbulb, Combine } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  topic: z.string().min(3, "Please enter a topic."),
  style: z.enum(['Funny', 'Serious', 'Story-based', 'Acronym', 'Visual']),
});
type FormValues = z.infer<typeof formSchema>;

export function MnemonicGeneratorClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<MnemonicGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input." };
      }
      try {
        const result = await generateMnemonics(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to generate mnemonics. Please try a different topic or style." };
      }
    },
    null
  );

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "", style: "Funny" },
  });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", data.topic);
    formData.append("style", data.style);
    startTransition(() => formAction(formData));
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Generate Mnemonics</CardTitle>
            <CardDescription>Enter a topic and select a style.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField control={form.control} name="topic" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                          <Input placeholder="e.g., Beta-blockers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="style" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Funny">Funny</SelectItem>
                                <SelectItem value="Serious">Serious</SelectItem>
                                <SelectItem value="Story-based">Story-based</SelectItem>
                                <SelectItem value="Acronym">Acronym</SelectItem>
                                <SelectItem value="Visual">Visual</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
                />
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
                    <p className="text-muted-foreground">Generating Roman Urdu mnemonics for "{form.getValues('topic')}"...</p>
                </div>
            </div>
        )}
        
        {state && 'topic' in state ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Mnemonics for: {state.topic}</CardTitle>
              <CardDescription>Style: {state.style}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {state.mnemonics.map((item, index) => (
                        <Card key={index} className="p-4 bg-muted/50">
                            <p className="text-lg font-semibold text-primary">"{item.mnemonic}"</p>
                            <p className="text-sm text-muted-foreground mt-2"><Lightbulb className="inline-block h-4 w-4 mr-1"/>{item.mapping}</p>
                        </Card>
                    ))}
                </div>
            </CardContent>
          </Card>
        ) : (
          !isPending && (
             <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
                <Combine className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Your Mnemonics Will Appear Here</h3>
                <p className="text-muted-foreground/80 mt-2">Enter a topic to get started.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
