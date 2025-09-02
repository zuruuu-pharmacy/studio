
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';

export interface LectureNote {
  id: string;
  topicName: string;
  folder: string;
  fileName: string;
  fileDataUri: string;
}

interface LectureNotesContextType {
  notes: LectureNote[];
  addNote: (note: Omit<LectureNote, 'id'>) => void;
  deleteNote: (noteId: string) => void;
}

const LectureNotesContext = createContext<LectureNotesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'lecture_notes_v1';

export function LectureNotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<LectureNote[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
            setNotes(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load lecture notes from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
        } catch (error) {
            console.error("Failed to save lecture notes to localStorage", error);
        }
    }
  }, [notes, isLoaded]);

  const addNote = (note: Omit<LectureNote, 'id'>) => {
    const newNote: LectureNote = {
      ...note,
      id: `note_${Date.now().toString()}`,
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
  };
  
  const deleteNote = (noteId: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  };
  
  const contextValue = useMemo(() => ({ notes, addNote, deleteNote }), [notes]);

  return (
    <LectureNotesContext.Provider value={contextValue}>
      {children}
    </LectureNotesContext.Provider>
  );
}

export function useLectureNotes() {
  const context = useContext(LectureNotesContext);
  if (context === undefined) {
    throw new Error('useLectureNotes must be used within a LectureNotesProvider');
  }
  return context;
}
