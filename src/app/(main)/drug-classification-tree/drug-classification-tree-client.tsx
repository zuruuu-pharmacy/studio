
"use client";

import { useState, useMemo, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { drugTreeData, type DrugClass } from "./data";
import { Search, Pill, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Recursive component to render a drug class node
function DrugNode({ node, level, filterText }: { node: DrugClass; level: number; filterText: string }) {
  // Determine if the node or any of its children match the filter
  const matchesFilter = useMemo(() => {
    if (!filterText) return true;
    const lowerFilter = filterText.toLowerCase();

    const checkNode = (n: DrugClass): boolean => {
      if (n.name.toLowerCase().includes(lowerFilter)) return true;
      if (n.drugs?.some(d => d.name.toLowerCase().includes(lowerFilter))) return true;
      return n.subclasses?.some(checkNode) || false;
    };

    return checkNode(node);
  }, [node, filterText]);

  if (!matchesFilter) {
    return null;
  }
  
  const hasSubclasses = node.subclasses && node.subclasses.length > 0;

  return (
    <div style={{ paddingLeft: `${level * 1.5}rem` }}>
      {hasSubclasses ? (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={node.name} className="border-b-0">
            <AccordionTrigger className={cn("py-2 hover:no-underline font-semibold", level > 0 && "text-base")}>
              <div className="flex items-center gap-2">
                <ChevronsRight className="h-4 w-4 text-primary shrink-0"/>
                <span>{node.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {node.drugs && node.drugs.length > 0 && (
                <div className="pl-6 pt-2 space-y-1">
                  {node.drugs.map((drug, index) => (
                    <div key={index} className="flex items-center gap-2 text-muted-foreground">
                      <Pill className="h-4 w-4 text-muted-foreground/70 shrink-0"/>
                      <span>{drug.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {node.subclasses?.map((subclass, index) => (
                <DrugNode key={index} node={subclass} level={level + 1} filterText={filterText} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div className="py-2">
            <h4 className="font-semibold flex items-center gap-2">
                 <ChevronsRight className="h-4 w-4 text-primary shrink-0"/>
                 {node.name}
            </h4>
            <div className="pl-6 pt-2 space-y-1">
                {node.drugs?.map((drug, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Pill className="h-4 w-4 text-muted-foreground/70 shrink-0"/>
                    <span>{drug.name}</span>
                </div>
                ))}
            </div>
        </div>
      )}
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
               {index < drugTreeData.length - 1 && <hr className="my-4"/>}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
