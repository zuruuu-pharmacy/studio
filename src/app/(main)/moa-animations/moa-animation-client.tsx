
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Video } from "lucide-react";

// Placeholder data simulating what would come from Firebase
const animations = [
  {
    id: '1',
    title: 'Aspirin: COX-1 and COX-2 Inhibition',
    description: 'This animation shows how Aspirin irreversibly inhibits cyclooxygenase (COX) enzymes, preventing the conversion of arachidonic acid into prostaglandins and thromboxanes, which reduces pain, inflammation, and platelet aggregation.',
    drugClass: 'NSAID',
    system: 'CVS/Pain',
    thumbnailUrl: 'https://picsum.photos/600/400?random=1',
    videoUrl: 'placeholder.mp4'
  },
  {
    id: '2',
    title: 'Metformin: Action in the Liver',
    description: 'Discover how Metformin decreases hepatic glucose production, reduces glucose absorption in the gut, and improves insulin sensitivity by increasing peripheral glucose uptake.',
    drugClass: 'Biguanide',
    system: 'Endocrine',
    thumbnailUrl: 'https://picsum.photos/600/400?random=2',
    videoUrl: 'placeholder.mp4'
  },
  {
    id: '3',
    title: 'Lisinopril: ACE Inhibition',
    description: 'A visual guide to how ACE inhibitors like Lisinopril block the conversion of Angiotensin I to Angiotensin II, leading to vasodilation and reduced blood pressure.',
    drugClass: 'ACE Inhibitor',
    system: 'CVS',
    thumbnailUrl: 'https://picsum.photos/600/400?random=3',
    videoUrl: 'placeholder.mp4'
  },
  {
    id: '4',
    title: 'Sertraline: Selective Serotonin Reuptake Inhibition (SSRI)',
    description: 'This animation illustrates how Sertraline selectively blocks the reuptake of serotonin in the presynaptic neuron, increasing serotonin levels in the synaptic cleft and helping to regulate mood.',
    drugClass: 'SSRI',
    system: 'CNS',
    thumbnailUrl: 'https://picsum.photos/600/400?random=4',
    videoUrl: 'placeholder.mp4'
  },
  {
    id: '5',
    title: 'Atorvastatin: HMG-CoA Reductase Inhibition',
    description: 'Learn how statins like Atorvastatin competitively inhibit HMG-CoA reductase, a key enzyme in the cholesterol synthesis pathway, leading to lower LDL cholesterol levels.',
    drugClass: 'Statin',
    system: 'CVS',
    thumbnailUrl: 'https://picsum.photos/600/400?random=5',
    videoUrl: 'placeholder.mp4'
  },
    {
    id: '6',
    title: 'Salbutamol: Beta-2 Agonist Action',
    description: 'See how Salbutamol, a short-acting beta-2 adrenergic receptor agonist, causes smooth muscle relaxation in the airways, resulting in bronchodilation.',
    drugClass: 'SABA',
    system: 'Respiratory',
    thumbnailUrl: 'https://picsum.photos/600/400?random=6',
    videoUrl: 'placeholder.mp4'
  },
];

type Animation = typeof animations[0];

export function MoaAnimationClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnimation, setSelectedAnimation] = useState<Animation | null>(null);

  const filteredAnimations = useMemo(() => {
    if (!searchTerm) return animations;
    const lowercasedFilter = searchTerm.toLowerCase();
    return animations.filter(
      (anim) =>
        anim.title.toLowerCase().includes(lowercasedFilter) ||
        anim.drugClass.toLowerCase().includes(lowercasedFilter) ||
        anim.system.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search the Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by drug name, class, or system..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimations.map((anim) => (
          <Dialog key={anim.id} onOpenChange={(open) => !open && setSelectedAnimation(null)}>
            <DialogTrigger asChild>
                <Card 
                    className="cursor-pointer group overflow-hidden" 
                    onClick={() => setSelectedAnimation(anim)}
                >
                    <CardHeader className="p-0">
                        <div className="relative h-48 w-full">
                           <Image 
                             src={anim.thumbnailUrl} 
                             alt={anim.title} 
                             layout="fill"
                             objectFit="cover"
                             className="group-hover:scale-105 transition-transform duration-300"
                           />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Video className="h-12 w-12 text-white/70 group-hover:text-white transition-colors"/>
                           </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <CardTitle className="text-lg mb-2">{anim.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{anim.drugClass}</Badge>
                            <Badge variant="outline">{anim.system}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            {selectedAnimation && selectedAnimation.id === anim.id && (
                <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedAnimation.title}</DialogTitle>
                  <DialogDescription>
                    {selectedAnimation.drugClass} | {selectedAnimation.system}
                  </DialogDescription>
                </DialogHeader>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">[Video Player Placeholder]</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Mechanism of Action</h3>
                  <p className="text-muted-foreground">{selectedAnimation.description}</p>
                </div>
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>

       {filteredAnimations.length === 0 && (
          <Card className="text-center py-12">
            <CardHeader>
                 <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle>No Animations Found</CardTitle>
                <CardDescription>
                    Your search for "{searchTerm}" did not match any animations.
                </CardDescription>
            </CardHeader>
        </Card>
      )}
    </div>
  );
}
