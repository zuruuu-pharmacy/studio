
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Camera, Loader2, Pill, FlaskConical, AlertTriangle, ScanLine, ShieldCheck, FileText, BookCopy, HelpCircle, Leaf, Barcode, CheckCircle, Flag, Save, TestTube, User, Stethoscope, GitCompareArrows, Archive, Microscope, Book, Package, Volume2, Camera as CameraIcon } from "lucide-react";
import { drugTreeData, Drug } from "@/app/(main)/drug-classification-tree/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const MOCK_SCANNABLES = [
    { type: 'drug', name: "Amoxicillin", stripPosition: { top: '20%', left: '15%' }, icon: Pill, risk: 'amber' },
    { type: 'drug', name: "Paracetamol", stripPosition: { top: '55%', left: '55%' }, icon: Pill, risk: 'green' },
    { type: 'barcode', name: "Morphine", stripPosition: { top: '75%', left: '10%' }, icon: Barcode, risk: 'red' },
    { type: 'herb', name: "Strychnine", stripPosition: { top: '15%', left: '65%' }, icon: Leaf, risk: 'red' },
];

const riskColors: { [key: string]: string } = {
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500'
}

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

function CompactOverlay({ item, onScan }: { item: { type: string, name: string, stripPosition: { top: string, left: string }, icon: React.ElementType, risk: string }, onScan: (drugName: string, type: string) => void }) {
    const drug = findDrugDetails(item.name);
    if (!drug) return null;

    const handleActionClick = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        toast({ title: "Coming Soon!", description: `${action} functionality will be implemented soon.`});
    };
    
    return (
        <div 
            className="absolute p-1 border-2 border-dashed border-white/50 rounded-lg group"
            style={item.stripPosition}
        >
            <div 
                className="bg-white/90 dark:bg-black/90 backdrop-blur-sm p-2 rounded-lg shadow-xl w-64 border-l-4"
                style={{ borderColor: riskColors[item.risk] }}
            >
                <div className="flex gap-2 cursor-pointer" onClick={() => onScan(item.name, item.type)}>
                    <item.icon className="h-6 w-6 text-primary mt-1" />
                    <div className="flex-1 space-y-1">
                        <p className="font-bold text-sm">{drug.name} ({drug.pharmaApplications.formulations.split(',')[0]})</p>
                        <p className="text-xs text-muted-foreground">{drug.classification}</p>
                    </div>
                </div>
                 <div className="flex gap-1 justify-around border-t mt-2 pt-1">
                    <Button variant="ghost" size="sm" className="h-auto text-xs" onClick={() => onScan(item.name, item.type)}>Details</Button>
                    <Button variant="ghost" size="sm" className="h-auto text-xs" onClick={(e) => handleActionClick(e, 'Interactions')}>Interactions</Button>
                    <Button variant="ghost" size="sm" className="h-auto text-xs" onClick={(e) => handleActionClick(e, 'Save')}>Save</Button>
                    <Button variant="ghost" size="sm" className="h-auto text-xs" onClick={(e) => handleActionClick(e, 'Quiz')}>Quiz</Button>
                 </div>
            </div>
        </div>
    );
}


