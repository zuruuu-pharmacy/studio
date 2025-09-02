
"use client";

import { useTransition, useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { generateCoachedDietPlan, type NutritionCoachOutput } from "@/ai/flows/nutrition-coach";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, ArrowRight, Bot, Sparkles, ClipboardCheck, Utensils, AlertTriangle, Info } from "lucide-react";
import { usePatient } from "@/contexts/patient-context";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Define Zod schemas for each step of the questionnaire
const step1Schema = z.object({
  age: z.coerce.number().positive(),
  gender: z.string().min(1),
  height: z.string().min(1),
  weight: z.string().min(1),
  occupation: z.string().min(1),
  activity_level: z.string().min(1),
  sleep_pattern: z.string().min(1),
  stress_level: z.string().min(1),
});

const step2Schema = z.object({
  chronic_diseases: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  recent_surgeries: z.string().optional(),
  family_history: z.array(z.string()).optional(),
});

const step3Schema = z.object({
  meal_pattern: z.string().min(1),
  skips_meals: z.boolean(),
  water_intake: z.string().min(1),
  other_drinks: z.array(z.string()).optional(),
  processed_food_intake: z.string().min(1),
  cooking_habit: z.string().min(1),
});

const step4Schema = z.object({
  diet_type: z.array(z.string()).optional(),
  favorite_foods: z.string().optional(),
  disliked_foods: z.string().optional(),
  fasting_practices: z.string().optional(),
});

const step5Schema = z.object({
  primary_goal: z.string().min(1),
  timeline: z.string().min(1),
  motivation_level: z.string().min(1),
  budget: z.string().min(1),
  open_to_lifestyle_changes: z.boolean(),
});

// Combine all steps into a single schema for the final form
const fullSchema = z.object({
    profile: step1Schema,
    medical_history: step2Schema,
    current_diet: step3Schema,
    preferences: step4Schema,
    goals: step5Schema,
});

type FullFormValues = z.infer<typeof fullSchema>;

const steps = [
  { id: 'profile', title: 'Personal & Lifestyle', schema: step1Schema },
  { id: 'medical_history', title: 'Medical History', schema: step2Schema },
  { id: 'current_diet', title: 'Current Diet Habits', schema: step3Schema },
  { id: 'preferences', title: 'Cultural & Personal Preferences', schema: step4Schema },
  { id: 'goals', title: 'Goals & Motivation', schema: step5Schema },
];


