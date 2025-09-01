
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { getLifestyleSuggestions } from "@/ai/flows/lifestyle-suggester";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lightbulb, AlertTriangle, Sparkles } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { type PatientHistory } from "@/contexts/patient-context";

type Suggestion = {
    priority: 'High' | 'Medium' | 'Low';
    emoji: string;
    title: string;
    suggestion: string;
};

type State = {
    suggestions?: Suggestion[];
    error?: string;
} | null;


export function LifestyleSuggestions({ patientHistory }: { patientHistory: PatientHistory }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    const [state, setState] = useActionState<State, void>(
        async (previousState, payload) => {
            try {
                const result = await getLifestyleSuggestions(patientHistory);
                return { suggestions: result.suggestions };
            } catch (e) {
                console.error(e);
                return { error: "Failed to load health tips. Please try again later." };
            }
        }, null);

    useEffect(() => {
        if (state?.error) {
            toast({ variant: 'destructive', title: "Error", description: state.error });
        }
    }, [state, toast]);
    
    const handleGetTips = () => {
        startTransition(() => {
            setState();
        });
    }
    
    // Initial call on component mount
    useEffect(() => {
        handleGetTips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    if (isPending && !state?.suggestions) {
         return (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="text-yellow-400"/> Daily Health Alerts</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-24">
                   <Loader2 className="h-6 w-6 animate-spin text-primary" />
                   <p className="ml-2 text-muted-foreground">Generating personalized tips...</p>
                </CardContent>
            </Card>
        )
    }

    if (state?.suggestions) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="text-yellow-400"/> Daily Health Alerts</CardTitle>
                    <CardDescription>
                        Personalized tips for you. 
                        <Button variant="link" onClick={handleGetTips} disabled={isPending}>
                             {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : null}
                            Refresh
                        </Button>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {state.suggestions.map((tip, index) => (
                        <Alert key={index} variant={tip.priority === 'High' ? 'destructive' : 'default'} className="bg-background/70">
                            <AlertTitle className="flex items-center gap-2">
                                <span className="text-lg">{tip.emoji}</span>
                                {tip.title}
                            </AlertTitle>
                            <AlertDescription>{tip.suggestion}</AlertDescription>
                        </Alert>
                    ))}
                </CardContent>
            </Card>
        )
    }

    // Fallback or error state
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Daily Health Tips</CardTitle>
                <CardDescription>Get personalized, AI-powered health and wellness suggestions for your day.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={handleGetTips} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2"/>}
                    Get Today's Health Tips
                </Button>
            </CardContent>
        </Card>
    );
}
