
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileQuestion, CheckSquare } from 'lucide-react';

const behavioralQuestions = [
    { q: "Tell me about yourself.", a: "Model Answer: Start with a concise summary of your background (e.g., 'I am a recent Pharm.D graduate from UMT...'). Connect your skills and experiences to the specific role you're applying for. End with your enthusiasm for this opportunity." },
    { q: "Why are you interested in this role/company?", a: "Model Answer: Show you've done your research. Mention specific aspects of the company's mission, values, or recent projects that align with your career goals. Explain how your skills (e.g., patient counseling, data analysis) would be a perfect fit for the job description." },
    { q: "Describe a time you dealt with a difficult colleague.", a: "Model Answer: Use the STAR method (Situation, Task, Action, Result). Describe a professional disagreement, the task at hand, the specific actions you took to resolve it (e.g., active listening, finding common ground), and the positive outcome (e.g., project completed successfully, improved working relationship)." },
    { q: "Where do you see yourself in five years?", a: "Model Answer: Demonstrate ambition and a desire for growth within the company or field. You might say, 'I aim to become a specialist in an area like oncology or infectious disease and take on mentorship responsibilities for junior pharmacists.'" },
];

const clinicalQuestions = [
    { q: "A patient's INR is 5.5, and they are on Warfarin. What is your immediate recommendation?", a: "Model Answer: Assess for bleeding. Recommend holding the next dose of Warfarin. Check guidelines (e.g., CHEST) for Vitamin K administration based on bleeding risk. Plan for frequent INR monitoring until stable." },
    { q: "What are the key counseling points for a patient starting on an MDI inhaler like Salbutamol?", a: "Model Answer: Explain the purpose (reliever medication). Demonstrate the 'shake, prime, breathe out, actuate while breathing in slowly, hold breath, rinse mouth' technique. Use the teach-back method to confirm their understanding. Discuss the importance of using a spacer." },
    { q: "What are the signs of serotonin syndrome?", a: "Model Answer: Key signs include mental status changes (agitation, confusion), autonomic hyperactivity (tachycardia, hypertension, fever, shivering), and neuromuscular abnormalities (tremor, hyperreflexia, myoclonus). It's crucial to identify the offending agents." },
];

const checklistItems = [
    "Print multiple copies of your updated CV.",
    "Prepare a one-page summary of your key projects or rotations.",
    "Research the company/hospital: its mission, recent news, key personnel.",
    "Prepare 3-5 thoughtful questions to ask the interviewers about the role, team, and culture.",
    "Confirm the location, time, and name of your interviewer(s) the day before.",
    "Plan your professional attire.",
];

export function ResourceLibraryClient() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Accordion type="multiple" defaultValue={['behavioral', 'checklist']} className="w-full space-y-6">
                <Card>
                    <AccordionItem value="behavioral">
                        <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
                            <div className="flex items-center gap-3"><FileQuestion className="text-primary"/>Common Behavioral Questions</div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <dl className="space-y-4">
                                {behavioralQuestions.map((item, index) => (
                                    <div key={index}>
                                        <dt className="font-semibold">{item.q}</dt>
                                        <dd className="text-sm text-muted-foreground pl-4 border-l-2 border-primary ml-2 mt-1 pt-1 pb-1">{item.a}</dd>
                                    </div>
                                ))}
                            </dl>
                        </AccordionContent>
                    </AccordionItem>
                </Card>

                <Card>
                    <AccordionItem value="clinical">
                        <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
                            <div className="flex items-center gap-3"><FileQuestion className="text-primary"/>Sample Clinical Questions</div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                             <dl className="space-y-4">
                                {clinicalQuestions.map((item, index) => (
                                    <div key={index}>
                                        <dt className="font-semibold">{item.q}</dt>
                                        <dd className="text-sm text-muted-foreground pl-4 border-l-2 border-primary ml-2 mt-1 pt-1 pb-1">{item.a}</dd>
                                    </div>
                                ))}
                            </dl>
                        </AccordionContent>
                    </AccordionItem>
                </Card>
                
                <Card>
                    <AccordionItem value="checklist">
                        <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
                             <div className="flex items-center gap-3"><CheckSquare className="text-primary"/>Pre-Interview Checklist</div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <ul className="space-y-3 list-disc list-inside">
                                {checklistItems.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Card>
            </Accordion>
        </div>
    )
}
