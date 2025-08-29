
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePatient, type PatientHistory } from "@/contexts/patient-context";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMode } from "@/contexts/mode-context";


const historySchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
  cnicOrPassport: z.string().optional(),
  address: z.string().optional(),
  hospitalId: z.string().optional(),
  phoneNumber: z.string().optional(),
  presentingComplaint: z.string().optional(),
  historyOfPresentingIllness: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  medicationHistory: z.string().optional(),
  allergyHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  socialHistory: z.string().optional(),
  immunizationHistory: z.string().optional(),
  reviewOfSystems: z.string().optional(),
  lifestyleAndCompliance: z.string().optional(),
  ideasAndConcerns: z.string().optional(),
  pharmacistAssessment: z.string().optional(),
  carePlan: z.string().optional(),
});


type HistoryFormValues = z.infer<typeof historySchema>;

const formSections = [
    { id: 'demographics', title: '1. Patient Identification (Demographics)', fields: [
        { name: 'name', label: 'Name', placeholder: 'Full Name', type: 'input' },
        { name: 'age', label: 'Age / Date of Birth', placeholder: 'e.g., 45 years', type: 'input' },
        { name: 'gender', label: 'Gender', placeholder: 'Select Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
        { name: 'maritalStatus', label: 'Marital Status', placeholder: 'Select Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Prefer not to say'] },
        { name: 'occupation', label: 'Occupation', placeholder: 'Select Occupation', type: 'select', options: ['Healthcare Professional', 'Teacher / Educator', 'Engineer', 'IT Professional', 'Farmer', 'Laborer', 'Office Worker / Clerical', 'Business Owner / Entrepreneur', 'Student', 'Homemaker', 'Retired', 'Unemployed', 'Other'] },
        { name: 'cnicOrPassport', label: 'CNIC or Passport No.', placeholder: 'e.g., 12345-1234567-1', type: 'input' },
        { name: 'address', label: 'Address / Contact Info', placeholder: 'Full address including city', type: 'textarea' },
        { name: 'hospitalId', label: 'Hospital ID / MRN', placeholder: 'If applicable', type: 'input' },
        { name: 'phoneNumber', label: 'Phone Number', placeholder: '+92 3...', type: 'input' },
    ]},
    { id: 'presentingComplaint', title: '2. Presenting Complaint (PC)', description: 'The patient’s main complaint in their own words.', field: { name: 'presentingComplaint', placeholder: 'e.g., "Shortness of breath for 2 days"' } },
    { id: 'historyOfPresentingIllness', title: '3. History of Presenting Illness (HPI)', description: 'A deeper dive into the presenting complaint (onset, duration, progression, etc.)', field: { name: 'historyOfPresentingIllness', placeholder: 'Describe the onset, duration, progression, associated symptoms...' } },
    { id: 'pastMedicalHistory', title: '4. Past Medical History (PMH)', description: 'Chronic illnesses, previous hospitalizations, surgeries, etc.', field: { name: 'pastMedicalHistory', placeholder: 'e.g., Diabetes, HTN, asthma...' } },
    { id: 'medicationHistory', title: '5. Medication History', description: 'Prescription, OTC, herbal medicines, supplements, adherence, and side effects.', field: { name: 'medicationHistory', placeholder: 'List all current and previous medications, including dose, frequency...' } },
    { id: 'allergyHistory', title: '6. Allergy & ADR History', description: 'Drug, food, and environmental allergies and the type of reaction.', field: { name: 'allergyHistory', placeholder: 'e.g., Penicillin (rash), Sulfa (breathing difficulty)...' } },
    { id: 'familyHistory', title: '7. Family History', description: 'Relevant genetic or familial diseases.', field: { name: 'familyHistory', placeholder: 'e.g., Diabetes, heart disease in family...' } },
    { id: 'socialHistory', title: '8. Social History', description: 'Smoking, alcohol use, diet, exercise, occupation, financial status.', field: { name: 'socialHistory', placeholder: 'e.g., Smoker (1 pack/day), social drinker, sedentary lifestyle...' } },
    { id: 'immunizationHistory', title: '9. Immunization History', description: 'Vaccination status.', field: { name: 'immunizationHistory', placeholder: 'e.g., Tetanus, hepatitis, flu, COVID...' } },
    { id: 'reviewOfSystems', title: '10. Review of Systems (ROS)', description: 'A quick screen of each organ system.', field: { name: 'reviewOfSystems', placeholder: 'General: weight loss, fever. CVS: chest pain. Respiratory: cough...' } },
    { id: 'lifestyleAndCompliance', title: '11. Lifestyle & Compliance', description: 'How patients take their meds, missed doses, and barriers.', field: { name: 'lifestyleAndCompliance', placeholder: 'e.g., Uses pillbox, sometimes forgets evening dose, concerned about cost...' } },
    { id: 'ideasAndConcerns', title: '12. Patient’s Own Ideas & Concerns', description: 'What the patient thinks is causing their illness and their concerns.', field: { name: 'ideasAndConcerns', placeholder: 'e.g., "I think it\'s because of the spicy food I ate."...' } },
    { id: 'pharmacistAssessment', title: '13. Pharmacist’s Assessment', description: 'Summary of problems identified, goals of therapy.', field: { name: 'pharmacistAssessment', placeholder: 'e.g., Potential drug interaction between X and Y, non-adherence to medication Z...' } },
    { id: 'carePlan', title: '14. Plan (Pharmaceutical Care Plan)', description: 'Counseling points, communication with doctor, monitoring.', field: { name: 'carePlan', placeholder: 'e.g., Counsel patient on taking med with food, recommend monitoring BP...' } },
];

