
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';

export interface PatientHistory {
  // 1. Patient Identification (Demographics)
  id: string;
  demographics?: {
    name?: string;
    age?: string;
    gender?: string;
    maritalStatus?: string;
    occupation?: string;
    cnicOrPassport?: string;
    address?: string;
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
    activePatient: PatientHistory | null;
    patients: PatientHistory[];
}

interface PatientContextType {
  patientState: PatientState;
  setPatientState: React.Dispatch<React.SetStateAction<PatientState>>;
  addOrUpdatePatient: (patientHistory: Omit<PatientHistory, 'id'> & { id?: string }) => void;
  setActivePatient: (patientId: string | null) => void;
  clearActivePatient: () => void;
  resetPatientHistory: (patientId: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pharmacy_patients';

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patientState, setPatientState] = useState<PatientState>({ activePatient: null, patients: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedPatients = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedPatients) {
        setPatientState(JSON.parse(savedPatients));
      }
    } catch (error) {
      console.error("Failed to load patient data from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(patientState));
        } catch (error) {
            console.error("Failed to save patient data to localStorage", error);
        }
    }
  }, [patientState, isLoaded]);

  const addOrUpdatePatient = (patientHistory: Omit<PatientHistory, 'id'> & { id?: string }) => {
    setPatientState(prevState => {
        const newPatients = [...prevState.patients];
        if(patientHistory.id) {
            const index = newPatients.findIndex(p => p.id === patientHistory.id);
            if(index !== -1) {
                newPatients[index] = { ...newPatients[index], ...patientHistory };
                 return { ...prevState, patients: newPatients, activePatient: newPatients[index] };
            }
        }
        
        const newPatient = { ...patientHistory, id: Date.now().toString() };
        newPatients.push(newPatient);
        return { ...prevState, patients: newPatients, activePatient: newPatient };
    });
  };
  
  const setActivePatient = (patientId: string | null) => {
    if (patientId === null) {
        setPatientState(s => ({...s, activePatient: null}));
        return;
    }
    const patientToSelect = patientState.patients.find(p => p.id === patientId);
    if(patientToSelect) {
        setPatientState(s => ({...s, activePatient: patientToSelect}));
    }
  }

  const clearActivePatient = () => {
    setPatientState(s => ({...s, activePatient: null}));
  }
  
  const resetPatientHistory = (patientId: string) => {
    setPatientState(prevState => {
        const newPatients = prevState.patients.filter(p => p.id !== patientId);
        const newActivePatient = prevState.activePatient?.id === patientId ? null : prevState.activePatient;
        return { ...prevState, patients: newPatients, activePatient: newActivePatient };
    });
  };


  const contextValue = useMemo(() => ({ patientState, setPatientState, addOrUpdatePatient, setActivePatient, clearActivePatient, resetPatientHistory }), [patientState]);

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
