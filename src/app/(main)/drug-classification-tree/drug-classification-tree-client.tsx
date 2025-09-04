
"use client";

import { useState, useMemo, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { drugTreeData, type DrugClass, type Drug } from "./data";
import { Search, Pill, ChevronsRight, FlaskConical, Stethoscope, AlertTriangle, ShieldCheck, Beaker, FileText, Star, BrainCircuit, Package, Archive, FolderOpen, FileHeart, HelpCircle, CaseSensitive, BookCopy, PackageOpen, Microscope, TestTube, Library } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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
  const handleLearningToolClick = () => {
    toast({
      title: "Feature Coming Soon",
      description: "AI-powered generation of study materials is under development.",
    });
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
                    <Button onClick={handleLearningToolClick} className="w-full justify-start" variant="outline" disabled>
                        <FileHeart className="mr-2"/> Generate Flashcards (MOA + Brands)
                    </Button>
                     <Button onClick={handleLearningToolClick} className="w-full justify-start" variant="outline" disabled>
                        <HelpCircle className="mr-2"/> Generate Quiz (Clinical Use & ADRs)
                    </Button>
                     <Button onClick={handleLearningToolClick} className="w-full justify-start" variant="outline" disabled>
                        <CaseSensitive className="mr-2"/> Generate a Case-based MCQ
                    </Button>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
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
