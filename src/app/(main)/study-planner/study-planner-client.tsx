
"use client";

import { useActionState, useEffect, useTransition, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { generateStudyPlan, type StudyPlannerOutput } from "@/ai/flows/study-planner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarDays, Sparkles, Brain, Clock, PlusCircle, XCircle, Book, TestTube, FilePen, BookCopy, ShieldAlert, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


const formSchema = z.object({
  subjects: z.array(z.object({ value: z.string().min(2, "Required") })).min(1, "At least one subject is required."),
  studyDuration: z.string().min(3, "Required."),
  hoursPerDay: z.coerce.number().min(1).max(12),
  personalConstraints: z.string().optional(),
  studyPreferences: z.string().optional(),
  learningObjective: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

const categoryStyles: { [key: string]: { icon: React.ElementType, color: string } } = {
    'Theory': { icon: Book, color: 'bg-blue-500/10' },
    'Revision': { icon: BookCopy, color: 'bg-purple-500/10' },
    'Lab': { icon: TestTube, color: 'bg-orange-500/10' },
    'Assignment': { icon: FilePen, color: 'bg-yellow-500/10' },
    'Exam': { icon: ShieldAlert, color: 'bg-red-500/10' },
    'Break': { icon: Brain, color: 'bg-green-500/10' },
};

export function StudyPlannerClient() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<StudyPlannerOutput | { error: string } | null, FormData>(
    async (previousState, formData) => {
      // Allow a reset command to clear the UI
      if (formData.get('reset')) return null;

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
      subjects: [{ value: "Pharmacology" }, {value: "Pharmaceutics"}, {value: "Pathology"}],
      studyDuration: "the next 4 weeks for final exams",
      hoursPerDay: 4,
      personalConstraints: "Work 5-9 PM on weekdays. Sleep from 11 PM to 7 AM daily. Prayer times at 1 PM and 4 PM.",
      studyPreferences: "I study best in the morning. I prefer using the Pomodoro technique (50 min study, 10 min break). Pharmacology is a weak area for me.",
      learningObjective: "Gain a deep understanding of all subjects with a special focus on my weak areas to pass the final exams with a good grade.",
    },
  });

   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    } else if (state?.weeklyPlan) {
      setCompletedTasks(new Set()); // Reset progress when a new plan is generated
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
    formData.append('reset', 'true');
    startTransition(() => formAction(formData));
  }

  const toggleTaskCompletion = (day: string, time: string, activity: string) => {
    const taskId = `${day}-${time}-${activity}`;
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">The AI is creating your personalized study plan...</p>
      </div>
    );
  }

  if (state?.weeklyPlan) {
    const totalTasks = state.weeklyPlan.reduce((acc, day) => acc + day.slots.filter(s => !s.isBreak).length, 0);
    const completedCount = completedTasks.size;
    const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-2 pt-2">
                    <Progress value={progressPercentage} className="w-full" />
                    <p className="text-sm text-muted-foreground text-center">{completedCount} of {totalTasks} tasks completed ({Math.round(progressPercentage)}%)</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your AI-Generated Weekly Study Plan</CardTitle>
                    <CardDescription>Mark tasks as complete to track your progress.</CardDescription>
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
                                    <TableCell className="font-semibold align-top">{dayPlan.day}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            {dayPlan.slots.map((slot, i) => {
                                                const taskId = `${dayPlan.day}-${slot.time}-${slot.activity}`;
                                                const isCompleted = completedTasks.has(taskId);
                                                const Icon = categoryStyles[slot.category]?.icon || Clock;
                                                const colorClass = categoryStyles[slot.category]?.color || 'bg-muted/50';
                                                
                                                return (
                                                    <div 
                                                        key={i} 
                                                        className={cn(
                                                            "p-2 rounded-md flex justify-between items-center transition-all", 
                                                            colorClass,
                                                            isCompleted && "opacity-50 bg-muted"
                                                        )}
                                                    >
                                                        <div>
                                                            <p className="font-bold text-sm flex items-center gap-2">
                                                                <Clock className="h-4 w-4"/>
                                                                {slot.time}
                                                            </p>
                                                            <p className={cn("text-sm text-muted-foreground pl-6 flex items-center gap-2", isCompleted && "line-through")}>
                                                                <Icon className="h-4 w-4" />
                                                                {slot.isBreak ? `${slot.activity}` : `${slot.subject}: ${slot.activity}`}
                                                            </p>
                                                        </div>
                                                        {!slot.isBreak && (
                                                            isCompleted ? (
                                                                <Button variant="ghost" size="sm" onClick={() => toggleTaskCompletion(dayPlan.day, slot.time, slot.activity)}>
                                                                    <Badge variant="secondary">Completed</Badge>
                                                                </Button>
                                                            ) : (
                                                                <Button variant="outline" size="sm" onClick={() => toggleTaskCompletion(dayPlan.day, slot.time, slot.activity)}>
                                                                    <CheckCircle className="mr-2 h-4 w-4"/> Mark Complete
                                                                </Button>
                                                            )
                                                        )}
                                                    </div>
                                                )
                                            })}
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
                <FormItem><FormLabel>Study Preferences (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., I study best in the morning, prefer Pomodoro, Pharmacology is a weak subject..." {...field} /></FormControl><FormMessage /></FormItem>
             )}/>
            <FormField control={form.control} name="learningObjective" render={({ field }) => (
                <FormItem><FormLabel>Primary Learning Goal (Optional)</FormLabel><FormControl><Textarea placeholder="e.g., focus on difficult topics, prepare for final exams..." {...field} /></FormControl><FormMessage /></FormItem>
             )}/>
            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="mr-2" />}
              Generate AI Study Plan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
