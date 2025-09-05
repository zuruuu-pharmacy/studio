
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Camera, Loader2, Pill, FlaskConical, AlertTriangle, ScanLine, ShieldCheck, FileText, BookCopy, HelpCircle, Leaf, Barcode } from "lucide-react";
import { drugTreeData, Drug } from "@/app/(main)/drug-classification-tree/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const MOCK_SCANNABLES = [
    { type: 'drug', name: "Amoxicillin", stripPosition: { top: '30%', left: '20%' }, icon: Pill },
    { type: 'drug', name: "Paracetamol", stripPosition: { top: '50%', left: '60%' }, icon: Pill },
    { type: 'barcode', name: "Morphine", stripPosition: { top: '70%', left: '15%' }, icon: Barcode }, // Morphine is high-risk
    { type: 'herb', name: "Strychnine", stripPosition: { top: '25%', left: '70%' }, icon: Leaf }, // Using Strychnine as a sample herb from data
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

export function ScanMedicineStripClient() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedDrug, setScannedDrug] = useState<Drug | null>(null);
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

  const handleScan = (drugName: string) => {
    const details = findDrugDetails(drugName);
    if (details) {
        setScannedDrug(details);
        setIsModalOpen(true);
    } else {
        toast({ variant: "destructive", title: "Drug Not Found", description: `Could not find details for ${drugName}.`})
    }
  }

  const isHighRisk = (drugName?: string) => {
    const highRiskDrugs = ["morphine", "warfarin", "insulin"];
    return highRiskDrugs.includes(drugName?.toLowerCase() || '');
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Medicine Strip Scanner</CardTitle>
          <CardDescription>
            {hasCameraPermission 
              ? "Live camera feed active. Tap on a detected item (pill, barcode, herb)."
              : "Enable your camera to scan medicine text, barcodes, or herbs."
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
                      {MOCK_SCANNABLES.map(item => {
                          const Icon = item.icon;
                          return (
                             <Button 
                              key={item.name} 
                              variant="outline"
                              className="absolute bg-white/80 hover:bg-white text-black h-auto p-2 rounded-lg shadow-lg flex flex-col items-center gap-1" 
                              style={item.stripPosition}
                              onClick={() => handleScan(item.name)}
                            >
                                <Icon className="h-6 w-6 text-primary"/>
                                <span className="text-xs font-semibold">{item.name}</span>
                          </Button>
                          )
                      })}
                  </div>
                )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
            {scannedDrug && (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{scannedDrug.name} ({scannedDrug.pharmaApplications.formulations})</DialogTitle>
                        <DialogDescription>{scannedDrug.classification}</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto pr-4 space-y-4">
                        {isHighRisk(scannedDrug.name) && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4"/>
                                <AlertTitle>High-Risk Medication</AlertTitle>
                                <AlertDescription>Check dose & monitoring. Not for patient dosing without supervision.</AlertDescription>
                            </Alert>
                        )}
                        <DetailSection title="Mechanism of Action" content={scannedDrug.moa} icon={FlaskConical} />
                        <DetailSection title="Therapeutic Uses" content={scannedDrug.therapeuticUses} icon={Pill} />
                        <DetailSection title="Adverse Drug Reactions" content={scannedDrug.adrs} icon={AlertTriangle} />
                        <DetailSection title="Contraindications" content={scannedDrug.contraindications} icon={ShieldCheck} />
                        <Card className="bg-muted/50">
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
