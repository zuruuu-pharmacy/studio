
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
import { CheckCircle } from "lucide-react";
import { usePatient } from "@/contexts/patient-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


const demographicsSchema = z.object({
  name: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
  cnicOrPassport: z.string().optional(),
  address: z.string().optional(),
  hospitalId: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const historySchema = z.object({
  id: z.string().optional(),
  demographics: demographicsSchema.optional(),
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
        { name: 'demographics.name', label: 'Name', placeholder: 'Full Name', type: 'input' },
        { name: 'demographics.age', label: 'Age / Date of Birth', placeholder: 'e.g., 45 years', type: 'input' },
        { name: 'demographics.gender', label: 'Gender', placeholder: 'Select Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
        { name: 'demographics.maritalStatus', label: 'Marital Status', placeholder: 'Select Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Prefer not to say'] },
        { name: 'demographics.occupation', label: 'Occupation', placeholder: 'Select Occupation', type: 'select', options: ['Healthcare Professional', 'Teacher / Educator', 'Engineer', 'IT Professional', 'Farmer', 'Laborer', 'Office Worker / Clerical', 'Business Owner / Entrepreneur', 'Student', 'Homemaker', 'Retired', 'Unemployed', 'Other'] },
        { name: 'demographics.cnicOrPassport', label: 'CNIC or Passport No.', placeholder: 'e.g., 12345-1234567-1', type: 'input' },
        { name: 'demographics.address', label: 'Address / Contact Info', placeholder: 'Full address including city', type: 'textarea' },
        { name: 'demographics.hospitalId', label: 'Hospital ID / MRN', placeholder: 'If applicable', type: 'input' },
        { name: 'demographics.phoneNumber', label: 'Phone Number', placeholder: '+92 3...', type: 'input' },
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
    id: undefined,
    demographics: {
        name: '',
        age: '',
        gender: '',
        maritalStatus: '',
        occupation: '',
        cnicOrPassport: '',
        address: '',
        hospitalId: '',
        phoneNumber: '',
    },
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
  const { patientState, addOrUpdatePatient, clearActivePatient, resetPatientHistory } = usePatient();
  const { toast } = useToast();
  const router = useRouter();

  const historyForm = useForm<HistoryFormValues>({
    resolver: zodResolver(historySchema),
    defaultValues: patientState.activePatient || defaultFormValues,
  });
  
  useEffect(() => {
    historyForm.reset(patientState.activePatient || defaultFormValues)
  }, [patientState.activePatient, historyForm]);


  const handleHistorySubmit = historyForm.handleSubmit((data) => {
    addOrUpdatePatient(data);
    toast({
      title: "Patient History Saved",
      description: "The patient's history has been saved.",
      duration: 3000,
    });
    router.push('/patients');
  });

  const handleReset = () => {
     if(patientState.activePatient) {
        resetPatientHistory(patientState.activePatient.id);
        toast({
          title: "Patient Record Deleted",
          description: "The patient's history has been removed.",
        });
     }
  }
  
  const handleAddNew = () => {
    clearActivePatient();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Comprehensive Patient History</CardTitle>
                <CardDescription>
                {patientState.activePatient ? `Editing patient: ${patientState.activePatient.demographics?.name || 'N/A'}` : 'Creating a new patient record.'}
                </CardDescription>
            </div>
            {patientState.activePatient && (
                <Button onClick={handleAddNew} variant="outline">Add New Patient</Button>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              {patientState.activePatient && (
                <Button type="button" variant="destructive" onClick={handleReset}>
                    Delete Patient Record
                </Button>
              )}
              <Button type="submit">
                {patientState.activePatient ? 'Update Patient History' : 'Save Patient History'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
