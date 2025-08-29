
"use client";

import { useTransition, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { analyzeLabReport, type LabReportAnalyzerOutput } from "@/ai/flows/lab-report-analyzer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, TestTube, FileText, Lightbulb, AlertTriangle, ScanEye } from "lucide-react";
import { usePatient } from "@/contexts/patient-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const severityMap: { [key: string]: { color: string, badge: "destructive" | "secondary" | "default" } } = {
  'critical': { color: 'text-red-500', badge: 'destructive' },
  'moderate': { color: 'text-yellow-500', badge: 'default' },
  'mild': { color: 'text-green-500', badge: 'secondary' },
};


export function LabAnalyzerClient() {
  const [state, setState] = useState<LabReportAnalyzerOutput | { error: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { getActivePatientRecord } = usePatient();
  const activePatientRecord = getActivePatientRecord();


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
    const file = formData.get("labReportImage") as File;
    if (!file || file.size === 0) {
        setState({ error: "Please upload an image of the lab report." });
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

        const result = await analyzeLabReport({
            photoDataUri,
            detailedHistory: activePatientRecord?.history,
        });
        setState(result);
    } catch (e) {
        console.error(e);
        setState({ error: "Failed to analyze report. The image may be unreadable or in an unsupported format." });
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
        formAction(formData);
    });
  }


  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Upload Lab Report</CardTitle>
            {activePatientRecord && <CardDescription>Analyzing for {activePatientRecord.history.name}</CardDescription>}
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="labReportImage" className="font-medium">Lab Report Image</label>
                <Input
                  id="labReportImage"
                  name="labReportImage"
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
                  <Image src={preview} alt="Lab report preview" width={400} height={400} className="rounded-md w-full h-auto object-contain" />
                </div>
              )}
              
              <Button type="submit" disabled={isPending || !preview} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Analyze Report
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2 space-y-6">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        
        {state && 'summary' in state ? (
          <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{state.summary}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/> Abnormal Values</CardTitle>
                </CardHeader>
                <CardContent>
                    {state.abnormalValues.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Test Name</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Normal Range</TableHead>
                                    <TableHead>Severity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {state.abnormalValues.map((item, index) => {
                                    const severity = item.severity.toLowerCase();
                                    const sevConfig = severityMap[severity] || { color: 'text-gray-500', badge: 'default'};
                                    return(
                                        <TableRow key={index} className={sevConfig.color}>
                                            <TableCell className="font-medium">{item.testName}</TableCell>
                                            <TableCell>{item.value}</TableCell>
                                            <TableCell>{item.normalRange}</TableCell>
                                            <TableCell><Badge variant={sevConfig.badge}>{item.severity}</Badge></TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <Alert>
                            <TestTube className="h-4 w-4"/>
                            <AlertTitle>No Abnormal Values</AlertTitle>
                            <AlertDescription>All lab values appear to be within their normal ranges.</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb /> Interpretation & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {state.abnormalValues.map((item, index) => (
                        <div key={index}>
                            <p className="font-semibold text-primary">{item.testName}</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.interpretation}</p>
                            {index < state.abnormalValues.length -1 && <Separator className="my-4"/>}
                        </div>
                    ))}
                    <Separator className="my-4"/>
                    <h3 className="font-semibold text-lg">General Recommendations</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{state.recommendations}</p>
                </CardContent>
            </Card>
          </>
        ) : (
           !isPending && (
             <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-muted/50">
                <ScanEye className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Waiting for Lab Report</h3>
                <p className="text-muted-foreground/80 mt-2">Upload an image to start the analysis.</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
