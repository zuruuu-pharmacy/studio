
"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { generateFlashcards, type FlashcardGeneratorOutput } from "@/ai/flows/flashcard-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileHeart, RefreshCcw, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// This needs to be defined here since the server file cannot export it
const FlashcardSchema = z.object({
    front: z.string().describe("The front of the flashcard (a question, term, or concept)."),
    back: z.string().describe("The back of the flashcard (the answer or definition)."),
});

const formSchema = z.object({
  topic: z.string().min(3, "Please provide a topic name."),
  noteFile: z.instanceof(File, { message: "A file is required." }),
});

type FormValues = z.infer<typeof formSchema>;

function Flashcard({ card, isFlipped, onClick }: { card: z.infer<typeof FlashcardSchema>, isFlipped: boolean, onClick: () => void }) {
  return (
    <div className="w-full h-64 [perspective:1000px]" onClick={onClick}>
        <motion.div
            className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
            {/* Front */}
            <div className="absolute w-full h-full [backface-visibility:hidden] bg-card border rounded-lg flex items-center justify-center p-6 text-center">
                <p className="text-xl font-semibold">{card.front}</p>
            </div>
            {/* Back */}
            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-primary text-primary-foreground border rounded-lg flex items-center justify-center p-6 text-center">
                <p className="text-lg">{card.back}</p>
            </div>
        </motion.div>
    </div>
  );
}


export function FlashcardGeneratorClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<FlashcardGeneratorOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse({
        topic: formData.get('topic'),
        noteFile: formData.get('noteFile'),
      });
      if (!parsed.success) {
        // Find the first error message to display
        const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
        return { error: firstError || "Invalid input." };
      }
      
      const { topic, noteFile: file } = parsed.data;

      if (file.size > MAX_FILE_SIZE) {
        return { error: "File size exceeds 10MB limit." };
      }

      try {
        const noteDataUri = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        const result = await generateFlashcards({ noteDataUri, topic: topic, cardCount: 10 });
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to generate flashcards. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "" },
  });
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const fileRef = form.register("noteFile");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > MAX_FILE_SIZE) {
      toast({ variant: "destructive", title: "Error", description: "File size exceeds 10MB limit." });
      form.setValue('noteFile', undefined as any);
    }
  };

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("topic", data.topic);
    formData.append("noteFile", data.noteFile);
    startTransition(() => formAction(formData));
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate New Flashcard Deck</CardTitle>
          <CardDescription>Upload your notes, provide a topic, and let the AI do the rest.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField name="topic" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Note Topic</FormLabel><FormControl><Input placeholder="e.g., Beta-blockers in Pharmacology" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="noteFile" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Note File (PDF, DOCX, etc.)</FormLabel><FormControl>
                    <Input type="file" {...fileRef} onChange={handleFileChange} />
                  </FormControl><FormMessage /></FormItem>
                )} />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Flashcards
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
      
      {state && 'flashcards' in state && state.flashcards.length > 0 && (
        <Card>
            <CardHeader>
                <CardTitle>Generated Flashcards for "{form.getValues("topic")}"</CardTitle>
                <CardDescription>Click a card to flip it. Review your new deck.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {state.flashcards.map((card, index) => (
                        <Flashcard 
                            key={index}
                            card={card}
                            isFlipped={flippedCard === index}
                            onClick={() => setFlippedCard(flippedCard === index ? null : index)}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
      )}

      {!isPending && (!state || !('flashcards' in state) || state.flashcards.length === 0) && (
        <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
            <FileHeart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">Your Flashcards Will Appear Here</h3>
            <p className="text-muted-foreground/80 mt-2">Upload some notes to get started.</p>
        </Card>
      )}
    </div>
  );
}
