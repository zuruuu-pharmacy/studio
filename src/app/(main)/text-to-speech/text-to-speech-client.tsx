
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { textToSpeech, type TtsOutput } from "@/ai/flows/text-to-speech";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Volume2 } from "lucide-react";

const formSchema = z.object({
  text: z.string().min(1, "Text cannot be empty."),
});
type FormValues = z.infer<typeof formSchema>;

export function TextToSpeechClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<TtsOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input." };
      }
      try {
        const result = await textToSpeech(parsed.data);
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to generate audio. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: "" },
  });

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("text", data.text);
    startTransition(() => formAction(formData));
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>AI Audio Generator</CardTitle>
          <CardDescription>Paste your text below to generate audio.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text to Convert</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type or paste your text here..." {...field} rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Audio
              </Button>
            </form>
          </Form>

          {isPending && (
            <div className="mt-6 flex justify-center items-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating audio...</p>
            </div>
          )}

          {state && 'audioDataUri' in state && (
            <div className="mt-6">
              <CardTitle className="mb-4 flex items-center gap-2"><Volume2 className="text-primary"/>Generated Audio</CardTitle>
              <audio controls src={state.audioDataUri} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
