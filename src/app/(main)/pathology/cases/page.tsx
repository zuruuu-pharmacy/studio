
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
import { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";


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
  imageHint: z.string().optional(),
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

function NewCaseDialog({ onCaseSubmit }: { onCaseSubmit: (data: NewCaseValues) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const newCaseForm = useForm<NewCaseValues>({
    resolver: zodResolver(newCaseSchema),
    defaultValues: {
      title: "",
      history: "",
      specialty: "",
      findings: "",
      diagnosis: "",
      discussion: "",
      imageHint: "",
      tags: { organ: "", type: "", difficulty: "" },
      quiz: [{ question: "", options: ["", "", "", ""], answer: "" }],
    },
  });

  const { fields, append } = useFieldArray({
    control: newCaseForm.control,
    name: "quiz"
  });

  const handleCreateCase = newCaseForm.handleSubmit((data) => {
    onCaseSubmit(data);
    newCaseForm.reset();
    setIsModalOpen(false);
  });
  
  const questionCount = newCaseForm.watch('quiz').length;

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Card className="flex items-center justify-center border-2 border-dashed min-h-64 hover:border-primary hover:text-primary transition cursor-pointer">
              <div className="text-center">
                <Plus className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 font-semibold">Submit a New Case</p>
              </div>
            </Card>
          </motion.div>
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
            <FormField name="imageHint" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Image Hint (Optional)</FormLabel><FormControl><Input {...field} placeholder="e.g., 'lung cancer histology'" /></FormControl><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-3 gap-4">
              <FormField name="tags.organ" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Organ Tag</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="tags.type" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Type Tag</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField name="tags.difficulty" control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Difficulty Tag</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div>
              <Label>Quiz Questions ({questionCount})</Label>
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 mt-2 space-y-2">
                  <FormField name={`quiz.${index}.question`} control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Question</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name={`quiz.${index}.options.0`} control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Option 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name={`quiz.${index}.options.1`} control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Option 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name={`quiz.${index}.options.2`} control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Option 3</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name={`quiz.${index}.options.3`} control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Option 4</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name={`quiz.${index}.answer`} control={newCaseForm.control} render={({ field }) => (<FormItem><FormLabel>Correct Answer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit">Submit Case</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


export default function PathologyCasesPage() {
  const { caseStudies, addCaseStudy, completedCases, toggleCaseCompletion } = usePathology();
  const [searchTerm, setSearchTerm] = useState("");
  const [organFilter, setOrganFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filterOptions = useMemo(() => {
    const organs = new Set<string>();
    const difficulties = new Set<string>();
    const types = new Set<string>();
    caseStudies.forEach(c => {
      organs.add(c.tags.organ);
      difficulties.add(c.tags.difficulty);
      types.add(c.tags.type);
    });
    return {
      organs: Array.from(organs),
      difficulties: Array.from(difficulties),
      types: Array.from(types),
    };
  }, [caseStudies]);
  
  const filteredCases = useMemo(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    return caseStudies.filter(study => {
        const matchesSearch = searchTerm === "" || 
                              study.title.toLowerCase().includes(lowercasedSearch) || 
                              study.history.toLowerCase().includes(lowercasedSearch) ||
                              study.diagnosis.toLowerCase().includes(lowercasedSearch);
        const matchesOrgan = organFilter === "All" || study.tags.organ === organFilter;
        const matchesDifficulty = difficultyFilter === "All" || study.tags.difficulty === difficultyFilter;
        const matchesType = typeFilter === "All" || study.tags.type === typeFilter;

        return matchesSearch && matchesOrgan && matchesDifficulty && matchesType;
    });
  }, [caseStudies, searchTerm, organFilter, difficultyFilter, typeFilter]);

  
  const handleCreateCase = (data: NewCaseValues) => {
    const newCase: Omit<CaseStudy, 'id'> = {
      ...data,
      quiz: data.quiz.map(q => ({
        ...q,
        options: q.options.filter(o => o.trim() !== ''),
      })),
    };
    addCaseStudy(newCase);
    toast({ title: "Case Study Submitted!", description: "Your new case has been added to the library." });
  };

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
          <CardTitle className="flex items-center gap-2"><Filter />Filter & Search</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by disease, organ, or keyword..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={organFilter} onValueChange={setOrganFilter}>
            <SelectTrigger className="w-full md:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="All">All Organ Systems</SelectItem>{filterOptions.organs.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="All">All Difficulties</SelectItem>{filterOptions.difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="All">All Case Types</SelectItem>{filterOptions.types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
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
        {filteredCases.map((study) => (
          <Dialog key={study.id}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.03, y: -5 }} className="cursor-pointer">
                  <Card className="shadow-lg hover:shadow-primary/20 transition-shadow rounded-2xl flex flex-col h-full group">
                    <CardHeader>
                      {completedCases.has(study.id) && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 z-10">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                      <CardTitle className="font-bold text-lg flex-grow">{study.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-grow flex flex-col">
                      <div className="flex flex-wrap gap-2 mt-3">
                        {Object.values(study.tags).filter(Boolean).map((tag, i) => <Badge key={i} variant="secondary">{tag}</Badge>)}
                      </div>
                      <Button className="mt-4 w-full mt-auto">View Case Details</Button>
                    </CardContent>
                  </Card>
              </motion.div>
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
                      <Link href="/clinical-case-simulator"><Button variant="outline" size="sm">Case Simulation</Button></Link>
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
                    <AlertTitle className="flex items-center gap-2 font-bold"><CheckCircle />Final Diagnosis</AlertTitle>
                    <AlertDescription>{study.diagnosis}</AlertDescription>
                  </Alert>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2"><Lightbulb />AI Tutor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => toast({ title: "AI Analysis (Coming Soon)", description: "This feature will provide an AI-generated breakdown of the case." })} className="w-full">
                        <Bot className="mr-2" />Explain this Case
                      </Button>
                    </CardContent>
                  </Card>

                  <Button onClick={() => toggleCaseCompletion(study.id)} variant={completedCases.has(study.id) ? "destructive" : "default"} className="w-full">
                    {completedCases.has(study.id) ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </Button>

                  <Button onClick={() => toast({ title: "Coming soon!" })} variant="outline" className="w-full">
                    <Download className="mr-2" />Export as PDF
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
        <NewCaseDialog onCaseSubmit={handleCreateCase} />
      </div>
    </div>
  );
}
