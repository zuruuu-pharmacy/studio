
"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePatient } from '@/contexts/patient-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlusCircle, Trash2, Printer, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const cvFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  summary: z.string().optional(),
  education: z.array(z.object({
    institution: z.string().min(1, "Institution is required."),
    degree: z.string().min(1, "Degree is required."),
    year: z.string().min(4, "Year is required."),
  })),
  experience: z.array(z.object({
    role: z.string().min(1, "Role is required."),
    company: z.string().min(1, "Company is required."),
    period: z.string().min(1, "Period is required."),
    description: z.string().optional(),
  })),
  skills: z.array(z.object({
    skill: z.string().min(1, "Skill cannot be empty."),
  })),
  certifications: z.array(z.object({
    cert: z.string().min(1, "Certification cannot be empty."),
  })),
});

type CvFormValues = z.infer<typeof cvFormSchema>;

export function CvBuilderClient() {
  const { patientState } = usePatient();
  const student = patientState.activeUser;

  const form = useForm<CvFormValues>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      name: student?.demographics?.name || "",
      email: student?.studentId || "",
      phone: student?.demographics?.phoneNumber || "",
      linkedin: student?.demographics?.linkedinProfile || "",
      summary: student?.demographics?.personalStatement || "",
      education: [{ institution: 'University of Management and Technology', degree: 'Pharm.D', year: '2020-2025' }],
      experience: [],
      skills: [{ skill: 'Clinical Research' }, { skill: 'Patient Counseling' }],
      certifications: [],
    }
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experience" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control: form.control, name: "certifications" });

  const cvData = form.watch();

  const handlePrint = () => {
    toast({ title: 'Printing CV...', description: 'This would trigger the browser print dialog.' });
    // window.print(); // This would be the actual implementation
  }

  const handleDownload = () => {
     toast({ title: 'Downloading PDF...', description: 'A PDF version of your CV would be generated and downloaded.' });
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>CV Content</CardTitle>
                <CardDescription>Fill in the sections below. The preview will update automatically.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form>
                        <Accordion type="multiple" defaultValue={['personal', 'education']} className="w-full">
                           <AccordionItem value="personal">
                                <AccordionTrigger>Personal Details</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    <FormField name="name" control={form.control} render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField name="email" control={form.control} render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField name="phone" control={form.control} render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField name="linkedin" control={form.control} render={({ field }) => (<FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </AccordionContent>
                           </AccordionItem>
                            <AccordionItem value="summary">
                                <AccordionTrigger>Summary</AccordionTrigger>
                                <AccordionContent>
                                     <FormField name="summary" control={form.control} render={({ field }) => (<FormItem><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </AccordionContent>
                           </AccordionItem>
                            <AccordionItem value="education">
                                <AccordionTrigger>Education</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                     {eduFields.map((field, index) => (
                                         <Card key={field.id} className="p-4 bg-muted/50"><div className="space-y-2">
                                            <FormField name={`education.${index}.institution`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <FormField name={`education.${index}.degree`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <FormField name={`education.${index}.year`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Year</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                         </div><Button variant="ghost" size="icon" className="float-right -mt-8" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></Card>
                                     ))}
                                     <Button variant="outline" size="sm" onClick={() => appendEdu({ institution: '', degree: '', year: '' })}><PlusCircle className="mr-2"/>Add Education</Button>
                                </AccordionContent>
                           </AccordionItem>
                            <AccordionItem value="experience">
                                <AccordionTrigger>Experience</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                     {expFields.map((field, index) => (
                                         <Card key={field.id} className="p-4 bg-muted/50"><div className="space-y-2">
                                            <FormField name={`experience.${index}.role`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <FormField name={`experience.${index}.company`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Company/Hospital</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <FormField name={`experience.${index}.period`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Period</FormLabel><FormControl><Input {...field} placeholder="e.g., 2023 - Present" /></FormControl></FormItem>)} />
                                            <FormField name={`experience.${index}.description`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>)} />
                                         </div><Button variant="ghost" size="icon" className="float-right -mt-8" onClick={() => removeExp(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></Card>
                                     ))}
                                     <Button variant="outline" size="sm" onClick={() => appendExp({ role: '', company: '', period: '', description: '' })}><PlusCircle className="mr-2"/>Add Experience</Button>
                                </AccordionContent>
                           </AccordionItem>
                            <AccordionItem value="skills">
                                <AccordionTrigger>Skills</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                     {skillFields.map((field, index) => (
                                         <div key={field.id} className="flex gap-2">
                                            <FormField name={`skills.${index}.skill`} control={form.control} render={({ field }) => (<FormItem className="flex-1"><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                         </div>
                                     ))}
                                     <Button variant="outline" size="sm" onClick={() => appendSkill({ skill: '' })}><PlusCircle className="mr-2"/>Add Skill</Button>
                                </AccordionContent>
                           </AccordionItem>
                            <AccordionItem value="certifications">
                                <AccordionTrigger>Certifications</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                     {certFields.map((field, index) => (
                                         <div key={field.id} className="flex gap-2">
                                            <FormField name={`certifications.${index}.cert`} control={form.control} render={({ field }) => (<FormItem className="flex-1"><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeCert(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                         </div>
                                     ))}
                                     <Button variant="outline" size="sm" onClick={() => appendCert({ cert: '' })}><PlusCircle className="mr-2"/>Add Certification</Button>
                                </AccordionContent>
                           </AccordionItem>
                        </Accordion>
                    </form>
                </Form>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Button onClick={handlePrint}><Printer className="mr-2"/>Print CV</Button>
                <Button onClick={handleDownload} variant="secondary"><Download className="mr-2"/>Download as PDF</Button>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="p-8">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <header className="text-center mb-6 border-b pb-4">
              <h1 className="text-3xl font-bold mb-1">{cvData.name}</h1>
              <div className="text-muted-foreground flex justify-center gap-4 text-xs">
                {cvData.email && <span>{cvData.email}</span>}
                {cvData.phone && <span>{cvData.phone}</span>}
                {cvData.linkedin && <a href={cvData.linkedin} target="_blank" rel="noopener noreferrer">{cvData.linkedin}</a>}
              </div>
            </header>

            {cvData.summary && <section>
              <h2 className="text-lg font-semibold border-b mb-2">PROFESSIONAL SUMMARY</h2>
              <p>{cvData.summary}</p>
            </section>}

            {cvData.education?.length > 0 && <section>
              <h2 className="text-lg font-semibold border-b mt-4 mb-2">EDUCATION</h2>
              {cvData.education.map((edu, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold">{edu.institution}</h3>
                    <p className="text-sm text-muted-foreground">{edu.year}</p>
                  </div>
                  <p className="text-sm">{edu.degree}</p>
                </div>
              ))}
            </section>}

            {cvData.experience?.length > 0 && <section>
              <h2 className="text-lg font-semibold border-b mt-4 mb-2">EXPERIENCE</h2>
              {cvData.experience.map((exp, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold">{exp.role}</h3>
                    <p className="text-sm text-muted-foreground">{exp.period}</p>
                  </div>
                  <p className="text-sm italic">{exp.company}</p>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </section>}
            
             <div className="grid grid-cols-2 gap-x-8">
                 {cvData.skills?.length > 0 && <section>
                  <h2 className="text-lg font-semibold border-b mt-4 mb-2">SKILLS</h2>
                  <ul className="list-disc list-inside">
                    {cvData.skills.map((skill, i) => <li key={i}>{skill.skill}</li>)}
                  </ul>
                </section>}

                {cvData.certifications?.length > 0 && <section>
                  <h2 className="text-lg font-semibold border-b mt-4 mb-2">CERTIFICATIONS</h2>
                  <ul className="list-disc list-inside">
                    {cvData.certifications.map((cert, i) => <li key={i}>{cert.cert}</li>)}
                  </ul>
                </section>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
