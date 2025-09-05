"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Camera, Loader2, Pill, FlaskConical, AlertTriangle, ScanLine, ShieldCheck, FileText, BookCopy, HelpCircle, Leaf, Barcode, CheckCircle, Flag, Save, TestTube, User, Stethoscope, GitCompareArrows } from "lucide-react";
import { drugTreeData, Drug } from "@/app/(main)/drug-classification-tree/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";

const MOCK_SCANNABLES = [
    { type: 'drug', name: "Amoxicillin", stripPosition: { top: '20%', left: '15%' }, icon: Pill },
    { type: 'drug', name: "Paracetamol", stripPosition: { top: '55%', left: '55%' }, icon: Pill },
    { type: 'barcode', name: "Morphine", stripPosition: { top: '75%', left: '10%' }, icon: Barcode }, // Morphine is high-risk
    { type: 'herb', name: "Strychnine", stripPosition: { top: '15%', left: '65%' }, icon: Leaf }, // Using Strychnine as a sample herb from data
];

// Helper to find a drug by name in your data
const findDrugDetails = (drugName: string): Drug | null => {
    for (const category of drugTreeData) {
        for (const subclass of category.subclasses || []) {
             for (const subsubclass of subclass.subclasses || []) {
                 const drug = subsubclass.drugs?.find(d => d.name.toLowerCase() === drugName.toLowerCase());
                 if (drug) return drug;
            }
            const drug = subclass.drugs?.find(d => d.name.toLowerCase() === drugName.toLowerCase());
            if (drug) return drug;
        }
    }
    return null;
}