const defaultFormValues: HistoryFormValues = {
    name: '',
    age: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    cnicOrPassport: '',
    address: '',
    hospitalId: '',
    phoneNumber: '',
    presentingComplaint: '',
    historyOfPresentingIllness: '',
    pastMedicalHistory: '',
    medicationHistory: '',
    allergyHistory: '',
    familyHistory: '',
    socialHistory: '',
    immunizationHistory: '',
    reviewOfSystems: '',
    lifestyleAndCompliance: '',
    ideasAndConcerns: '',
    pharmacistAssessment: '',
    carePlan: '',
};

export function PatientHistoryClient() {
  const { mode } = useMode();
  const { addOrUpdatePatientRecord, getActivePatientRecord, deletePatientRecord, clearActiveUser, patientState } = usePatient();
  const { toast } = useToast();
  const router = useRouter();

  const activePatientRecord = useMemo(getActivePatientRecord, [patientState.activeUser, patientState.patientRecords]);

  const historyForm = useForm<HistoryFormValues>({
    resolver: zodResolver(historySchema),
    defaultValues: activePatientRecord?.history || defaultFormValues,
  });
  
  useEffect(() => {
    historyForm.reset(activePatientRecord?.history || defaultFormValues);
  }, [activePatientRecord, historyForm]);


  const handleHistorySubmit = historyForm.handleSubmit((data: PatientHistory) => {
    const savedRecord = addOrUpdatePatientRecord(data);
    toast({
      title: "Patient History Saved",
      description: `The history for ${data.name} has been saved.`,
      duration: 3000,
    });
    // For pharmacists, go to the patient list to see the new entry
    if (mode === 'pharmacist') {
        router.push('/patients');
    }
  });

  const handleReset = () => {
     if(activePatientRecord) {
        deletePatientRecord(activePatientRecord.id);
        toast({
          title: "Patient Record Deleted",
          description: `The record for ${activePatientRecord.history.name} has been removed.`,
        });
        router.push('/patients');
     }
  }
  
  const handleAddNew = () => {
    clearActiveUser(); // This clears the user, which in turn clears the active record for the form
  }

  const isEditing = !!activePatientRecord;
  const cardTitle = {
    'pharmacist': isEditing ? 'Edit Patient History' : 'Add New Patient History',
    'patient': 'My Patient History',
    'student': 'My Student Health Record',
  }[mode];

  const cardDescription = {
     'pharmacist': isEditing ? `Editing record for: ${activePatientRecord?.history.name}` : 'Creating a new patient record.',
     'patient': `Editing your personal health record.`,
     'student': 'This health record will serve as your patient case study.',
  }[mode];


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
            </div>
             {mode === 'pharmacist' && (
                <Button onClick={handleAddNew} variant="outline">Add New</Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...historyForm}>
          <form onSubmit={handleHistorySubmit} className="space-y-4">
            <Accordion type="multiple" className="w-full space-y-4" defaultValue={['demographics']}>
              {formSections.map(section => (
                <AccordionItem value={section.id} key={section.id} className="border rounded-lg bg-background/50">
                  <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">{section.title}</AccordionTrigger>
                  <AccordionContent className="p-6 pt-0">
                    {section.description && <p className="text-sm text-muted-foreground mb-4">{section.description}</p>}
                    <div className={section.id === 'demographics' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}>
                      {section.id === 'demographics' && section.fields ? (
                        section.fields.map(f => (
                           <FormField
                            key={f.name}
                            control={historyForm.control}
                            name={f.name as any}
                            render={({ field }) => (
                              <FormItem className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                                <FormLabel>{f.label}</FormLabel>
                                {f.type === 'select' ? (
                                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={f.placeholder} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {f.options?.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                ) : f.type === 'textarea' ? (
                                    <FormControl><Textarea placeholder={f.placeholder} {...field} value={field.value ?? ''} /></FormControl>
                                ) : (
                                    <FormControl><Input placeholder={f.placeholder} {...field} value={field.value ?? ''} /></FormControl>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))
                      ) : section.field ? (
                          <FormField
                            control={historyForm.control}
                            name={section.field.name as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl><Textarea placeholder={section.field.placeholder} {...field} value={field.value ?? ''} rows={4} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      ) : null}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="flex justify-end pt-4 gap-4">
              {isEditing && (
                <Button type="button" variant="destructive" onClick={handleReset}>
                    Delete Record
                </Button>
              )}
              <Button type="submit">
                {isEditing ? 'Update History' : 'Save History'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
