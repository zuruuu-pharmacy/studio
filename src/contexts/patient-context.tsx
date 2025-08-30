
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { Mode } from './mode-context';
import type { ReadPrescriptionOutput } from '@/ai/flows/prescription-reader';

export type OrganSystem = 
    | 'Cardiovascular'
    | 'Respiratory'
    | 'Gastrointestinal'
    | 'Nervous'
    | 'Musculoskeletal'
    | 'Integumentary'
    | 'Urinary'
    | 'Endocrine'
    | 'Lymphatic/Immune'
    | 'Reproductive'
    | 'Hematologic'
    | 'General';

export interface PatientHistory {
  name?: string;
  age?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  cnicOrPassport?: string;
  address?: string;
  hospitalId?: string;
  phoneNumber?: string;
  presentingComplaint?: string;
  historyOfPresentingIllness?: string;
  pastMedicalHistory?: string;
  medicationHistory?: string;
  allergyHistory?: string;
  familyHistory?: string;
  socialHistory?: string;
  immunizationHistory?: string;
  reviewOfSystems?: string;
  systemicNotes?: Partial<Record<OrganSystem, string>>;
  lifestyleAndCompliance?: string;
  ideasAndConcerns?: string;
  pharmacistAssessment?: string;
  carePlan?: string;
}

export interface UserProfile {
  id: string;
  role: Mode;
  demographics?: {
    name?: string;
    phoneNumber?: string;
  };
  studentId?: string; // Specific to students
  patientHistoryId?: string; // Link to a patient history record
}

export interface PatientRecord {
    id: string;
    history: PatientHistory;
}


interface PatientState {
    activeUser: UserProfile | null;
    users: UserProfile[];
    patientRecords: PatientRecord[];
    lastPrescription: ReadPrescriptionOutput | null;
}

interface PatientContextType {
  patientState: PatientState;
  addOrUpdateUser: (user: Omit<UserProfile, 'id'> & { id?: string }) => UserProfile;
  setActiveUser: (userId: string | null) => void;
  clearActiveUser: () => void;
  addOrUpdatePatientRecord: (history: PatientHistory) => PatientRecord;
  getActivePatientRecord: () => PatientRecord | undefined;
  deletePatientRecord: (recordId: string) => void;
  setLastPrescription: (prescription: ReadPrescriptionOutput) => void;
  clearLastPrescription: () => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pharmacy_data_v2';

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patientState, setPatientState] = useState<PatientState>({ activeUser: null, users: [], patientRecords: [], lastPrescription: null });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Basic validation to prevent crashes on data structure changes
        if(parsedData.users && parsedData.patientRecords) {
            // Don't persist lastPrescription across page loads
            parsedData.lastPrescription = null;
            setPatientState(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
        try {
            const dataToSave = { ...patientState, lastPrescription: null };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }
  }, [patientState, isLoaded]);

  const addOrUpdateUser = (user: Omit<UserProfile, 'id'> & { id?: string }): UserProfile => {
    let updatedUser: UserProfile;
    setPatientState(prevState => {
        const newUsers = [...prevState.users];
        if(user.id) { // Update existing user
            const index = newUsers.findIndex(u => u.id === user.id);
            if(index !== -1) {
                updatedUser = { ...newUsers[index], ...user };
                newUsers[index] = updatedUser;
                 return { ...prevState, users: newUsers, activeUser: newUsers[index] };
            }
        }
        // Add new user
        updatedUser = { ...user, id: Date.now().toString() } as UserProfile;
        newUsers.push(updatedUser);
        return { ...prevState, users: newUsers, activeUser: updatedUser };
    });
    // @ts-ignore
    return updatedUser;
  };
  
  const setActiveUser = (userId: string | null) => {
    if (userId === null) {
        setPatientState(s => ({...s, activeUser: null}));
        return;
    }
    const userToSelect = patientState.users.find(u => u.id === userId);
    if(userToSelect) {
        setPatientState(s => ({...s, activeUser: userToSelect}));
    }
  }

  const clearActiveUser = () => {
    setPatientState(s => ({...s, activeUser: null}));
  }

  const addOrUpdatePatientRecord = (history: PatientHistory & {id?: string}): PatientRecord => {
    let newRecord: PatientRecord | undefined = undefined;
    setPatientState(prevState => {
        const newRecords = [...prevState.patientRecords];
        const activeUserPatientHistoryId = prevState.activeUser?.patientHistoryId;

        if(activeUserPatientHistoryId) {
             const index = newRecords.findIndex(r => r.id === activeUserPatientHistoryId);
             if (index !== -1) { // Update
                newRecords[index] = { ...newRecords[index], history };
                newRecord = newRecords[index];
                return { ...prevState, patientRecords: newRecords };
             }
        }
        
        // Create new record
        const recordId = `record_${Date.now().toString()}`;
        const createdRecord = { id: recordId, history };
        newRecords.push(createdRecord);
        newRecord = createdRecord;

        // If there's an active user, link this new record to them
        const newUsers = prevState.users.map(u => 
            u.id === prevState.activeUser?.id ? { ...u, patientHistoryId: recordId } : u
        );
        const newActiveUser = prevState.activeUser ? {...prevState.activeUser, patientHistoryId: recordId} : null;

        return { ...prevState, patientRecords: newRecords, users: newUsers, activeUser: newActiveUser };
    });
    
    if(!newRecord) {
        // This case should not happen if logic is correct, but as a fallback, create a non-state version.
        // This might happen if called when there is no active user.
        const activeUserPatientHistoryId = patientState.activeUser?.patientHistoryId;
        const existingRecord = activeUserPatientHistoryId ? patientState.patientRecords.find(r => r.id === activeUserPatientHistoryId) : undefined;
        if(existingRecord) {
            newRecord = {...existingRecord, history};
        } else {
             newRecord = { id: `record_${Date.now().toString()}`, history };
        }
    }
    
    return newRecord;
  }

  const getActivePatientRecord = (): PatientRecord | undefined => {
      if (!patientState.activeUser?.patientHistoryId) return undefined;
      return patientState.patientRecords.find(r => r.id === patientState.activeUser!.patientHistoryId);
  }

  const deletePatientRecord = (recordId: string) => {
    setPatientState(prevState => {
        const newRecords = prevState.patientRecords.filter(r => r.id !== recordId);
        // Unlink this record from any user that has it
        const newUsers = prevState.users.map(u => 
            u.patientHistoryId === recordId ? { ...u, patientHistoryId: undefined } : u
        );
        const newActiveUser = prevState.activeUser?.patientHistoryId === recordId 
            ? { ...prevState.activeUser, patientHistoryId: undefined } 
            : prevState.activeUser;
            
        return { ...prevState, patientRecords: newRecords, users: newUsers, activeUser: newActiveUser };
    });
  };

  const setLastPrescription = (prescription: ReadPrescriptionOutput) => {
    setPatientState(s => ({ ...s, lastPrescription: prescription }));
  };

  const clearLastPrescription = () => {
    setPatientState(s => ({ ...s, lastPrescription: null }));
  };


  const contextValue = useMemo(() => ({ 
      patientState, 
      addOrUpdateUser, 
      setActiveUser, 
      clearActiveUser, 
      addOrUpdatePatientRecord,
      getActivePatientRecord,
      deletePatientRecord,
      setLastPrescription,
      clearLastPrescription
    }), [patientState]);

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
