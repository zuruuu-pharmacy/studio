
"use client";

import { useActionState, useEffect, useTransition, useState, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getAssistantResponse, type AssistantHelperOutput } from "@/ai/flows/ai-assistant-helper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, User, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  query: z.string().min(1, "Message cannot be empty."),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function AiAssistantClient() {
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [state, formAction] = useActionState<AssistantHelperOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input." };
      }
      
      const userMessage: Message = { role: 'user', content: parsed.data.query };
      setMessages(prev => [...prev, userMessage]);

      try {
        const result = await getAssistantResponse({ 
            query: parsed.data.query,
            history: messages,
         });
        
        const modelMessage: Message = { role: 'model', content: result.response };
        setMessages(prev => [...prev, modelMessage]);

        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to get a response. Please try again." };
      }
    },
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: "" },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  
   useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("query", data.query);
    startTransition(() => formAction(formData));
    form.reset();
  });

  return (
    <Card className="h-[75vh] flex flex-col">
      <CardHeader>
        <CardTitle>Conversation with Zuruu AI</CardTitle>
        <CardDescription>Ask a question to start the conversation.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
           <div className="space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={cn("flex items-start gap-4", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                     {msg.role === 'model' && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                     )}
                     <div className={cn("p-3 rounded-lg max-w-lg", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                         <p className="whitespace-pre-wrap">{msg.content}</p>
                     </div>
                     {msg.role === 'user' && (
                        <Avatar className="w-8 h-8">
                            <AvatarFallback><User/></AvatarFallback>
                        </Avatar>
                     )}
                </div>
            ))}
             {isPending && (
                <div className="flex items-center gap-4">
                     <Avatar className="w-8 h-8"><AvatarFallback>AI</AvatarFallback></Avatar>
                     <div className="p-3 rounded-lg bg-muted"><Loader2 className="animate-spin"/></div>
                </div>
             )}
           </div>
        </ScrollArea>
        <div className="mt-auto">
            <Form {...form}>
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                    <FormField name="query" control={form.control} render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Textarea 
                                    {...field}
                                    placeholder="Type your message here..."
                                    className="min-h-0"
                                    rows={1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleFormSubmit();
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <Button type="submit" disabled={isPending} size="icon">
                        <Send />
                    </Button>
                </form>
            </Form>
        </div>
      </CardContent>
    </Card>
  );
}
