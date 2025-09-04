
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePatient } from '@/contexts/patient-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const formSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required."),
  company: z.string().min(1, "Company name is required."),
  achievement1: z.string().min(1, "Achievement is required."),
  achievement2: z.string().min(1, "Achievement is required."),
  achievement3: z.string().min(1, "Achievement is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function CoverLetterGeneratorClient() {
  const { patientState } = usePatient();
  const student = patientState.activeUser;
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      company: "",
      achievement1: "",
      achievement2: "",
      achievement3: "",
    }
  });

  const onSubmit = (data: FormValues) => {
    setIsPending(true);
    // Simulate AI generation
    setTimeout(() => {
      const letterTemplate = `
[Date: ${format(new Date(), 'PPP')}]
[Hiring Manager Name]
[Company Name: ${data.company}]
[Company Address]

Dear [Hiring Manager Name],

I am writing to express my keen interest in the ${data.jobTitle} position at ${data.company}, which I discovered through [Platform where you saw the ad]. With a strong foundation in pharmaceutical sciences from the University of Management and Technology and a passion for [Area of Interest], I am confident that I possess the skills and dedication necessary to contribute significantly to your team.

During my academic and practical experiences, I have consistently demonstrated my ability to excel. For instance:
- ${data.achievement1}
- ${data.achievement2}
- ${data.achievement3}

These experiences have equipped me with a robust skill set in [Mention a key skill area, e.g., clinical research, patient counseling, quality assurance] and a commitment to upholding the highest standards of care and professionalism. I am eager to bring my background in [Mention another skill] and my enthusiasm for [Mention something about the company] to ${data.company}.

Thank you for considering my application. I have attached my CV for your review and welcome the opportunity to discuss how my skills and experiences can benefit your organization.

Sincerely,
${student?.demographics?.name || "A Pharmacy Student"}
${student?.studentId || "your.email@example.com"}
${student?.demographics?.phoneNumber || "Your Phone Number"}
      `.trim();
      setGeneratedLetter(letterTemplate);
      setIsPending(false);
      toast({ title: 'Cover Letter Generated!', description: 'Review the draft below and copy it to your editor.' });
    }, 1500);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Generator Input</CardTitle>
                <CardDescription>Fill in the details to generate a draft cover letter.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField name="jobTitle" control={form.control} render={({ field }) => (<FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="company" control={form.control} render={({ field }) => (<FormItem><FormLabel>Company/Hospital</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="achievement1" control={form.control} render={({ field }) => (<FormItem><FormLabel>Key Achievement 1</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="achievement2" control={form.control} render={({ field }) => (<FormItem><FormLabel>Key Achievement 2</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="achievement3" control={form.control} render={({ field }) => (<FormItem><FormLabel>Key Achievement 3</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? <Loader2 className="mr-2 animate-spin"/> : <Sparkles className="mr-2"/>}
                            Generate Draft
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="p-4 min-h-[600px] bg-muted/50">
           <CardHeader><CardTitle>Generated Cover Letter</CardTitle></CardHeader>
           <CardContent>
            {isPending ? (
                 <div className="flex flex-col items-center justify-center h-96">
                    <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                    <p className="mt-4 text-muted-foreground">The AI is drafting your letter...</p>
                </div>
            ) : generatedLetter ? (
                 <Textarea readOnly value={generatedLetter} className="font-mono bg-background" rows={30}/>
            ) : (
                <div className="flex flex-col items-center justify-center h-96">
                    <p className="text-muted-foreground">Your generated letter will appear here.</p>
                </div>
            )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
