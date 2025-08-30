
"use client";

import { useTransition, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { readPrescription, type ReadPrescriptionOutput } from "@/ai/flows/prescription-reader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Pill, Stethoscope, FileText, AlertCircle, ScanEye, AlertTriangle, FileClock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePatient } from "@/contexts/patient-context";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export function PrescriptionReaderClient() {
    const [state, setState] = useState<ReadPrescriptionOutput | { error: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { setLastPrescription } = usePatient();
    const router = useRouter();

    useEffect(() => {
        if (state && 'error' in state && state.error) {
        toast({ variant: "destructive", title: "Error", description: state.error });
        }
    }, [state, toast]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        if (file.size > MAX_FILE_SIZE) {
            toast({ variant: "destructive", title: "Error", description: "File size exceeds 4MB limit." });
            setPreview(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        } else {
        setPreview(null);
        }
    };
    
    const formAction = async (formData: FormData) => {
        const file = formData.get("prescriptionImage") as File;
        if (!file || file.size === 0) {
            setState({ error: "Please upload an image of the prescription." });
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setState({ error: "File is too large. Please upload an image under 4MB." });
            return;
        }

        try {
            const photoDataUri = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const result = await readPrescription({ photoDataUri });
            setState(result);
        } catch (e) {
            console.error(e);
            setState({ error: "Failed to analyze prescription. The image may be unreadable or in an unsupported format." });
        }
    }
    
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => {
            formAction(formData);
        });
    }

    const handleStartTracking = () => {
        if (state && 'medications' in state) {
            setLastPrescription(state);
            router.push('/adherence-tracker');
        }
    }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Upload Prescription</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="prescriptionImage" className="font-medium">Prescription Image</label>
                <Input
                  id="prescriptionImage"
                  name="prescriptionImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              {preview && (
                <div className="mt-4 border rounded-lg p-2 bg-muted">
                  <p className="text-sm font-medium mb-2 text-center">Image Preview</p>
                  <Image src={preview} alt="Prescription preview" width={400} height={400} className="rounded-md w-full h-auto object-contain" />
                </div>
              )}
              
              <Button type="submit" disabled={isPending || !preview} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Analyze Prescription
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        
        {state && 'medications' in state ? (
          <div className="space-y-6">
            <Alert variant="default" className="bg-green-500/10 border-green-500 text-green-700 dark:text-green-400">
                <FileText className="h-4 w-4 text-green-500" />
                <AlertTitle>Analysis Complete</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                    <span>The prescription has been successfully analyzed. Please review for accuracy.</span>
                    <Button size="sm" onClick={handleStartTracking}>
                        <FileClock className="mr-2"/>
                        Start Adherence Tracking
                    </Button>
                </AlertDescription>
            </Alert>
          
            {state.diagnosis && (
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Doctor's Diagnosis</CardTitle>
                    {state.prescription_date && <CardDescription>Date: {state.prescription_date}</CardDescription>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{state.diagnosis}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Pill className="h-6 w-6 text-primary" />
                <CardTitle>Medication Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Instructions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.medications.map((med, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {med.status === 'uncertain' && <AlertTriangle className="h-4 w-4 text-destructive" title="Uncertain Recognition" />}
                            {med.name}
                          </div>
                        </TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.frequency}</TableCell>
                        <TableCell>{med.duration}</TableCell>
                        <TableCell>{med.instructions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {state.medications.some(m => m.status === 'uncertain') && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Pharmacist Review Required</AlertTitle>
                        <AlertDescription>One or more medications were difficult to read. Please verify the details before proceeding.</AlertDescription>
                    </Alert>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-muted-foreground whitespace-pre-wrap">{state.summary}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          !isPending && (
             <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
                <ScanEye className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Waiting for Prescription</h3>
                <p className="text-muted-foreground/80 mt-2">Upload an image to start the analysis.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
