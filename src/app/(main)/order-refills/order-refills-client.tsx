
"use client";

import { useTransition, useEffect, useState } from "react";
import { manageRefill, type ManageRefillOutput } from "@/ai/flows/refill-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pill, ShoppingCart, CalendarClock, BellRing, CheckCircle, Truck, Activity } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePatient } from "@/contexts/patient-context";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const reminderMap: { [key: string]: { color: string, badge: "destructive" | "default" | "secondary" } } = {
  'Urgent': { color: 'text-red-500', badge: 'destructive' },
  'Active': { color: 'text-yellow-500', badge: 'default' },
  'NotNeeded': { color: 'text-green-500', badge: 'secondary' },
};

export function OrderRefillsClient() {
  const [state, setState] = useState<(ManageRefillOutput | { error: string })[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const { patientState, clearLastPrescription } = usePatient();
  const { lastPrescription } = patientState;
  const [orderStatus, setOrderStatus] = useState<{ [key: string]: string }>({});

  const handleAnalyzePrescription = () => {
    if (!lastPrescription) return;

    startTransition(async () => {
      try {
        const dispensedDate = lastPrescription.prescription_date || new Date().toISOString().split('T')[0];

        const refillPromises = lastPrescription.medications.map(med => {
          let dailyConsumption = 1;
          const freqLower = med.frequency.toLowerCase();
          if (freqLower.includes('twice') || freqLower.includes('bd')) {
              dailyConsumption = 2;
          } else if (freqLower.includes('thrice') || freqLower.includes('tds')) {
              dailyConsumption = 3;
          } else if (freqLower.includes('four times') || freqLower.includes('qid')) {
              dailyConsumption = 4;
          }

          let durationDays = 7;
          const durationLower = med.duration.toLowerCase();
          const quantityMatch = durationLower.match(/\d+/);
          if (quantityMatch) {
            const num = parseInt(quantityMatch[0], 10);
            if (durationLower.includes('week')) {
                durationDays = num * 7;
            } else if (durationLower.includes('month')) {
                durationDays = num * 30;
            } else {
                durationDays = num;
            }
          }
          const totalQuantity = dailyConsumption * durationDays;

          return manageRefill({
            medication: {
              name: med.name,
              strength: med.dosage,
              dosage: med.frequency,
              quantityDispensed: isNaN(totalQuantity) ? 30 : totalQuantity,
              dispensedDate: dispensedDate,
            }
          });
        });

        const results = await Promise.all(refillPromises);
        setState(results);

      } catch (e) {
        console.error(e);
        setState([{ error: "Failed to process prescription for refill tracking." }]);
      } finally {
        clearLastPrescription(); // Clear after analysis
      }
    });
  }

  const handleOrderRefill = (medName: string) => {
    setOrderStatus(prev => ({...prev, [medName]: 'Ordered'}));
    toast({
        title: "Order Placed!",
        description: `Your refill for ${medName} has been sent to the pharmacy.`
    });
  }

  if (!lastPrescription && !state) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Link a Prescription to Begin</CardTitle>
          <CardDescription>
            To order from Zuruu AI Pharmacy, first upload and analyze a prescription. The last analyzed prescription will be used here.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={() => router.push('/prescription-reader')}>
                <Pill className="mr-2 h-4 w-4" /> Go to Prescription Reader
            </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (lastPrescription && !state && !isPending) {
    return (
         <Card className="text-center">
            <CardHeader>
                <CardTitle>Prescription Ready for Analysis</CardTitle>
                <CardDescription>
                    A prescription for {lastPrescription.medications.length} medication(s) is ready to be analyzed for refill tracking.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleAnalyzePrescription} disabled={isPending}>
                    <Activity className="mr-2 h-4 w-4" /> Analyze for Refills
                </Button>
            </CardContent>
         </Card>
    )
  }

  return (
    <div className="space-y-6">
        {isPending && (
             <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Analyzing your prescription for Zuruu AI Pharmacy...</p>
            </div>
        )}
        {state && state.map((result, index) => (
             'error' in result ? (
                <Alert key={index} variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{result.error}</AlertDescription>
                </Alert>
             ) : (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Pill/>{result.medicine.name} <span className="font-normal text-base text-muted-foreground">{result.medicine.strength}</span></CardTitle>
                        <CardDescription>{result.medicine.dosage}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                           <CalendarClock className="h-10 w-10 text-primary"/>
                           <div>
                                <p className="text-sm text-muted-foreground">Days Remaining</p>
                                <p className="text-2xl font-bold">{result.medicine.remaining_days}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                           <BellRing className="h-10 w-10 text-primary"/>
                           <div>
                                <p className="text-sm text-muted-foreground">Refill Reminder</p>
                                <div className="flex items-center gap-2">
                                     <p className="text-lg font-semibold">{result.refill_reminder.message}</p>
                                     <Badge variant={reminderMap[result.refill_reminder.status]?.badge || 'default'}>{result.refill_reminder.status}</Badge>
                                </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                           <ShoppingCart className="h-10 w-10 text-primary"/>
                           <div>
                                { (result.order && (result.refill_reminder.status === 'Active' || result.refill_reminder.status === 'Urgent')) ? (
                                    <>
                                        <p className="text-sm text-muted-foreground">Suggested Pharmacy</p>
                                        <p className="font-semibold">{result.order.partner_pharmacy}</p>
                                        
                                        { orderStatus[result.medicine.name] === 'Ordered' ? (
                                            <div className="flex items-center gap-2 mt-2 text-green-600">
                                                <CheckCircle className="h-5 w-5"/>
                                                <p className="font-semibold">Order Placed!</p>
                                            </div>
                                        ) : (
                                            <Button size="sm" className="mt-2" onClick={() => handleOrderRefill(result.medicine.name)}>
                                                <Truck className="mr-2"/> Order Now ({result.order.option})
                                            </Button>
                                        )}
                                    </>
                                 ) : (
                                     <p className="text-muted-foreground">No action needed yet.</p>
                                 )}
                           </div>
                        </div>
                    </CardContent>
                </Card>
             )
        ))}
    </div>
  );
}
