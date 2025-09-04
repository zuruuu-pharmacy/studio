
"use client";

import { useActionState, useEffect, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { generateStudyPlan, type StudyPlannerOutput } from "@/ai/flows/study-planner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarDays, Sparkles, Brain, Clock, PlusCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  subjects: z.array(z.object({ value: z.string().min(2, "Required") })).min(1, "At least one subject is required."),
  studyDuration: z.string().min(3, "Required."),
  hoursPerDay: z.coerce.number().min(1).max(12),
  personalConstraints: z.string().optional(),
  studyPreferences: z.string().optional(),
  learningObjective: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function StudyPlannerClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<StudyPlannerOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      const subjects = formData.getAll("subjects").map(s => s.toString()).filter(s => s.length > 1);
      
      const parsed = formSchema.safeParse({ 
          subjects: subjects.map(s => ({ value: s })),
          studyDuration: formData.get("studyDuration"),
          hoursPerDay: formData.get("hoursPerDay"),
          personalConstraints: formData.get("personalConstraints"),
          studyPreferences: formData.get("studyPreferences"),
          learningObjective: formData.get("learningObjective"),
      });

      if (!parsed.success) {
        // Log the detailed error for debugging
        console.error("Form validation failed:", parsed.error.flatten());
        return { error: "Invalid input. Please check all fields." };
      }
      try {
        const result = await generateStudyPlan({
            subjects: parsed.data.subjects.map(s => s.value),
            studyDuration: parsed.data.studyDuration,
            hoursPerDay: parsed.data.hoursPerDay,
            personalConstraints: parsed.data.personalConstraints,
            studyPreferences: parsed.data.studyPreferences,
            learningObjective: parsed.data.learningObjective,
        });
        return result;
      } catch (e) {
        console.error(e);
        return { error: "Failed to generate study plan. Please try again." };
      }
    },
    null
  );

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjects: [{ value: "" }],
      studyDuration: "the next 4 weeks",
      hoursPerDay: 4,
      personalConstraints: "Sleep from 11 PM to 7 AM daily.",
      studyPreferences: "I study best in the morning. I prefer using the Pomodoro technique (25 min study, 5 min break).",
      learningObjective: "deep understanding and exam preparation",
    },
  });

   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const handleFormSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    data.subjects.forEach(s => formData.append("subjects", s.value));
    formData.append("studyDuration", data.studyDuration);
    formData.append("hoursPerDay", data.hoursPerDay.toString());
    if (data.personalConstraints) formData.append("personalConstraints", data.personalConstraints);
    if (data.studyPreferences) formData.append("studyPreferences", data.studyPreferences);
    if (data.learningObjective) formData.append("learningObjective", data.learningObjective);
    startTransition(() => formAction(formData));
  });
  
  const handleReset = () => {
    const formData = new FormData();
    // This is a bit of a hack to signal a reset to the action state
    formData.append('reset', 'true');
    formAction(formData);
  }

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">The AI is creating your personalized study plan...</p>
      </div>
    );
  }

  if (state?.weeklyPlan) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Weekly Study Plan</CardTitle>
                    <CardDescription>A timetable generated by AI to help you stay on track.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Day</TableHead>
                                <TableHead>Schedule</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {state.weeklyPlan.map(dayPlan => (
                                <TableRow key={dayPlan.day}>
                                    <TableCell className="font-semibold">{dayPlan.day}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            {dayPlan.slots.map((slot, i) => (
                                                <div key={i} className={`p-2 rounded-md ${slot.isBreak ? 'bg-muted/50' : 'bg-primary/10'}`}>
                                                    <p className="font-bold text-sm flex items-center gap-2">
                                                        <Clock className="h-4 w-4"/>
                                                        {slot.time}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground pl-6">
                                                        {slot.isBreak ? `🧠 ${slot.activity}` : `${slot.subject}: ${slot.activity}`}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Brain className="text-primary"/>AI Study Strategy & Notes</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{state.summaryNotes}</p>
                 </CardContent>
            </Card>
             <Button onClick={handleReset} variant="outline">Generate New Plan</Button>
        </div>
    )
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Study Plan</CardTitle>
        <CardDescription>Provide your study details and let the AI generate a timetable for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="subjects"
              render={() => (
                <FormItem>
                  <FormLabel>Subjects or Topics</FormLabel>
                  {fields.map((field, index) => (
                     <div key={field.id} className="flex items-center gap-2">
                        <FormField
                            control={form.control}
                            name={`subjects.${index}.value`}
                            render={({ field }) => (
                               <FormControl>
                                 <Input {...field} placeholder={`Subject ${index + 1}`}/>
                               </FormControl>
                            )}
                        />
                        {fields.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><XCircle className="text-destructive"/></Button>}
                    </div>
                  ))}
                   <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}><PlusCircle className="mr-2"/>Add Subject</Button>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="studyDuration" render={({ field }) => (
                    <FormItem><FormLabel>Study Duration</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                 )}/>
                 <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                    <FormItem><FormLabel>Hours Per Day</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                 )}/>
            </div>
            <FormField control={form.control} name="personalConstraints" render={({ field }) => (
                <FormItem><FormLabel>Personal Constraints (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., Work 5-9 PM weekdays, sleep by 11 PM..." {...field} /></FormControl><FormMessage /></FormItem>
             )}/>
             <FormField control={form.control} name="studyPreferences" render={({ field }) => (
                <FormItem><FormLabel>Study Preferences (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., I study best in the morning, prefer Pomodoro..." {...field} /></FormControl><FormMessage /></FormItem>
             )}/>
            <FormField control={form.control} name="learningObjective" render={({ field }) => (
                <FormItem><FormLabel>Primary Learning Goal (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., focus on difficult topics, prepare for final exams..." {...field} /></FormControl><FormMessage /></FormItem>
             )}/>
            <Button type="submit" className="w-full" size="lg">
              <Sparkles className="mr-2" /> Generate AI Study Plan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
