
"use client";

import { useState, useMemo, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { drugTreeData, type DrugClass, type Drug } from "./data";
import { Search, Pill, ChevronsRight, FlaskConical, Stethoscope, AlertTriangle, ShieldCheck, Beaker, FileText, Star, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Section component for displaying details in the drug card
function DetailSection({ title, content, icon: Icon, isList = false }: { title: string, content?: string | string[], icon: React.ElementType, isList?: boolean }) {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;
    return (
        <div className="space-y-1">
            <h4 className="font-semibold text-base flex items-center gap-2 text-primary">
                <Icon className="h-4 w-4" />
                {title}
            </h4>
            <div className="pl-6 text-muted-foreground text-sm">
                 {isList && Array.isArray(content) ? (
                    <ul className="list-disc list-inside">
                        {content.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                 ) : (
                    <p className="whitespace-pre-wrap">{content as string}</p>
                 )}
            </div>
        </div>
    );
}

// DrugCard component to display full details of a drug
function DrugCard({ drug }: { drug: Drug }) {
  return (
    <Card className="my-2 bg-muted/30">
      <CardHeader>
        <CardTitle>{drug.name}</CardTitle>
        <CardDescription>{drug.classification}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailSection title="Mechanism of Action" content={drug.moa} icon={BrainCircuit} />
        <DetailSection title="Therapeutic Uses" content={drug.therapeuticUses} icon={Stethoscope} />
        <DetailSection title="Adverse Effects (ADRs)" content={drug.adrs} icon={AlertTriangle} />
        <DetailSection title="Contraindications" content={drug.contraindications} icon={ShieldCheck} />
        
        <Accordion type="multiple" className="w-full space-y-2">
            <AccordionItem value="pharma" className="border rounded-md px-4 bg-background">
                 <AccordionTrigger className="hover:no-underline font-semibold">
                    <div className="flex items-center gap-2"><FlaskConical/>Pharmaceutical Details</div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 space-y-4">
                    <DetailSection title="Dosage Forms" content={drug.pharmaApplications.dosageForms} icon={Pill} />
                    <DetailSection title="Market Formulations" content={drug.pharmaApplications.formulations} icon={Pill} />
                    <DetailSection title="Storage" content={drug.pharmaApplications.storage} icon={Pill} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="analysis" className="border rounded-md px-4 bg-background">
                <AccordionTrigger className="hover:no-underline font-semibold">
                    <div className="flex items-center gap-2"><Beaker/>Analytical Methods</div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 space-y-4">
                    <DetailSection title="Qualitative" content={drug.analyticalMethods.qualitative} icon={FileText} />
                    <DetailSection title="Quantitative" content={drug.analyticalMethods.quantitative} icon={FileText} />
                    <DetailSection title="Pharmacopoeial Standards" content={drug.analyticalMethods.pharmacopoeial} icon={FileText} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        
        <div className="p-3 bg-amber-100/50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-md">
            <h4 className="font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400"><Star/>Special Notes</h4>
            <p className="text-sm text-muted-foreground mt-1">{drug.specialNotes}</p>
        </div>
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
