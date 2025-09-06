
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';

export type EventCategory = 
    | "Academic"
    | "Professional"
    | "Skill-based"
    | "Career"
    | "Community"
    | "Other";

export const EVENT_CATEGORIES: EventCategory[] = [
    "Academic",
    "Professional",
    "Skill-based",
    "Career",
    "Community",
    "Other"
];

export interface Attachment {
  name: string;
  type: 'image' | 'pdf' | 'other';
  dataUri: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  category: EventCategory;
  registrationLink?: string;
  forumThreadId?: string; // Link to the discussion forum post
  attachments?: Attachment[];
}

interface EventCalendarContextType {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (eventId: string, updatedEvent: CalendarEvent) => void;
  deleteEvent: (eventId: string) => void;
}

const EventCalendarContext = createContext<EventCalendarContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'event_calendar_v2'; // Bumped version for attachments

export function EventCalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData, (key, value) => {
            if (key === 'date') return new Date(value);
            return value;
        });
        if (Array.isArray(parsedData)) {
            setEvents(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load events from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
        } catch (error) {
            console.error("Failed to save events to localStorage", error);
        }
    }
  }, [events, isLoaded]);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event_${Date.now().toString()}`,
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };
  
  const updateEvent = (eventId: string, updatedEvent: CalendarEvent) => {
    setEvents(prevEvents => prevEvents.map(event => event.id === eventId ? updatedEvent : event));
  }
  
  const deleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };
  
  const contextValue = useMemo(() => ({ events, addEvent, updateEvent, deleteEvent }), [events]);

  // Prevent hydration mismatch by waiting for localStorage to load
  if (!isLoaded) {
    return null;
  }

  return (
    <EventCalendarContext.Provider value={contextValue}>
      {children}
    </EventCalendarContext.Provider>
  );
}

export function useEventCalendar() {
  const context = useContext(EventCalendarContext);
  if (context === undefined) {
    throw new Error('useEventCalendar must be used within an EventCalendarProvider');
  }
  return context;
}
