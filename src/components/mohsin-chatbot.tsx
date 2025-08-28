"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { MessageCircle, Send, Loader2, X, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { mohsinChatbot } from "@/ai/flows/mohsin-chatbot";

type Message = {
  role: "user" | "model";
  content: string;
};

export function MohsinChatbot() {
  const [isOpen, setIsOpen] = useState(false);
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
        const response = await mohsinChatbot({ history: newMessages });
        setMessages((prev) => [...prev, { role: "model", content: response }]);
      } catch (error) {
        console.error("Chatbot error:", error);
        setMessages((prev) => [...prev, { role: "model", content: "Sorry, I encountered an error. Please try again." }]);
      }
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to the bottom.
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100)
    }
  }, [messages]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        size="icon"
      >
        <Bot className="h-8 w-8" />
        <span className="sr-only">Open Chatbot</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] flex flex-col h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6" /> Mohsin's AI Assistant
            </DialogTitle>
          </DialogHeader>
          <div className="flex-grow flex flex-col-reverse overflow-hidden">
            <ScrollArea className="h-[calc(80vh-150px)]" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground">Ask me anything!</div>
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
                        "max-w-xs rounded-lg p-3 text-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.content}
                    </div>
                     {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                         <AvatarFallback>U</AvatarFallback>
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
          </div>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
