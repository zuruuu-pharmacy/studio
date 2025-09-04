
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Target, GraduationCap, Sparkles, CheckCircle, AlertTriangle, BookCheck } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const quizQuestions = [
    { id: 'q1', text: 'Which setting are you most interested in?', options: ['Patient-facing (hospital/community)', 'Laboratory or manufacturing plant', 'Office or research environment'], weights: { 'Clinical Pharmacy': 3, 'Industrial Pharmacy & R&D': 1, 'Regulatory Affairs': 2 } },
    { id: 'q2', text: 'What type of task do you find most rewarding?', options: ['Solving complex patient problems directly', 'Ensuring quality and precision in a product', 'Navigating rules and writing detailed documents'], weights: { 'Clinical Pharmacy': 3, 'Industrial Pharmacy & R&D': 2, 'Regulatory Affairs': 1 } },
    { id: 'q3', text: 'How do you prefer to work?', options: ['As part of a fast-paced team on the front lines', 'In a structured, methodical environment', 'Independently on detailed, long-term projects'], weights: { 'Clinical Pharmacy': 2, 'Industrial Pharmacy & R&D': 3, 'Regulatory Affairs': 3 } },
    { id: 'q4', text: 'Which skill do you want to develop most?', options: ['Advanced therapeutic decision-making', 'Analytical techniques like HPLC', 'Understanding international drug laws'], weights: { 'Clinical Pharmacy': 3, 'Industrial Pharmacy & R&D': 1, 'Regulatory Affairs': 2 } },
];

type QuizAnswers = { [key: string]: string };

const careerPaths = {
    'Clinical Pharmacy': { score: 0, description: "You’re suited for clinical pharmacy because you score high on patient empathy and clinical reasoning.", strengths: ["Strong Clinical Reasoning", "Excellent Communication Skills"], gaps: ["Limited experience with Electronic Health Records (EHR)", "Needs more exposure to hospital ward rounds"], tasks: [{ title: 'Attend Ward Shadowing', action: 'Add to Roadmap' }, { title: 'EHR Simulation Training', action: 'View Courses' }] },
    'Industrial Pharmacy & R&D': { score: 0, description: "You enjoy precision and process, making you a great fit for industrial roles like QA/QC or formulation.", strengths: ["Attention to Detail", "Methodical Approach"], gaps: ["Lack of hands-on experience with GMP", "Needs training in analytical instruments (HPLC)"], tasks: [{ title: 'GMP Certification Workshop', action: 'View Courses' }, { title: 'Intro to HPLC Lab', action: 'Add to Roadmap' }] },
    'Regulatory Affairs': { score: 0, description: "Your interest in detail and process makes you a strong candidate for a career in regulatory affairs.", strengths: ["Detail-oriented", "Strong Writing Skills"], gaps: ["Limited knowledge of CTD/eCTD format", "Needs understanding of international drug laws (ICH)"], tasks: [{ title: 'Intro to Regulatory Affairs Course', action: 'View Courses' }, { title: 'Write a mock CTD Module 3', action: 'View Templates' }] },
};


export function SkillsLabClient() {
    const { register, handleSubmit, formState: { errors } } = useForm<QuizAnswers>();
    const [report, setReport] = useState<{ topPath: string; details: (typeof careerPaths)[keyof typeof careerPaths] } | null>(null);

    const onQuizSubmit = (data: QuizAnswers) => {
        let scores = { ...careerPaths };

        quizQuestions.forEach(q => {
            const selectedOption = data[q.id];
            const optionIndex = q.options.indexOf(selectedOption);
            if (optionIndex !== -1) {
                Object.keys(q.weights).forEach(path => {
                    // @ts-ignore
                    scores[path].score += q.weights[path] > optionIndex ? 3-optionIndex : 1;
                });
            }
        });
        
        const topPath = Object.entries(scores).sort(([,a],[,b]) => b.score-a.score)[0][0] as keyof typeof careerPaths;
        setReport({ topPath, details: scores[topPath] });
        toast({ title: "Assessment Complete!", description: "Your career fit report has been generated below." });
    };

  return (
    <div className="space-y-6">
      {!report && (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ClipboardList/>Self-Assessment Quiz</CardTitle>
                <CardDescription>Take our comprehensive self-assessment to discover your strengths, identify skill gaps, and receive personalized career path recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onQuizSubmit)} className="space-y-6">
                    {quizQuestions.map(q => (
                        <div key={q.id} className="p-4 border rounded-lg">
                            <p className="font-semibold mb-2">{q.text}</p>
                            <RadioGroup>
                                {q.options.map((opt, i) => (
                                    <div key={i} className="flex items-center space-x-2">
                                        <RadioGroupItem value={opt} id={`${q.id}-${i}`} {...register(q.id, { required: "This field is required." })} />
                                        <Label htmlFor={`${q.id}-${i}`}>{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                             {errors[q.id] && <p className="text-sm font-medium text-destructive mt-2">{errors[q.id]?.message}</p>}
                        </div>
                    ))}
                    <Button type="submit" className="w-full">Generate My Report</Button>
                </form>
            </CardContent>
        </Card>
      )}
      
      
      {report && (
        <>
            <div className="grid lg:grid-cols-2 gap-6 items-start">
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Target/>Your Career Fit Report</CardTitle>
                    <CardDescription>An AI-generated report based on your assessment results.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                        <Alert>
                        <AlertTitle className="font-bold">Top Recommended Path: {report.topPath} ({Math.round((report.details.score / 12) * 100)}% Match)</AlertTitle>
                        <AlertDescription>{report.details.description}</AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                            <h4 className="font-semibold">Strengths:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {report.details.strengths.map(s => <li key={s} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />{s}</li>)}
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold">Skill Gaps to Address:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                                {report.details.gaps.map(g => <li key={g} className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" />{g}</li>)}
                            </ul>
                        </div>
                    </div>
                </CardContent>
                </Card>
                
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GraduationCap/>Personalized Learning Plan</CardTitle>
                    <CardDescription>Curated resources and tasks to help you close your skill gaps and track continuous education.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                        {report.details.tasks.map(task => (
                            <Card key={task.title} className="bg-background">
                                <CardHeader><CardTitle className="text-base">{task.title}</CardTitle></CardHeader>
                                <CardContent><Button size="sm" variant="secondary" onClick={() => toast({title: "Coming Soon!", description: "This will be added to your roadmap."})}>{task.action}</Button></CardContent>
                            </Card>
                        ))}
                        <Card className="bg-background">
                            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookCheck/>CE Tracker</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Track your Continuing Education credits to meet licensure requirements.</p></CardContent>
                        </Card>
                    </div>
                </CardContent>
                </Card>
            </div>
             <Button onClick={() => setReport(null)} variant="outline">Take Quiz Again</Button>
        </>
      )}

    </div>
  );
}
