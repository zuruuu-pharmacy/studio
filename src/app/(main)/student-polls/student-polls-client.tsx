
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
import { Plus, ListChecks, Check, BarChart3, Users, Percent, ShieldQuestion, BarChartHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";


const newPollSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().optional(),
  options: z.array(z.object({
    value: z.string().min(1, "Option cannot be empty."),
  })).min(2, "Must have at least two options."),
  isAnonymous: z.boolean().default(false),
});
type NewPollValues = z.infer<typeof newPollSchema>;


export function StudentPollsClient() {
  const { polls, addPoll, vote } = usePolls();
  const { patientState, addVotedPoll } = usePatient();
  const currentUser = patientState.activeUser;
  
  const [isNewPollModalOpen, setIsNewPollModalOpen] = useState(false);

  const newPollForm = useForm<NewPollValues>({ 
    resolver: zodResolver(newPollSchema),
    defaultValues: {
        title: "",
        description: "",
        options: [{ value: "" }, { value: "" }],
        isAnonymous: false,
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
      isAnonymous: data.isAnonymous,
    });
    toast({ title: "Poll Created!", description: "Your new poll is now live." });
    newPollForm.reset();
    setIsNewPollModalOpen(false);
  });
  
  const handleVote = (pollId: string, optionIndex: number) => {
    // This check is now primarily for anonymous polls, handled client-side
    if (currentUser.votedPollIds?.includes(pollId)) {
        toast({
            variant: "destructive",
            title: "Already Voted",
            description: "You have already voted in this anonymous poll.",
        });
        return;
    }
    vote(pollId, currentUser.id, optionIndex);
    addVotedPoll(pollId); // Track vote for anonymous polls
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
                         <FormField
                            control={newPollForm.control}
                            name="isAnonymous"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Anonymous Poll</FormLabel>
                                    <FormDescription>
                                    If checked, voter identities will not be tracked.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                            />
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
                    // For anonymous polls, we check the local user profile. For public polls, we check the votes array.
                    const hasVoted = poll.isAnonymous 
                        ? currentUser.votedPollIds?.includes(poll.id)
                        : poll.votes.some(v => v.userId === currentUser.id);

                    const userVoteIndex = hasVoted ? poll.votes.find(v => v.userId === currentUser.id)?.optionIndex : undefined;

                    const totalVotes = poll.votes.length;
                    
                    const chartData = poll.options.map((option, index) => ({
                        name: option.text,
                        votes: poll.votes.filter(v => v.optionIndex === index).length
                    }));

                    return (
                         <Card key={poll.id}>
                            <CardHeader>
                                <CardTitle>{poll.title}</CardTitle>
                                <CardDescription>{poll.description}</CardDescription>
                                <div className="text-xs text-muted-foreground pt-2 flex items-center gap-4">
                                    <span>By {poll.author}</span>
                                    <span className="flex items-center gap-1"><Users className="h-3 w-3"/> {totalVotes} Votes</span>
                                    {poll.isAnonymous && <span className="flex items-center gap-1"><ShieldQuestion className="h-3 w-3"/> Anonymous</span>}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {hasVoted ? (
                                        <ChartContainer config={{
                                            votes: {
                                                label: "Votes",
                                                color: "hsl(var(--primary))",
                                            }
                                        }} className="h-[200px] w-full">
                                            <BarChart
                                                accessibilityLayer
                                                data={chartData}
                                                layout="vertical"
                                                margin={{ left: 10, right: 10 }}
                                            >
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={10}
                                                    className="text-xs"
                                                    width={80}
                                                />
                                                <XAxis dataKey="votes" type="number" hide />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent hideLabel />}
                                                />
                                                <Bar dataKey="votes" layout="vertical" radius={5} />
                                            </BarChart>
                                        </ChartContainer>
                                    ) : (
                                        poll.options.map((option, index) => (
                                            <Button 
                                                key={index}
                                                variant="outline" 
                                                className="w-full justify-start"
                                                onClick={() => handleVote(poll.id, index)}
                                            >
                                                {option.text}
                                            </Button>
                                        ))
                                    )}
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
