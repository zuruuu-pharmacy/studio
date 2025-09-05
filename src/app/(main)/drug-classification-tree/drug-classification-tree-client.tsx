
"use client";

import { useState, useMemo, Fragment, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { drugTreeData, type DrugClass, type Drug } from "./data";
import { Search, Pill, ChevronsRight, FlaskConical, Stethoscope, AlertTriangle, ShieldCheck, Beaker, FileText, Star, BrainCircuit, Package, Archive, FolderOpen, FileHeart, HelpCircle, CaseSensitive, BookCopy, PackageOpen, Microscope, TestTube, Library, Sparkles, Loader2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { generateFlashcardsFromDrug, type FlashcardGeneratorOutput } from "@/ai/flows/drug-card-flashcard-generator";
import { generateQuiz, type QuizGeneratorOutput } from "@/ai/flows/drug-card-quiz-generator";
import { generateCaseMcq, type CaseMcqGeneratorOutput } from "@/ai/flows/drug-card-case-mcq-generator";
import { motion } from "framer-motion";

// Learning Tools State & Components
type LearningToolState = {
  flashcards?: FlashcardGeneratorOutput;
  quiz?: QuizGeneratorOutput;
  caseMcq?: CaseMcqGeneratorOutput;
  error?: string;
  loading: 'flashcards' | 'quiz' | 'caseMcq' | null;
}

function Flashcard({ front, back }: { front: string; back: string }) {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="w-full h-48 [perspective:1000px] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
                <div className="absolute w-full h-full [backface-visibility:hidden] bg-card border rounded-lg flex items-center justify-center p-4 text-center">
                    <p className="font-semibold">{front}</p>
                </div>
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-primary text-primary-foreground border rounded-lg flex items-center justify-center p-4 text-center">
                    <p>{back}</p>
                </div>
            </motion.div>
        </div>
    );
}

// Section component for displaying details in the drug card
function DetailSection({ title, content, icon: Icon }: { title: string, content?: string, icon: React.ElementType }) {
    if (!content) return null;
    return (
        <div className="space-y-1">
            <h4 className="font-semibold text-base flex items-center gap-2 text-primary">
                <Icon className="h-4 w-4" />
                {title}
            </h4>
            <div className="pl-6 text-muted-foreground text-sm">
                <p className="whitespace-pre-wrap">{content}</p>
            </div>
        </div>
    );
}

// DrugCard component to display full details of a drug
function DrugCard({ drug }: { drug: Drug }) {
  const [learningState, setLearningState] = useState<LearningToolState>({ loading: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);

  const handleLearningToolClick = async (tool: 'flashcards' | 'quiz' | 'caseMcq') => {
    setIsModalOpen(true);
    setLearningState({ loading: tool });
    setIsQuizSubmitted(false);
    setSelectedQuizOption(null);
    try {
        if (tool === 'flashcards') {
            const result = await generateFlashcardsFromDrug({ drugName: drug.name, moa: drug.moa, brandNames: drug.pharmaApplications.formulations });
            setLearningState({ flashcards: result, loading: null });
        } else if (tool === 'quiz') {
            const result = await generateQuiz({ drugName: drug.name, classification: drug.classification, uses: drug.therapeuticUses, adrs: drug.adrs });
            setLearningState({ quiz: result, loading: null });
        } else if (tool === 'caseMcq') {
            const result = await generateCaseMcq({ drugName: drug.name, classification: drug.classification, uses: drug.therapeuticUses, adrs: drug.adrs, contraindications: drug.contraindications });
            setLearningState({ caseMcq: result, loading: null });
        }
    } catch (e) {
        console.error(e);
        setLearningState({ error: `Failed to generate ${tool}. Please try again.`, loading: null });
    }
  }
  
  const handleQuizSubmit = () => {
    if (selectedQuizOption !== null) {
      setIsQuizSubmitted(true);
    } else {
      toast({ variant: 'destructive', title: "Please select an answer." });
    }
  };

  const renderModalContent = () => {
    if (learningState.loading) {
        return <div className="flex flex-col items-center justify-center h-64 gap-2"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="text-muted-foreground">Generating {learningState.loading}...</p></div>;
    }
    if (learningState.error) {
        return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{learningState.error}</AlertDescription></Alert>;
    }
    if (learningState.flashcards) {
        return (
            <div className="space-y-4">
                {learningState.flashcards.flashcards.map((card, i) => <Flashcard key={i} front={card.front} back={card.back} />)}
            </div>
        );
    }
    if (learningState.quiz || learningState.caseMcq) {
        const quizData = learningState.quiz || learningState.caseMcq;
        if (!quizData) return null;
        const isCorrect = isQuizSubmitted && selectedQuizOption && quizData.correct_answer.startsWith(selectedQuizOption.charAt(0));

        return (
            <div className="space-y-4">
                {learningState.caseMcq && <p className="p-4 bg-muted/50 rounded-lg text-muted-foreground">{learningState.caseMcq.scenario}</p>}
                <p className="font-semibold">{quizData.question}</p>
                <RadioGroup onValueChange={setSelectedQuizOption} disabled={isQuizSubmitted}>
                    {quizData.options.map((opt, i) => {
                        const isThisOptionCorrect = quizData.correct_answer.startsWith(opt.charAt(0));
                        const isThisOptionSelected = selectedQuizOption === opt;
                        
                        let optionClass = "";
                        if (isQuizSubmitted) {
                            if(isThisOptionCorrect) optionClass = "text-green-600 font-bold";
                            else if (isThisOptionSelected && !isThisOptionCorrect) optionClass = "text-red-600 line-through";
                        }
                        
                        return (
                             <div key={i} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt} id={`opt-${i}`} />
                                <Label htmlFor={`opt-${i}`} className={cn("font-normal", optionClass)}>
                                    {opt}
                                </Label>
                             </div>
                        );
                    })}
                </RadioGroup>
                {!isQuizSubmitted ? (
                    <Button onClick={handleQuizSubmit}>Check Answer</Button>
                ) : (
                    <Alert variant={isCorrect ? "default" : "destructive"} className={isCorrect ? "border-green-500 bg-green-500/10" : ""}>
                        {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        <AlertTitle>{isCorrect ? 'Correct!' : 'Incorrect'}</AlertTitle>
                        <AlertDescription>
                            <strong>Explanation:</strong> {quizData.explanation}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        );
    }
    return null;
  }
  
  const getModalTitle = () => {
    if (learningState.flashcards) return `Flashcards for ${drug.name}`;
    if (learningState.quiz) return `Quiz for ${drug.name}`;
    if (learningState.caseMcq) return `Case MCQ for ${drug.name}`;
    return "Learning Tool";
  }

  return (
    <Card className="my-2 bg-muted/30 shadow-inner">
      <CardHeader>
        <CardTitle className="text-2xl">{drug.name}</CardTitle>
        <CardDescription>{drug.classification}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="clinical">Clinical</TabsTrigger>
                <TabsTrigger value="pharma">Pharma</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="pt-4 space-y-4">
                <DetailSection title="Mechanism of Action" content={drug.moa} icon={BrainCircuit} />
                <div className="p-4 bg-amber-100/50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-md">
                    <h4 className="font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400"><Star/>Exam Highlights & Special Notes</h4>
                    <p className="text-sm text-muted-foreground mt-1">{drug.specialNotes}</p>
                </div>
            </TabsContent>
            <TabsContent value="clinical" className="pt-4 space-y-4">
                 <DetailSection title="Therapeutic Uses" content={drug.therapeuticUses} icon={Stethoscope} />
                 <DetailSection title="Adverse Effects (ADRs)" content={drug.adrs} icon={AlertTriangle} />
                 <DetailSection title="Contraindications" content={drug.contraindications} icon={ShieldCheck} />
            </TabsContent>
             <TabsContent value="pharma" className="pt-4 space-y-4">
                 <DetailSection title="Dosage Forms" content={drug.pharmaApplications.dosageForms} icon={Pill} />
                 <DetailSection title="Market Formulations" content={drug.pharmaApplications.formulations} icon={Package} />
                 <DetailSection title="Storage & Stability" content={drug.pharmaApplications.storage} icon={Archive} />
            </TabsContent>
             <TabsContent value="analysis" className="pt-4 space-y-4">
                 <DetailSection title="Qualitative Analysis" content={drug.analyticalMethods.qualitative} icon={Microscope} />
                 <DetailSection title="Quantitative Analysis" content={drug.analyticalMethods.quantitative} icon={TestTube} />
                 <DetailSection title="Pharmacopoeial Standards" content={drug.analyticalMethods.pharmacopoeial} icon={Library} />
            </TabsContent>
        </Tabs>
        
        <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="learning" className="border rounded-md px-4 bg-background">
                <AccordionTrigger className="hover:no-underline font-semibold text-base">
                    <div className="flex items-center gap-2"><FolderOpen/>Integration with Learning</div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-3">
                    <Button onClick={() => handleLearningToolClick('flashcards')} className="w-full justify-start" variant="outline">
                        <FileHeart className="mr-2"/> Generate Flashcards (MOA + Brands)
                    </Button>
                     <Button onClick={() => handleLearningToolClick('quiz')} className="w-full justify-start" variant="outline">
                        <HelpCircle className="mr-2"/> Generate Quiz (Clinical Use & ADRs)
                    </Button>
                     <Button onClick={() => handleLearningToolClick('caseMcq')} className="w-full justify-start" variant="outline">
                        <CaseSensitive className="mr-2"/> Generate a Case-based MCQ
                    </Button>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getModalTitle()}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {renderModalContent()}
                </div>
            </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}


// Recursive component to render a drug class node
function DrugNode({ node, level, filterText }: { node: DrugClass; level: number; filterText: string }) {
  const lowerFilter = filterText.toLowerCase();

  const filteredDrugs = useMemo(() => 
    node.drugs?.filter(d => d.name.toLowerCase().includes(lowerFilter)) || [], 
    [node.drugs, lowerFilter]
  );
  
  const hasVisibleChildren = useMemo(() => {
    if (!filterText) return true; // If no filter, everything is visible by default
    if (node.name.toLowerCase().includes(lowerFilter)) return true;
    if (filteredDrugs.length > 0) return true;

    const checkSubclasses = (subclasses: DrugClass[] | undefined): boolean => {
        if (!subclasses) return false;
        return subclasses.some(sub => 
            sub.name.toLowerCase().includes(lowerFilter) || 
            sub.drugs?.some(d => d.name.toLowerCase().includes(lowerFilter)) ||
            checkSubclasses(sub.subclasses)
        );
    };

    return checkSubclasses(node.subclasses);
  }, [node, lowerFilter, filteredDrugs]);


  if (!hasVisibleChildren) {
    return null;
  }
  
  const hasSubclasses = node.subclasses && node.subclasses.length > 0;
  const hasDrugs = node.drugs && node.drugs.length > 0;

  return (
    <div style={{ paddingLeft: `${level * 1}rem` }} className="border-l border-primary/20">
        <Accordion type="single" collapsible className="w-full" defaultValue={filterText ? node.name : undefined}>
          <AccordionItem value={node.name} className="border-b-0">
            <AccordionTrigger className={cn("py-2 hover:no-underline font-semibold", level > 0 && "text-base")}>
              <div className="flex items-center gap-2">
                <ChevronsRight className="h-4 w-4 text-primary shrink-0"/>
                <span>{node.name}</span>
                {node.pharmaFocus && <Badge variant="outline">Pharma Focus</Badge>}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4">
              {node.pharmaFocus && (
                <div className="italic text-sm text-muted-foreground mb-4 p-2 bg-background rounded-md">
                    {node.pharmaFocus}
                </div>
              )}
              {hasDrugs && (
                <Accordion type="multiple" className="w-full">
                    {node.drugs?.map((drug, index) => (
                        (filterText && !drug.name.toLowerCase().includes(lowerFilter)) ? null : (
                             <AccordionItem value={drug.name} key={index} className="border-0">
                                <AccordionTrigger className="hover:no-underline text-primary/90 font-medium py-1">
                                    <div className="flex items-center gap-2"><Pill className="h-4 w-4"/>{drug.name}</div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2">
                                    <DrugCard drug={drug}/>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    ))}
                </Accordion>
              )}
              {hasSubclasses && node.subclasses?.map((subclass, index) => (
                <DrugNode key={index} node={subclass} level={level + 1} filterText={filterText} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
    </div>
  );
}

export function DrugClassificationTreeClient() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drug Classification Tree</CardTitle>
        <CardDescription>
          Explore drug classes and their relationships. Click on a category to expand it.
        </CardDescription>
         <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for a drug or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-lg bg-muted/50 max-h-[80vh] overflow-y-auto">
          {drugTreeData.map((rootNode, index) => (
            <Fragment key={index}>
              <DrugNode node={rootNode} level={0} filterText={searchTerm} />
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
