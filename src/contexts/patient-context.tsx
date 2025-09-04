
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
  id?: string; // Add optional id for easier updates
  name?: string;
  age?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  cnicOrPassport?: string;
  address?: string;
  hospitalId?: string;
  phoneNumber?: string;
  caretakerPhoneNumber?: string;
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
  bookmarkedPostIds?: string[]; // For discussion forum bookmarks
}

export interface PatientRecord {
    id: string;
    history: PatientHistory;
}


interface PatientContextType {
  patientState: PatientState;
  addOrUpdateUser: (user: Omit<UserProfile, 'id'> & { id?: string }) => UserProfile;
  setActiveUser: (userId: string | null) => void;
  clearActiveUser: () => void;
  addOrUpdatePatientRecord: (history: PatientHistory, recordId?: string) => PatientRecord;
  getActivePatientRecord: () => PatientRecord | undefined;
  deletePatientRecord: (recordId: string) => void;
  setLastPrescription: (prescription: ReadPrescriptionOutput) => void;
  clearLastPrescription: () => void;
  toggleBookmark: (postId: string) => void;
}

interface PatientState {
    activeUser: UserProfile | null;
    users: UserProfile[];
    patientRecords: PatientRecord[];
    lastPrescription: ReadPrescriptionOutput | null;
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
            const dataToSave = { ...patientState, lastPrescription: null }; // Never save lastPrescription
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

  const addOrUpdatePatientRecord = (history: PatientHistory, recordIdToUpdate?: string): PatientRecord => {
    let newRecord: PatientRecord | undefined = undefined;
    
    // Determine the ID to use: passed in ID, or the active user's linked ID.
    const recordId = recordIdToUpdate || patientState.activeUser?.patientHistoryId;

    setPatientState(prevState => {
        const newRecords = [...prevState.patientRecords];
        
        if(recordId) {
             const index = newRecords.findIndex(r => r.id === recordId);
             if (index !== -1) { // Update existing record
                newRecords[index] = { ...newRecords[index], history };
                newRecord = newRecords[index];
                return { ...prevState, patientRecords: newRecords };
             }
        }
        
        // If no matching record was found to update, create a new one.
        const newRecordId = `record_${Date.now().toString()}`;
        const createdRecord = { id: newRecordId, history };
        newRecords.push(createdRecord);
        newRecord = createdRecord;

        // If there's an active user without a history, link this new record to them.
        const newUsers = prevState.users.map(u => 
            (u.id === prevState.activeUser?.id && !u.patientHistoryId) ? { ...u, patientHistoryId: newRecordId } : u
        );
        const newActiveUser = (prevState.activeUser && !prevState.activeUser.patientHistoryId) 
            ? {...prevState.activeUser, patientHistoryId: newRecordId} 
            : prevState.activeUser;

        return { ...prevState, patientRecords: newRecords, users: newUsers, activeUser: newActiveUser };
    });
    
    return newRecord!;
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

  const toggleBookmark = (postId: string) => {
    setPatientState(prevState => {
        if (!prevState.activeUser) return prevState;

        const bookmarkedIds = new Set(prevState.activeUser.bookmarkedPostIds || []);
        if (bookmarkedIds.has(postId)) {
            bookmarkedIds.delete(postId);
        } else {
            bookmarkedIds.add(postId);
        }

        const updatedUser = {
            ...prevState.activeUser,
            bookmarkedPostIds: Array.from(bookmarkedIds),
        };

        return {
            ...prevState,
            activeUser: updatedUser,
            users: prevState.users.map(u => u.id === updatedUser.id ? updatedUser : u),
        };
    });
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
      clearLastPrescription,
      toggleBookmark,
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
