
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { aiAssistant } from "@/ai/flows/ai-assistant";

type Message = {
  role: "user" | "model";
  content: string;
};

export function AiAssistantClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    startTransition(async () => {
      try {
        const response = await aiAssistant({ history: newMessages });
        setMessages((prev) => [...prev, { role: "model", content: response }]);
      } catch (error) {
        console.error("Assistant error:", error);
        setMessages((prev) => [...prev, { role: "model", content: "Sorry, I encountered an error. Please try again." }]);
      }
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100)
    }
  }, [messages]);

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle>Conversation</CardTitle>
        <CardDescription>Chat with the Zuruu AI Assistant.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col-reverse overflow-hidden p-0">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
              {messages.length === 0 && (
                  <div className="text-center text-muted-foreground pt-10">Ask me anything!</div>
              )}
              {messages.map((message, index) => (
              <div
                  key={index}
                  className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                  )}
              >
                  {message.role === "model" && (
                  <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot/></AvatarFallback>
                  </Avatar>
                  )}
                  <div
                  className={cn(
                      "max-w-xl rounded-lg p-3 text-sm whitespace-pre-wrap",
                      message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                  >
                  {message.content}
                  </div>
                  {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                      <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  )}
              </div>
              ))}
              {isPending && (
              <div className="flex items-center gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot/></AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
              </div>
              )}
          </div>
          </ScrollArea>
      </CardContent>
      <div className="p-4 border-t">
          <div className="relative">
          <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="pr-12"
              disabled={isPending}
          />
          <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleSendMessage}
              disabled={isPending || !input.trim()}
          >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
          </Button>
          </div>
      </div>
  </Card>
  );
}
