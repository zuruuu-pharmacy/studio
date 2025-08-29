"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';

export type Mode = 'patient' | 'pharmacist' | 'student';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('pharmacist');
  
  const contextValue = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <ModeContext.Provider value={contextValue}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
