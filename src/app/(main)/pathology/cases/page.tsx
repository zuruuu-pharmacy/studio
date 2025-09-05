
"use client";

import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Microscope, FileText, Plus, Zap, Notebook, CheckCircle, Lightbulb, Search, Filter, Stethoscope, ZoomIn, ZoomOut, MessageCircle, GitCompareArrows, Download, Bot } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { usePathology, type CaseStudy } from "@/contexts/pathology-context";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


function DetailSection({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) {
    return (
        <div className="mt-4">
            <h4 className="font-semibold text-base mb-2 flex items-center gap-2"><Icon className="h-5 w-5 text-primary"/>{title}</h4>
            <div className="pl-7 text-muted-foreground text-sm space-y-2 border-l-2 border-primary/20 ml-2.5 pl-4 pb-2">
              {children}
            </div>
        </div>
    )
}

const newCaseSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters."),
  history: z.string().min(20, "History must be detailed."),
  specialty: z.string().min(3, "Specialty is required."),
  findings: z.string().min(10, "Findings are required."),
  diagnosis: z.string().min(5, "Diagnosis is required."),
  discussion: z.string().min(20, "Discussion is required."),
  imageUrl: z.string().url("Please enter a valid image URL.").optional().or(z.literal('')),
  tags: z.object({
    organ: z.string().min(1),
    type: z.string().min(1),
    difficulty: z.string().min(1),
  }),
  quiz: z.array(z.object({
    question: z.string().min(5),
    options: z.array(z.string()).length(4, "Must have 4 options."),
    answer: z.string().min(1),
  })).min(1, "At least one quiz question is required."),
});

type NewCaseValues = z.infer<typeof newCaseSchema>;

