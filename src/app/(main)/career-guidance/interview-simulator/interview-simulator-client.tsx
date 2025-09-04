
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, User, Bot } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const sampleQuestions = [
    { type: 'behavioral', text: "Tell me about a time you had to handle a difficult patient or customer. How did you manage the situation?" },
    { type: 'clinical', text: "A patient presents with a prescription for Warfarin and a new prescription for Clarithromycin. What is the potential interaction and how would you manage it?" },
    { type: 'situational', text: "You notice a potential dispensing error made by a senior colleague. What steps would you take?" },
];

export function InterviewSimulatorClient() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    
    const currentQuestion = sampleQuestions[currentQuestionIndex];

    const handleSubmit = () => {
        if (answer.length < 10) {
            toast({ variant: 'destructive', title: 'Answer too short', description: 'Please provide a more detailed answer.' });
            return;
        }
        setIsThinking(true);
        // Simulate AI feedback generation
        setTimeout(() => {
            const sampleFeedback = "This is a good start. To improve, you could structure your answer using the STAR method (Situation, Task, Action, Result). For the clinical question, be sure to mention specific monitoring parameters like INR. For the situational question, emphasize patient safety and professional communication.";
            setFeedback(sampleFeedback);
            setIsThinking(false);
        }, 2000);
    }

    const handleNext = () => {
        if (currentQuestionIndex < sampleQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setAnswer('');
            setFeedback('');
        } else {
            setIsFinished(true);
        }
    }
    
    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setAnswer('');
        setFeedback('');
        setIsFinished(false);
    }

    if (isFinished) {
        return (
            <Card className="max-w-2xl mx-auto text-center">
                <CardHeader>
                    <CardTitle>Simulation Complete</CardTitle>
                    <CardDescription>You've completed the practice interview session.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Great job practicing! You can restart the simulation to try again with the same questions.</p>
                    <Button onClick={handleRestart}>Restart Simulation</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Practice Interview</CardTitle>
                <CardDescription>Question {currentQuestionIndex + 1} of {sampleQuestions.length}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                        <Bot className="h-6 w-6 text-primary shrink-0"/>
                        <div>
                            <p className="font-semibold">Interviewer</p>
                            <p>{currentQuestion.text}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                        <User className="h-6 w-6 text-primary shrink-0"/>
                         <div className="w-full">
                            <p className="font-semibold">Your Answer</p>
                            <Textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                                rows={6}
                                disabled={!!feedback}
                            />
                        </div>
                    </div>
                </div>
                
                {isThinking && (
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                        <Loader2 className="animate-spin" />
                        <p>AI is analyzing your response...</p>
                    </div>
                )}
                
                {feedback && (
                     <div className="p-4 bg-amber-500/10 border border-amber-500/50 rounded-lg space-y-3">
                        <div className="flex items-start gap-3">
                            <Bot className="h-6 w-6 text-amber-600 shrink-0"/>
                            <div>
                                <p className="font-semibold text-amber-700">Feedback</p>
                                <p>{feedback}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    {feedback ? (
                         <Button onClick={handleNext}>
                            {currentQuestionIndex === sampleQuestions.length - 1 ? 'Finish Session' : 'Next Question'}
                        </Button>
                    ) : (
                         <Button onClick={handleSubmit} disabled={isThinking}>Submit Answer</Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
