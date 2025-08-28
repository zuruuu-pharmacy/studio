
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';

export interface PatientHistory {
  // 1. Patient Identification (Demographics)
  demographics?: {
    name?: string;
    age?: string;
    gender?: string;
    maritalStatus?: string;
    occupation?: string;
    country?: string;
    province?: string;
    district?: string;
    town?: string;
    block?: string;
    street?: string;
    houseNo?: string;
    hospitalId?: string;
    phoneNumber?: string;
  };
  // 2. Presenting Complaint (PC)
  presentingComplaint?: string;
  // 3. History of Presenting Illness (HPI)
  historyOfPresentingIllness?: string;
  // 4. Past Medical History (PMH)
  pastMedicalHistory?: string;
  // 5. Medication History
  medicationHistory?: string;
  // 6. Allergy & ADR History
  allergyHistory?: string;
  // 7. Family History
  familyHistory?: string;
  // 8. Social History
  socialHistory?: string;
  // 9. Immunization History
  immunizationHistory?: string;
  // 10. Review of Systems (ROS)
  reviewOfSystems?: string;
  // 11. Lifestyle & Compliance
  lifestyleAndCompliance?: string;
  // 12. Patient’s Own Ideas & Concerns
  ideasAndConcerns?: string;
  // 13. Pharmacist’s Assessment
  pharmacistAssessment?: string;
  // 14. Plan (Pharmaceutical Care Plan)
  carePlan?: string;
}

interface PatientState {
    history: PatientHistory | null;
}

interface PatientContextType {
  patient: PatientState;
  setPatient: (patient: PatientState) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<PatientState>({ history: null });
  
  const contextValue = useMemo(() => ({ patient, setPatient }), [patient]);

  return (
    <PatientContext.Provider value={contextValue}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}