function DetailSection({ title, content, icon: Icon, className }: { title: string, content?: string, icon: React.ElementType, className?: string }) {
    if (!content) return null;
    return (
        <div className={cn("space-y-1", className)}>
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

function CompactOverlay({ item, onScan }: { item: { type: string, name: string, stripPosition: { top: string, left: string }, icon: React.ElementType }, onScan: (drugName: string, type: string) => void }) {
    const drug = findDrugDetails(item.name);
    if (!drug) return null;

    const handleActionClick = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        toast({ title: "Coming Soon!", description: `${action} functionality will be implemented soon.`});
    };

    return (
        <Card 
            className="absolute bg-white/90 dark:bg-black/90 backdrop-blur-sm p-3 rounded-lg shadow-xl w-64 border-primary/50"
            style={item.stripPosition}
        >
            <div className="flex flex-col gap-2">
                <div>
                    <p className="font-bold">{drug.name} <span className="font-normal text-sm text-muted-foreground">({drug.pharmaApplications.formulations})</span></p>
                    <p className="text-xs text-muted-foreground">{drug.pharmaApplications.dosageForms}</p>
                    <p className="text-xs text-muted-foreground">{drug.classification}</p>
                </div>
                 <div className="flex gap-1">
                    <Button size="sm" variant="secondary" className="flex-1 text-xs h-7" onClick={() => onScan(item.name, item.type)}>Details</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={(e) => handleActionClick(e, 'Interactions')}>Interactions</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={(e) => handleActionClick(e, 'Save')}>Save</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={(e) => handleActionClick(e, 'Quiz')}>Quiz Me</Button>
                </div>
            </div>
        </Card>
    );
}


export function ScanMedicineStripClient() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedItem, setScannedItem] = useState<{drug: Drug, type: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, []);

  const enableCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
      toast({ title: "Camera Enabled", description: "Point your camera at a scannable item." });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({ variant: "destructive", title: "Camera Access Denied", description: "Please enable camera permissions in your browser settings." });
      setHasCameraPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = (drugName: string, type: string) => {
    const details = findDrugDetails(drugName);
    if (details) {
        setScannedItem({ drug: details, type: type });
        setIsModalOpen(true);
    } else {
        toast({ variant: "destructive", title: "Drug Not Found", description: `Could not find details for ${drugName}.`})
    }
  }

  const isHighRisk = (drugName?: string) => {
    const highRiskDrugs = ["morphine", "warfarin", "insulin"];
    return highRiskDrugs.includes(drugName?.toLowerCase() || '');
  }
  
  const getRecognitionSource = (type: string) => {
      switch(type) {
          case 'barcode': return { source: 'Barcode Scan via GS1 Database', confidence: '98%' };
          case 'herb': return { source: 'Plant Recognition Model', confidence: '72%' };
          default: return { source: 'OCR Text Recognition', confidence: '95%' };
      }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Medicine Strip Scanner</CardTitle>
          <CardDescription>
            {hasCameraPermission 
              ? "Live camera feed active. Tap a card's 'Details' button."
              : "Enable your camera to scan medicine text, barcodes, or plant specimens."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {!hasCameraPermission && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                      {isLoading ? (
                          <Loader2 className="h-12 w-12 text-white animate-spin"/>
                      ) : (
                          <Button onClick={enableCamera} size="lg">
                              <Camera className="mr-2"/> Enable Camera
                          </Button>
                      )}
                  </div>
              )}
                {hasCameraPermission && (
                  <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 border-4 border-dashed border-white/50 rounded-lg pointer-events-none flex items-center justify-center">
                          <ScanLine className="h-16 w-16 text-white/50 animate-pulse"/>
                        </div>
                      {MOCK_SCANNABLES.map(item => (
                          <CompactOverlay key={item.name} item={item} onScan={handleScan} />
                      ))}
                  </div>
                )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
            {scannedItem && (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{scannedItem.drug.name} ({scannedItem.drug.pharmaApplications.formulations})</DialogTitle>
                        <DialogDescription>{scannedItem.drug.classification}</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-4">
                        
                        {isHighRisk(scannedItem.drug.name) && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4"/>
                                <AlertTitle>High-Risk Medication</AlertTitle>
                                <AlertDescription>Check dose & monitoring. Not for patient dosing without supervision.</AlertDescription>
                            </Alert>
                        )}
                        
                        <Card>
                            <CardHeader><CardTitle className="text-lg">Identification</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                               <DetailSection title="Generic Name" content={scannedItem.drug.name} icon={Pill} />
                               <DetailSection title="Brand(s)" content={scannedItem.drug.pharmaApplications.formulations} icon={Pill} />
                               <DetailSection title="Dosage Forms" content={scannedItem.drug.pharmaApplications.dosageForms} icon={Pill} />
                               <DetailSection title="Scan Info" content={`Source: ${getRecognitionSource(scannedItem.type).source} | Confidence: ${getRecognitionSource(scannedItem.type).confidence}`} icon={Barcode}/>
                            </CardContent>
                        </Card>
                        
                        <DetailSection title="Mechanism of Action" content={scannedItem.drug.moa} icon={FlaskConical} />

                        <Card>
                            <CardHeader><CardTitle className="text-lg">Clinical Information</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                               <DetailSection title="Therapeutic Uses" content={scannedItem.drug.therapeuticUses} icon={Stethoscope} />
                               <DetailSection title="Major Adverse Drug Reactions (ADRs)" content={scannedItem.drug.adrs} icon={AlertTriangle} />
                               <DetailSection title="Contraindications & Precautions" content={scannedItem.drug.contraindications} icon={ShieldCheck} />
                                <DetailSection title="Typical Dosing" content={"Dosing information not available in this mock data. A real implementation would show Adult, Pediatric, and Renal/Hepatic dosing here."} icon={User} />
                               <DetailSection title="Major Interactions" content={"Interaction data not available in this mock data."} icon={GitCompareArrows} />
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader><CardTitle className="text-lg">Pedagogical Actions</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                <Button size="sm" variant="secondary" onClick={() => toast({title: "Coming Soon!", description: "This will save the scan to your Notes Organizer."})}>Save Study Note</Button>
                                <Button size="sm" variant="secondary" onClick={() => toast({title: "Coming Soon!", description: "This will add flashcards to your deck."})}>Make Flashcards</Button>
                                <Button size="sm" variant="secondary" onClick={() => toast({title: "Coming Soon!", description: "This will launch a quiz on this drug."})}>Quiz Me</Button>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
