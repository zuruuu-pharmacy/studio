
"use client";

import { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePolls } from "@/contexts/polls-context";
import { usePatient } from "@/contexts/patient-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, ListChecks, Check, BarChart3, Users, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const newPollSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().optional(),
  options: z.array(z.object({
    value: z.string().min(1, "Option cannot be empty."),
  })).min(2, "Must have at least two options."),
});
type NewPollValues = z.infer<typeof newPollSchema>;


export function StudentPollsClient() {
  const { polls, addPoll, vote } = usePolls();
  const { patientState } = usePatient();
  const currentUser = patientState.activeUser;
  
  const [isNewPollModalOpen, setIsNewPollModalOpen] = useState(false);

  const newPollForm = useForm<NewPollValues>({ 
    resolver: zodResolver(newPollSchema),
    defaultValues: {
        title: "",
        description: "",
        options: [{ value: "" }, { value: "" }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: newPollForm.control,
    name: "options",
  });
  
  if (!currentUser) {
      return <p>Loading...</p>;
  }

  const handleCreatePoll = newPollForm.handleSubmit(async (data) => {
    addPoll({ 
      title: data.title,
      description: data.description || "",
      options: data.options.map(o => ({ text: o.value })),
      author: currentUser.demographics?.name || "Anonymous",
    });
    toast({ title: "Poll Created!", description: "Your new poll is now live." });
    newPollForm.reset();
    setIsNewPollModalOpen(false);
  });
  
  const handleVote = (pollId: string, optionIndex: number) => {
    vote(pollId, currentUser.id, optionIndex);
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-end">
            <Dialog open={isNewPollModalOpen} onOpenChange={setIsNewPollModalOpen}>
                <DialogTrigger asChild><Button><Plus className="mr-2"/> Create New Poll</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Create a New Poll</DialogTitle><DialogDescription>Ask a question and gather opinions from your peers.</DialogDescription></DialogHeader>
                    <Form {...newPollForm}>
                        <form onSubmit={handleCreatePoll} className="space-y-4">
                        <FormField name="title" control={newPollForm.control} render={({ field }) => (
                            <FormItem><FormLabel>Poll Title</FormLabel><FormControl><Input {...field} placeholder="e.g., Best topic for revision?" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField name="description" control={newPollForm.control} render={({ field }) => (
                            <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea {...field} placeholder="Add some context to your poll..."/></FormControl><FormMessage /></FormItem>
                        )} />
                         <div>
                            <Label>Options</Label>
                            <div className="space-y-2 mt-2">
                            {fields.map((field, index) => (
                                 <FormField
                                    key={field.id}
                                    control={newPollForm.control}
                                    name={`options.${index}.value`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center gap-2">
                                                <Input {...field} placeholder={`Option ${index + 1}`} />
                                                {fields.length > 2 && <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>✕</Button>}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })} className="mt-2">Add Option</Button>
                        </div>
                        <DialogFooter><Button type="submit">Create Poll</Button></DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>

        {polls.length === 0 ? (
             <Card className="text-center py-12">
                <CardHeader>
                     <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
                    <CardTitle>No Polls Yet</CardTitle>
                    <CardDescription>Be the first to create a poll and start a discussion!</CardDescription>
                </CardHeader>
            </Card>
        ) : (
            <div className="grid md:grid-cols-2 gap-6">
                {polls.map(poll => {
                    const userVote = poll.votes.find(v => v.userId === currentUser.id);
                    const totalVotes = poll.votes.length;
                    
                    return (
                         <Card key={poll.id}>
                            <CardHeader>
                                <CardTitle>{poll.title}</CardTitle>
                                <CardDescription>{poll.description}</CardDescription>
                                <div className="text-xs text-muted-foreground pt-2 flex items-center gap-4">
                                    <span>By {poll.author}</span>
                                    <span className="flex items-center gap-1"><Users className="h-3 w-3"/> {totalVotes} Votes</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {poll.options.map((option, index) => {
                                        if (userVote !== undefined) {
                                            const optionVotes = poll.votes.filter(v => v.optionIndex === index).length;
                                            const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
                                            return (
                                                <div key={index} className="space-y-1">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-2">
                                                            {userVote.optionIndex === index && <Check className="h-4 w-4 text-primary" />}
                                                            <span className={cn(userVote.optionIndex === index && "font-bold")}>{option.text}</span>
                                                        </div>
                                                        <span className="font-semibold text-muted-foreground">{percentage.toFixed(0)}%</span>
                                                    </div>
                                                    <Progress value={percentage} />
                                                </div>
                                            )
                                        }
                                        return (
                                            <Button 
                                                key={index}
                                                variant="outline" 
                                                className="w-full justify-start"
                                                onClick={() => handleVote(poll.id, index)}
                                            >
                                                {option.text}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </CardContent>
                         </Card>
                    )
                })}
            </div>
        )}
    </div>
  );
}
