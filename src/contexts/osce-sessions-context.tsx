
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { OsceStationGeneratorOutput } from '@/ai/flows/osce-station-generator';

export interface OsceSession {
  id: string;
  topic: string;
  date: string;
  output: OsceStationGeneratorOutput;
}

interface OsceSessionsContextType {
  sessions: OsceSession[];
  addSession: (session: OsceSession) => void;
  deleteSession: (sessionId: string) => void;
  getSession: (sessionId: string) => OsceSession | undefined;
}

const OsceSessionsContext = createContext<OsceSessionsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'osce_sessions_v1';

export function OsceSessionsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<OsceSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
            setSessions(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load OSCE sessions from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
        } catch (error) {
            console.error("Failed to save OSCE sessions to localStorage", error);
        }
    }
  }, [sessions, isLoaded]);

  const addSession = (session: OsceSession) => {
    setSessions(prevSessions => [session, ...prevSessions]);
  };
  
  const deleteSession = (sessionId: string) => {
    setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
  };

  const getSession = (sessionId: string) => {
    return sessions.find(session => session.id === sessionId);
  };
  
  const contextValue = useMemo(() => ({ sessions, addSession, deleteSession, getSession }), [sessions]);

  // Prevent hydration mismatch by waiting for localStorage to load
  if (!isLoaded) {
    return null;
  }

  return (
    <OsceSessionsContext.Provider value={contextValue}>
      {children}
    </OsceSessionsContext.Provider>
  );
}

export function useOsceSessions() {
  const context = useContext(OsceSessionsContext);
  if (context === undefined) {
    throw new Error('useOsceSessions must be used within an OsceSessionsProvider');
  }
  return context;
}
