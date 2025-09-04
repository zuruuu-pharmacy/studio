
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Types for Polls
export interface PollOption {
  text: string;
}

export interface PollVote {
  userId: string | null; // Null for anonymous polls
  optionIndex: number;
}

export interface Poll {
  id: string;
  author: string;
  title: string;
  description: string;
  options: PollOption[];
  votes: PollVote[];
  date: string;
  isAnonymous: boolean;
}

// Context Type
interface PollsContextType {
  polls: Poll[];
  addPoll: (poll: Omit<Poll, 'id' | 'date' | 'votes'>) => void;
  vote: (pollId: string, userId: string, optionIndex: number) => void;
}

const PollsContext = createContext<PollsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'student_polls_v2'; // Bump version for new data structure

export function PollsProvider({ children }: { children: ReactNode }) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        setPolls(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to load polls from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever polls change
  useEffect(() => {
    if(isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(polls));
      } catch (error) {
        console.error("Failed to save polls to localStorage", error);
      }
    }
  }, [polls, isLoaded]);

  const addPoll = (poll: Omit<Poll, 'id' | 'date' | 'votes'>) => {
    const newPoll: Poll = {
      ...poll,
      id: `poll_${Date.now()}`,
      date: new Date().toISOString(),
      votes: [],
    };
    setPolls(prevPolls => [newPoll, ...prevPolls]);
  };
  
  const vote = (pollId: string, userId: string, optionIndex: number) => {
    setPolls(prevPolls => prevPolls.map(poll => {
      if (poll.id === pollId) {
        // For non-anonymous polls, check if user has already voted by checking the vote array
        if (!poll.isAnonymous && poll.votes.some(v => v.userId === userId)) {
          return poll;
        }

        // For all polls, the vote is added. For anonymous polls, userId is null.
        const newVote: PollVote = { userId: poll.isAnonymous ? null : userId, optionIndex };
        return { ...poll, votes: [...poll.votes, newVote] };
      }
      return poll;
    }));
  };
  
  const contextValue = useMemo(() => ({ polls, addPoll, vote }), [polls]);

  return (
    <PollsContext.Provider value={contextValue}>
      {children}
    </PollsContext.Provider>
  );
}

export function usePolls() {
  const context = useContext(PollsContext);
  if (context === undefined) {
    throw new Error('usePolls must be used within a PollsProvider');
  }
  return context;
}