export function ScanMedicineStripClient() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedItem, setScannedItem] = useState<{drug: Drug, type: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isOffline, setIsOffline] = useState(false);
  const CACHED_DRUGS = ["Amoxicillin", "Paracetamol"];
  
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
    if (isOffline && !CACHED_DRUGS.includes(drugName)) {
        toast({
            variant: "destructive",
            title: "Offline Mode",
            description: "Drug not in offline cache. Please connect to the internet to look it up."
        });
        return;
    }
    const details = findDrugDetails(drugName);
    if (details) {
        setScannedItem({ drug: details, type: type });
        setIsModalOpen(true);
    } else {
        toast({ variant: "destructive", title: "Drug Not Found", description: `Could not find details for ${drugName}.`})
    }
  }

  const isHighRisk = (drugName?: string) => {
    const highRiskDrugs = ["morphine", "warfarin", "insulin", "strychnine"];
    return highRiskDrugs.includes(drugName?.toLowerCase() || '');
  }
  
  const getRecognitionSource = (type: string) => {
      if (isOffline) {
        return { source: 'Offline Cache', confidence: '100%' };
      }
      switch(type) {
          case 'barcode': return { source: 'UMT Verified Formulary & GS1 Database', confidence: '98%' };
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
              ? "Live camera feed active. Tap a card to see details."
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 pointer-events-none flex items-center justify-center">
                          <ScanLine className="h-16 w-16 text-white/50 animate-pulse"/>
                        </div>
                      {MOCK_SCANNABLES.map(item => (
                          <CompactOverlay key={item.name} item={item} onScan={handleScan} />
                      ))}
                  </div>
                )}
          </div>
           <div className="flex items-center space-x-2 mt-4">
              <Switch id="offline-mode" checked={isOffline} onCheckedChange={setIsOffline} />
              <Label htmlFor="offline-mode">Simulate Offline Mode</Label>
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
                        
                        <Alert variant="default" className="border-blue-500/50 bg-blue-500/10">
                            <AlertTriangle className="h-4 w-4 text-blue-500" />
                            <AlertTitle className="text-blue-600">Clinical Disclaimer</AlertTitle>
                            <AlertDescription>Educational tool only — confirm with official formulary before clinical decisions.</AlertDescription>
                        </Alert>
                        
                        {isHighRisk(scannedItem.drug.name) && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4"/>
                                <AlertTitle>High-Risk Medication</AlertTitle>
                                <AlertDescription>Check dose & monitoring. Not for patient dosing without supervision.</AlertDescription>
                            </Alert>
                        )}
                        
                        {scannedItem.type === 'herb' && (
                            <Alert>
                                <AlertTriangle className="h-4 w-4"/>
                                <AlertTitle>Possible Identification Only</AlertTitle>
                                <AlertDescription>This identification is a suggestion. Always verify herb specimens with a qualified expert or reference text.</AlertDescription>
                            </Alert>
                        )}

                        <Card>
                            <CardHeader><CardTitle className="text-lg">Identification & Recognition</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                               <DetailSection title="Scan Info" content={`Source: ${getRecognitionSource(scannedItem.type).source} | Confidence: ${getRecognitionSource(scannedItem.type).confidence}`} icon={Barcode}/>
                               <DetailSection title="Batch / Expiry" content={"Not detected on packaging."} icon={Calendar}/>
                               <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => toast({title: "Coming Soon!", description: "This will allow reporting incorrect information to admins."})}>Report Incorrect Info</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-lg">Faculty Teaching Notes & Exam Highlights</CardTitle></CardHeader>
                            <CardContent>
                               <DetailSection title="Key Points" content={scannedItem.drug.specialNotes} icon={BookCopy} />
                            </CardContent>
                        </Card>
                        
                         <Card>
                            <CardHeader><CardTitle className="text-lg">Pharmaceutical & Analytical Notes</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                               <DetailSection title="Storage & Stability" content={scannedItem.drug.pharmaApplications.storage} icon={Archive} />
                               <DetailSection title="Therapeutic Alternatives" content={"Data on alternatives not available in this mock dataset."} icon={GitCompareArrows} />
                               <DetailSection title="Analytical / QC Methods" content={`Qualitative: ${scannedItem.drug.analyticalMethods.qualitative}\nQuantitative: ${scannedItem.drug.analyticalMethods.quantitative}\nPharmacopoeial: ${scannedItem.drug.analyticalMethods.pharmacopoeial}`} icon={Microscope} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-lg">Clinical Information</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                               <DetailSection title="Mechanism of Action" content={scannedItem.drug.moa} icon={FlaskConical} />
                               {scannedItem.type === 'herb' && (
                                    <>
                                        <DetailSection title="Active Constituents" content={scannedItem.drug.moa} icon={TestTube} />
                                        <DetailSection title="Traditional Uses" content={scannedItem.drug.therapeuticUses} icon={Leaf} />
                                    </>
                                )}
                               <DetailSection title="Therapeutic Uses" content={scannedItem.drug.therapeuticUses} icon={Stethoscope} />
                               <DetailSection title="Major Adverse Drug Reactions (ADRs)" content={scannedItem.drug.adrs} icon={AlertTriangle} />
                               <DetailSection title="Contraindications & Precautions" content={scannedItem.drug.contraindications} icon={ShieldCheck} />
                               <DetailSection title="Typical Dosing" content={"Dosing information not available in this mock data. A real implementation would show Adult, Pediatric, and Renal/Hepatic dosing here."} icon={User} />
                               <DetailSection title="Major Interactions" content={"Interaction data not available in this mock dataset."} icon={GitCompareArrows} />
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader><CardTitle className="text-lg">Learning & App Actions</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                <Button size="sm" variant="secondary" onClick={() => toast({title: "Coming Soon!", description: "This will save the scan to your Notes Organizer."})}><Save className="mr-2"/>Save Study Note</Button>
                                <Button size="sm" variant="secondary" onClick={() => toast({title: "Coming Soon!", description: "This will add flashcards to your deck."})}><BookCopy className="mr-2"/>Make Flashcards</Button>
                                <Button size="sm" variant="secondary" onClick={() => toast({title: "Coming Soon!", description: "This will launch a quiz on this drug."})}><HelpCircle className="mr-2"/>Quiz Me</Button>
                                <Button size="sm" variant="secondary" onClick={() => toast({title: "Coming Soon!", description: "This will launch a simulated counseling session."})}><User className="mr-2"/>Counseling Mode</Button>
                                <Button size="sm" variant="secondary" onClick={() => toast({title: "Coming Soon!", description: "This will allow taking a snapshot of the AR view."})}><CameraIcon className="mr-2"/>Snapshot</Button>
                                <Button size="sm" variant="secondary" onClick={() => toast({title: "Coming Soon!", description: "This will read the card details aloud."})}><Volume2 className="mr-2"/>Read Aloud</Button>
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