export default function PathologyCasesPage() {
  const { caseStudies, addCaseStudy, completedCases, toggleCaseCompletion } = usePathology();
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  const newCaseForm = useForm<NewCaseValues>({
    resolver: zodResolver(newCaseSchema),
    defaultValues: {
        title: "",
        history: "",
        specialty: "",
        findings: "",
        diagnosis: "",
        discussion: "",
        imageUrl: "",
        tags: { organ: "", type: "", difficulty: "" },
        quiz: [{ question: "", options: ["", "", "", ""], answer: "" }],
    },
  });

  const { fields, append } = useFieldArray({
    control: newCaseForm.control,
    name: "quiz"
  });
  
  const handleAiAnalysis = () => {
    toast({
      title: "AI Analysis (Coming Soon)",
      description: "This feature will provide an AI-generated breakdown of the case, differential diagnoses, and key learning points."
    });
  };

  const handleCreateCase = newCaseForm.handleSubmit((data) => {
    const newCase: Omit<CaseStudy, 'id' | 'imageHint'> = {
        ...data,
        imageUrl: data.imageUrl || `https://picsum.photos/seed/${data.title.split(' ')[0]}/600/400`,
        quiz: data.quiz.map(q => ({
            ...q,
            options: q.options.filter(o => o.trim() !== ''),
        })),
    };
    addCaseStudy(newCase as Omit<CaseStudy, 'id'>);
    toast({ title: "Case Study Submitted!", description: "Your new case has been added to the library." });
    newCaseForm.reset();
    setIsNewCaseModalOpen(false);
  });

  const progressPercentage = caseStudies.length > 0 ? (completedCases.size / caseStudies.length) * 100 : 0;

  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Pathology Case Studies</h1>
      <p className="text-muted-foreground mb-6">
        Review clinical vignettes and corresponding histopathology to develop your diagnostic skills.
      </p>

       <Card className="mb-6">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Filter/>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search by disease, organ, or keyword..." className="pl-10" />
            </div>
            <Select><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Organ System" /></SelectTrigger><SelectContent><SelectItem value="lung">Lung</SelectItem><SelectItem value="heart">Heart</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Difficulty" /></SelectTrigger><SelectContent><SelectItem value="classic">Classic</SelectItem><SelectItem value="complex">Complex</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Case Type" /></SelectTrigger><SelectContent><SelectItem value="neoplastic">Neoplastic</SelectItem><SelectItem value="inflammatory">Inflammatory</SelectItem></SelectContent></Select>
        </CardContent>
       </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">You have completed {completedCases.size} of {caseStudies.length} cases.</p>
              <Progress value={progressPercentage} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.map((study) => (
          <Dialog key={study.id}>
            <DialogTrigger asChild>
                <Card className="shadow-lg hover:shadow-primary/20 transition-shadow rounded-2xl flex flex-col cursor-pointer hover:scale-105 duration-300 group">
                    <CardHeader className="p-0">
                         <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
                           <Image src={study.imageUrl} alt={study.title} layout="fill" objectFit="cover" data-ai-hint={study.imageHint} />
                            {completedCases.has(study.id) && (
                              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                <CheckCircle className="h-5 w-5"/>
                              </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow flex flex-col">
                        <h2 className="font-bold text-lg flex-grow">{study.title}</h2>
                        <div className="flex flex-wrap gap-2 mt-3">
                           {Object.values(study.tags).filter(Boolean).map((tag, i) => <Badge key={i}>{tag}</Badge>)}
                        </div>
                        <Button className="mt-4 w-full">View Case Details</Button>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-xl">{study.title}</DialogTitle>
                <DialogDescription>{study.specialty}</DialogDescription>
              </DialogHeader>
              <div className="grid lg:grid-cols-5 gap-6 max-h-[80vh] overflow-y-auto pr-4">
                 <div className="lg:col-span-3 space-y-4">
                    <DetailSection title="Clinical Vignette" icon={Stethoscope}>
                        <p>{study.history}</p>
                    </DetailSection>

                    <DetailSection title="Histopathology" icon={Microscope}>
                       <p>{study.findings}</p>
                       <div className="relative w-full aspect-video rounded-lg overflow-hidden my-2 group bg-muted">
                            <Image src={study.imageUrl} alt={`Slide for ${study.title}`} layout="fill" objectFit="cover" data-ai-hint={study.imageHint} />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <Button size="icon" variant="secondary"><ZoomIn/></Button>
                                <Button size="icon" variant="secondary"><ZoomOut/></Button>
                                <Button size="icon" variant="secondary"><MessageCircle/></Button>
                            </div>
                        </div>
                    </DetailSection>
                    
                    <DetailSection title="Diagnostic Flow & Discussion" icon={GitCompareArrows}>
                        <p>{study.discussion}</p>
                    </DetailSection>
                    
                     <DetailSection title="Practice Questions & Revision" icon={Zap}>
                        <div className="space-y-2">
                           <p className="font-semibold text-sm mb-2">{study.quiz[0].question}</p>
                            <Alert className="text-sm"><AlertDescription><strong>Answer:</strong> {study.quiz[0].answer}</AlertDescription></Alert>
                        </div>
                         <div className="flex flex-wrap gap-2 mt-4">
                             <Link href="/mcq-bank"><Button variant="outline" size="sm">More MCQs</Button></Link>
                             <Link href="/flashcard-generator"><Button variant="outline" size="sm">Make Flashcards</Button></Link>
                         </div>
                    </DetailSection>

                    <DetailSection title="Community Discussion" icon={MessageCircle}>
                        <div className="p-4 text-center bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Community discussion for this case is not yet active.</p>
                            <Link href="/student-discussion-forum"><Button variant="link" size="sm">Go to Forum</Button></Link>
                        </div>
                    </DetailSection>
                 </div>
                 <div className="lg:col-span-2 space-y-4">
                    <Alert variant="default" className="bg-green-500/10 border-green-500">
                        <AlertTitle className="flex items-center gap-2 font-bold"><CheckCircle/>Final Diagnosis</AlertTitle>
                        <AlertDescription>{study.diagnosis}</AlertDescription>
                    </Alert>
                    
                    <Card>
                        <CardHeader>
                             <CardTitle className="text-lg flex items-center gap-2"><Lightbulb/>AI Tutor</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Button onClick={handleAiAnalysis} className="w-full">
                               <Bot className="mr-2"/>Explain this Case
                            </Button>
                        </CardContent>
                    </Card>

                    <Button onClick={() => toggleCaseCompletion(study.id)} variant={completedCases.has(study.id) ? "destructive" : "default"} className="w-full">
                      {completedCases.has(study.id) ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </Button>

                    <Button onClick={() => toast({title: "Coming soon!"})} variant="outline" className="w-full">
                       <Download className="mr-2"/>Export as PDF
                    </Button>
                 </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
         <Dialog open={isNewCaseModalOpen} onOpenChange={setIsNewCaseModalOpen}>
            <DialogTrigger asChild>
                <Card className="flex items-center justify-center border-2 border-dashed min-h-64 hover:border-primary hover:text-primary transition">
                    <div className="text-center">
                        <Plus className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 font-semibold">Submit a New Case</p>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Submit a New Pathology Case</DialogTitle>
                    <DialogDescription>Contribute to the case library by filling out the form below.</DialogDescription>
                </DialogHeader>
                 <Form {...newCaseForm}>
                    <form onSubmit={handleCreateCase} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                        <FormField name="title" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Case Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="specialty" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Specialty</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="history" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Clinical Vignette / History</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="findings" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Histopathology Findings</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="diagnosis" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Final Diagnosis</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="discussion" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Discussion</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="imageUrl" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        
                        <div className="grid grid-cols-3 gap-4">
                            <FormField name="tags.organ" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Organ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="tags.type" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name="tags.difficulty" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Difficulty</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        <div>
                            <Label>Quiz Question</Label>
                             <Card className="p-4 mt-2 space-y-2">
                                <FormField name="quiz.0.question" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Question</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="quiz.0.options.0" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Option 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="quiz.0.options.1" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Option 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="quiz.0.options.2" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Option 3</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="quiz.0.options.3" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Option 4</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField name="quiz.0.answer" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Correct Answer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             </Card>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Submit Case</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
         </Dialog>
      </div>
    </div>
  );
}
