"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { analyzeLabReport, type LabReportAnalyzerOutput } from "@/ai/flows/lab-report-analyzer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TestTube, FileText, Lightbulb, AlertTriangle } from "lucide-react";
import { usePatient } from "@/contexts/patient-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  reportText: z.string().min(20, "Lab report text is too short."),
});

type FormValues = z.infer<typeof formSchema>;

const severityMap: { [key: string]: { color: string, badge: "destructive" | "secondary" | "default" } } = {
  'critical': { color: 'text-red-500', badge: 'destructive' },
  'moderate': { color: 'text-yellow-500', badge: 'default' },
  'mild': { color: 'text-green-500', badge: 'secondary' },
};


export function LabAnalyzerClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<LabReportAnalyzerOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const parsed = formSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return { error: "Invalid input. Check the form field." };
      }
      try {
        const result = await analyzeLabReport({
            ...parsed.data,
            detailedHistory: patientState.activePatient || undefined,
        });
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to analyze the report. Please try again." };
      }
    },
    null
  );

  const { patientState } = usePatient();
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { reportText: "" },
  });

  useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("reportText", data.reportText);
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Lab Report Input</CardTitle>
            {patientState.activePatient && <CardDescription>Analyzing for {patientState.activePatient.demographics?.name}</CardDescription>}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField name="reportText" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paste Lab Report Text</FormLabel>
                    <FormControl><Textarea placeholder="Paste the entire lab report here..." {...field} rows={15} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Report
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2 space-y-6">
        {isPending && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
        {state && 'summary' in state && (
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
        )}
      </div>
    </div>
  );
}
