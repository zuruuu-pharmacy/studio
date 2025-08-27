"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';

export interface PatientHistory {
    pastMedicalHistory?: string;
    familyHistory?: string;
    socialHistory?: string;
    medicationHistory?: string;
}

interface PatientState {
    history: PatientHistory | null;
    isEmergency: boolean;
}

interface PatientContextType {
  patient: PatientState;
  setPatient: (patient: PatientState) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<PatientState>({ history: null, isEmergency: false });
  
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
