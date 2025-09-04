
"use client";

import { usePatient, type PatientHistory, type PatientRecord } from "@/contexts/patient-context";
import { useMode } from "@/contexts/mode-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { notFound, useParams } from 'next/navigation';
import { User, ShieldAlert, Briefcase } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BackButton } from "@/components/back-button";


const formSections = [
    { id: 'demographics', title: '1. Patient Identification (Demographics)', fields: [
        { name: 'name', label: 'Name' },
        { name: 'age', label: 'Age / Date of Birth' },
        { name: 'gender', label: 'Gender' },
        { name: 'maritalStatus', label: 'Marital Status' },
        { name: 'occupation', label: 'Occupation' },
        { name: 'cnicOrPassport', label: 'CNIC or Passport No.', sensitive: true },
        { name: 'address', label: 'Address / Contact Info', sensitive: true },
        { name: 'hospitalId', label: 'Hospital ID / MRN' },
        { name: 'phoneNumber', label: 'Patient Phone Number', sensitive: true },
        { name: 'caretakerPhoneNumber', label: 'Caretaker Phone Number', sensitive: true },
    ]},
     { id: 'careerProfile', title: 'Career & Professional Profile', studentOnly: true, fields: [
        { name: 'careerInterests', label: 'Career Interests' },
        { name: 'preferredLocations', label: 'Preferred Work Locations' },
        { name: 'languages', label: 'Languages Spoken' },
        { name: 'linkedinProfile', label: 'LinkedIn Profile URL' },
        { name: 'personalStatement', label: 'Personal Statement / Bio' },
    ]},
    { id: 'presentingComplaint', title: '2. Presenting Complaint (PC)', field: 'presentingComplaint' },
    { id: 'historyOfPresentingIllness', title: '3. History of Presenting Illness (HPI)', field: 'historyOfPresentingIllness' },
    { id: 'pastMedicalHistory', title: '4. Past Medical History (PMH)', field: 'pastMedicalHistory' },
    { id: 'medicationHistory', title: '5. Medication History', field: 'medicationHistory' },
    { id: 'allergyHistory', title: '6. Allergy & ADR History', field: 'allergyHistory' },
    { id: 'familyHistory', title: '7. Family History', field: 'familyHistory' },
    { id: 'socialHistory', title: '8. Social History', field: 'socialHistory' },
    { id: 'immunizationHistory', title: '9. Immunization History', field: 'immunizationHistory' },
    { id: 'reviewOfSystems', title: '10. Review of Systems (ROS)', field: 'reviewOfSystems' },
    { id: 'systemicNotes', title: 'Systemic Notes (from Symptom Checker)' },
    { id: 'lifestyleAndCompliance', title: '11. Lifestyle & Compliance', field: 'lifestyleAndCompliance' },
    { id: 'ideasAndConcerns', title: '12. Patient’s Own Ideas & Concerns', field: 'ideasAndConcerns' },
    { id: 'pharmacistAssessment', title: '13. Pharmacist’s Assessment', field: 'pharmacistAssessment' },
    { id: 'carePlan', title: '14. Plan (Pharmaceutical Care Plan)', field: 'carePlan' },
];

const systemicNotesFields = [
    'Cardiovascular',
    'Respiratory',
    'Gastrointestinal',
    'Nervous',
    'Musculoskeletal',
    'Integumentary',
    'Urinary',
    'Endocrine',
    'Lymphatic/Immune',
    'Reproductive',
    'Hematologic',
    'General',
] as const;

export default function PatientViewPage() {
  const params = useParams();
  const id = params.id as string;
  const { patientState } = usePatient();
  const { mode } = useMode();

  const record = patientState.patientRecords.find(r => r.id === id);

  if (!record) {
    notFound();
  }

  const { history } = record;

  if (mode !== 'student') {
      return (
          <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>You do not have permission to view this page.</AlertDescription>
          </Alert>
      )
  }

  return (
    <div>
        <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Patient Case Study</h1>
      <p className="text-muted-foreground mb-6">
        Viewing the health record for educational purposes. Personal information has been redacted.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User /> {history.name || 'Unnamed Patient'}</CardTitle>
          <CardDescription>
            {history.age || 'N/A'} | {history.gender || 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4" defaultValue={['demographics', 'careerProfile']}>
            {formSections.map(section => {
                if (section.studentOnly && mode !== 'student') return null;

                return (
                <AccordionItem value={section.id} key={section.id} className="border rounded-lg bg-background/50">
                    <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">{section.title}</AccordionTrigger>
                    <AccordionContent className="p-6 pt-0 space-y-4">
                    {section.fields ? (
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                            {section.fields.map(field => {
                                if (field.sensitive && mode === 'student') return null;
                                const value = history[field.name as keyof PatientHistory];
                                return value ? (
                                <div key={field.name}>
                                        <p className="font-semibold">{field.label}</p>
                                        <p className="text-muted-foreground whitespace-pre-wrap">{value}</p>
                                </div>
                                ) : null
                            })}
                        </div>
                    ) : section.id === 'systemicNotes' ? (
                        <div className="space-y-4">
                            {systemicNotesFields.map(systemName => {
                                const note = history.systemicNotes?.[systemName as keyof typeof history.systemicNotes];
                                if(!note) return null;
                                return (
                                    <div key={systemName}>
                                        <p className="font-semibold">{systemName}</p>
                                        <p className="text-muted-foreground whitespace-pre-wrap">{note}</p>
                                    </div>
                                )
                            })}
                            {(!history.systemicNotes || Object.values(history.systemicNotes).every(v => !v)) && (
                                <p className="text-muted-foreground">No systemic notes recorded.</p>
                            )}
                        </div>
                    ) : section.field ? (
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {history[section.field as keyof PatientHistory] || 'No information provided.'}
                        </p>
                    ) : null}
                    </AccordionContent>
                </AccordionItem>
                )
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
