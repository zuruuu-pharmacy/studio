
"use client";

import { useState } from 'react';
import { BackButton } from "@/components/back-button";
import { InteractionClient } from "./interaction-client";
import { DrugFoodInteractionClient } from './drug-food-interaction-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, Salad } from 'lucide-react';


export default function InteractionCheckerPage() {
  const [activeTab, setActiveTab] = useState("multi-drug");

  return (
      <div>
        <BackButton />
        <h1 className="text-3xl font-bold mb-2 font-headline">AI Interaction Engine</h1>
        <p className="text-muted-foreground mb-6">
           Check for drug-drug or drug-food interactions. Select a checker below.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="multi-drug">
              <FlaskConical className="mr-2"/>
              Drug-Drug Interaction
            </TabsTrigger>
            <TabsTrigger value="drug-food">
              <Salad className="mr-2"/>
              Drug-Food Interaction
            </TabsTrigger>
          </TabsList>
          <TabsContent value="multi-drug" className="mt-6">
            <InteractionClient />
          </TabsContent>
          <TabsContent value="drug-food" className="mt-6">
            <DrugFoodInteractionClient />
          </TabsContent>
        </Tabs>
      </div>
  );
}