export function NutritionCoachClient() {
  const [state, setState] = useState<NutritionCoachOutput | { error: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { getActivePatientRecord } = usePatient();
  const activePatientRecord = getActivePatientRecord();
  
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FullFormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      profile: {
        age: activePatientRecord?.history.age ? parseInt(activePatientRecord.history.age) : undefined,
        gender: activePatientRecord?.history.gender || "",
      },
      medical_history: {
        chronic_diseases: activePatientRecord?.history.pastMedicalHistory?.split(',').map(s => s.trim()) || [],
        medications: activePatientRecord?.history.medicationHistory?.split(',').map(s => s.trim()) || [],
        allergies: activePatientRecord?.history.allergyHistory?.split(',').map(s => s.trim()) || [],
        family_history: activePatientRecord?.history.familyHistory?.split(',').map(s => s.trim()) || [],
      },
      current_diet: {
        skips_meals: false,
      },
      goals: {
        open_to_lifestyle_changes: true,
      }
    },
  });

  const formAction = async (formData: FullFormValues) => {
    startTransition(async () => {
      try {
        const result = await generateCoachedDietPlan(formData);
        setState(result);
        setCurrentStep(steps.length); // Move to result view
      } catch (e) {
        console.error(e);
        setState({ error: "Failed to generate diet plan. Please try again." });
      }
    });
  }
  
   useEffect(() => {
    if (state && 'error' in state && state.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const nextStep = async () => {
    const section = steps[currentStep].id as keyof FullFormValues;
    const isValid = await form.trigger(section);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    } else {
        toast({variant: 'destructive', title: 'Please fill out all required fields.'});
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  if (isPending) {
    return <div className="flex flex-col justify-center items-center h-full gap-4">
        <Bot className="h-16 w-16 text-primary animate-bounce"/>
        <p className="text-muted-foreground">Our AI coach is preparing your personalized plan...</p>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>;
  }

  if (currentStep === steps.length && state && 'diet_plan' in state) {
     return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Sparkles className="text-primary"/>Your Personalized Nutrition Plan</CardTitle>
                <CardDescription>Generated by Zuruu AI for {activePatientRecord?.history.name || 'you'}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {state.warnings && state.warnings.length > 0 && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>Important Warnings!</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc list-inside">
                                {state.warnings.map((w,i) => <li key={i}>{w}</li>)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
                
                <Card className="bg-muted/50">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Utensils/>Daily Meal Plan</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                        <p><strong>Breakfast:</strong> {state.diet_plan.breakfast}</p>
                        <p><strong>Lunch:</strong> {state.diet_plan.lunch}</p>
                        <p><strong>Snack:</strong> {state.diet_plan.snack}</p>
                        <p><strong>Dinner:</strong> {state.diet_plan.dinner}</p>
                        <p><strong>Hydration:</strong> {state.diet_plan.hydration}</p>
                    </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                     <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck/>Clinical Notes</CardTitle></CardHeader>
                     <CardContent className="space-y-2 text-muted-foreground">
                        <p><strong>Target Calories:</strong> {state.detailed_notes.calories}</p>
                        <p><strong>Macronutrient Split:</strong> {state.detailed_notes.macros}</p>
                        <p><strong>Notes:</strong> {state.detailed_notes.special_notes}</p>
                     </CardContent>
                </Card>

                <Button onClick={() => setCurrentStep(0)}>Start Over</Button>
            </CardContent>
        </Card>
     )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <CardDescription>Step {currentStep + 1} of {steps.length}</CardDescription>
        <Progress value={((currentStep + 1) / (steps.length + 1)) * 100} className="w-full" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(formAction)} className="space-y-6">
            {/* Step 1: Profile */}
            <div className={currentStep === 0 ? 'block' : 'hidden'}>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField name="profile.age" control={form.control} render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="profile.gender" control={form.control} render={({ field }) => (<FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField name="profile.height" control={form.control} render={({ field }) => (<FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="profile.weight" control={form.control} render={({ field }) => (<FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="profile.occupation" control={form.control} render={({ field }) => (<FormItem><FormLabel>Occupation</FormLabel><FormControl><Input {...field} placeholder="e.g., Office worker, Teacher" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="profile.activity_level" control={form.control} render={({ field }) => (<FormItem><FormLabel>Daily Activity Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Sedentary">Sedentary</SelectItem><SelectItem value="Lightly Active">Lightly Active</SelectItem><SelectItem value="Moderately Active">Moderately Active</SelectItem><SelectItem value="Very Active">Very Active</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField name="profile.sleep_pattern" control={form.control} render={({ field }) => (<FormItem><FormLabel>Sleep Pattern</FormLabel><FormControl><Input {...field} placeholder="e.g., 7-8 hours, good quality" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="profile.stress_level" control={form.control} render={({ field }) => (<FormItem><FormLabel>Stress/Anxiety Impact</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="None">None</SelectItem><SelectItem value="Sometimes">Sometimes</SelectItem><SelectItem value="Often">Often</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
            </div>
            {/* Step 2: Medical History */}
            <div className={currentStep === 1 ? 'block' : 'hidden'}>
                 <FormField name="medical_history.chronic_diseases" control={form.control} render={({ field }) => (<FormItem><FormLabel>Chronic Diseases</FormLabel><FormControl><Input {...field} value={Array.isArray(field.value) ? field.value.join(', ') : ''} onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} placeholder="e.g., Diabetes, Hypertension" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="medical_history.medications" control={form.control} render={({ field }) => (<FormItem><FormLabel>Current Medications</FormLabel><FormControl><Input {...field} value={Array.isArray(field.value) ? field.value.join(', ') : ''} onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} placeholder="e.g., Metformin, Amlodipine" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="medical_history.allergies" control={form.control} render={({ field }) => (<FormItem><FormLabel>Allergies</FormLabel><FormControl><Input {...field} value={Array.isArray(field.value) ? field.value.join(', ') : ''} onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} placeholder="e.g., Peanuts, Lactose" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="medical_history.recent_surgeries" control={form.control} render={({ field }) => (<FormItem><FormLabel>Recent Surgeries</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="medical_history.family_history" control={form.control} render={({ field }) => (<FormItem><FormLabel>Family History</FormLabel><FormControl><Input {...field} value={Array.isArray(field.value) ? field.value.join(', ') : ''} onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} placeholder="e.g., Heart disease, Cancer" /></FormControl><FormMessage /></FormItem>)} />
            </div>
            {/* Step 3: Current Diet */}
            <div className={currentStep === 2 ? 'block' : 'hidden'}>
                <FormField name="current_diet.meal_pattern" control={form.control} render={({ field }) => (<FormItem><FormLabel>Typical Meal Pattern</FormLabel><FormControl><Input {...field} placeholder="e.g., 3 meals, 2 snacks" /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="current_diet.skips_meals" control={form.control} render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Do you skip meals often?</FormLabel></div><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                <FormField name="current_diet.water_intake" control={form.control} render={({ field }) => (<FormItem><FormLabel>Daily Water Intake</FormLabel><FormControl><Input {...field} placeholder="e.g., 2 liters, 8 glasses" /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="current_diet.other_drinks" control={form.control} render={({ field }) => (<FormItem><FormLabel>Other Drinks (comma separated)</FormLabel><FormControl><Input {...field} value={Array.isArray(field.value) ? field.value.join(', ') : ''} onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} placeholder="e.g., Coffee, Soda, Tea" /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="current_diet.processed_food_intake" control={form.control} render={({ field }) => (<FormItem><FormLabel>Processed/Fast Food Intake</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Rarely">Rarely</SelectItem><SelectItem value="1-2 times a week">1-2 times/week</SelectItem><SelectItem value="3-5 times a week">3-5 times/week</SelectItem><SelectItem value="Daily">Daily</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField name="current_diet.cooking_habit" control={form.control} render={({ field }) => (<FormItem><FormLabel>Cooking Habits</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Cook at home">Mostly cook at home</SelectItem><SelectItem value="Eat outside">Mostly eat outside</SelectItem><SelectItem value="Mix">A mix of both</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
             {/* Step 4: Preferences */}
            <div className={currentStep === 3 ? 'block' : 'hidden'}>
                <FormField name="preferences.diet_type" control={form.control} render={({ field }) => (<FormItem><FormLabel>Dietary Type (comma separated)</FormLabel><FormControl><Input {...field} value={Array.isArray(field.value) ? field.value.join(', ') : ''} onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} placeholder="e.g., Vegetarian, Halal" /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="preferences.favorite_foods" control={form.control} render={({ field }) => (<FormItem><FormLabel>Favorite Foods</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="preferences.disliked_foods" control={form.control} render={({ field }) => (<FormItem><FormLabel>Disliked Foods</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="preferences.fasting_practices" control={form.control} render={({ field }) => (<FormItem><FormLabel>Religious/Cultural Fasting</FormLabel><FormControl><Input {...field} placeholder="e.g., Ramadan, Lent" /></FormControl><FormMessage /></FormItem>)} />
            </div>
             {/* Step 5: Goals */}
            <div className={currentStep === 4 ? 'block' : 'hidden'}>
                 <FormField name="goals.primary_goal" control={form.control} render={({ field }) => (<FormItem><FormLabel>Primary Goal</FormLabel><FormControl><Input {...field} placeholder="e.g., Weight loss, Disease control" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="goals.timeline" control={form.control} render={({ field }) => (<FormItem><FormLabel>Timeline</FormLabel><FormControl><Input {...field} placeholder="e.g., 3 months, long-term" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="goals.motivation_level" control={form.control} render={({ field }) => (<FormItem><FormLabel>Motivation Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Moderate">Moderate</SelectItem><SelectItem value="High">High</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                 <FormField name="goals.budget" control={form.control} render={({ field }) => (<FormItem><FormLabel>Food/Supplement Budget</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                 <FormField name="goals.open_to_lifestyle_changes" control={form.control} render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Open to exercise/lifestyle changes?</FormLabel></div><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                <ArrowLeft className="mr-2" /> Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next <ArrowRight className="ml-2" />
                </Button>
              ) : (
                <Button type="submit">
                  Generate My Plan <Sparkles className="ml-2" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
