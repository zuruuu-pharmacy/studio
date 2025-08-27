'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Languages, MessageSquare, Loader2, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { voiceAssistant, VoiceAssistantOutput } from '@/ai/flows/voice-assistant';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
declare const window: IWindow;

interface Message {
  speaker: 'user' | 'assistant';
  text: string;
}

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        toast({
          variant: 'destructive',
          title: 'Speech Recognition Error',
          description: event.error,
        });
        setIsListening(false);
      };
    } else {
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description: 'Speech recognition is not supported by your browser.',
      });
    }
  }, [language, toast]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    if(isListening) {
        recognitionRef.current?.stop();
    }
  };

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);
    setMessages((prev) => [...prev, { speaker: 'user', text }]);
    setTranscript('');

    try {
      const result: VoiceAssistantOutput = await voiceAssistant({ query: text, language });
      setMessages((prev) => [...prev, { speaker: 'assistant', text: result.textResponse }]);
      if (audioRef.current) {
        audioRef.current.src = result.audioResponse;
        audioRef.current.play();
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Voice Assistant Error',
        description: e.message || 'Failed to get a response.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} className="hidden" />
      {!isOpen && (
         <Button
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
            size="icon"
            onClick={() => setIsOpen(true)}
        >
            <Mic className="h-8 w-8" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] shadow-2xl z-50 flex flex-col h-[600px] max-h-[calc(100vh-3rem)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="text-primary" /> Voice Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
             {messages.length === 0 && <div className="text-center text-muted-foreground mt-8">Ask me anything about your pharmacy needs!</div>}
             {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.speaker === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {msg.text}
                    </div>
                </div>
             ))}
             {isLoading && <div className="flex justify-start"><Loader2 className="h-6 w-6 animate-spin text-primary"/></div>}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 border-t p-4">
            <div className="w-full relative">
                <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Type or press mic to talk..."}
                    className="w-full bg-muted rounded-md p-2 pr-20 min-h-[60px] text-sm"
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(transcript);}}}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <Button variant="ghost" size="icon" onClick={toggleListening}>
                        {isListening ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleSubmit(transcript)} disabled={isLoading || !transcript}>
                        <Send className="h-5 w-5"/>
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-auto h-8 text-xs">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="ur-PK">Urdu (Pakistan)</SelectItem>
                  <SelectItem value="pa-Guru-IN">Punjabi (Gurmukhi)</SelectItem>
                  <SelectItem value="sd-IN">Sindhi</SelectItem>
                  <SelectItem value="ps-AF">Pashto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
