
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';

export type ForumCategory = 
    | "Pharmacology"
    | "Pharmaceutics"
    | "Pharmacognosy"
    | "Pharmaceutical Chemistry"
    | "Clinical Pharmacy";

export const FORUM_CATEGORIES: ForumCategory[] = [
    "Pharmacology",
    "Pharmaceutics",
    "Pharmacognosy",
    "Pharmaceutical Chemistry",
    "Clinical Pharmacy",
];


export interface ForumReply {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: ForumCategory;
  date: string;
  replies: ForumReply[];
}

interface DiscussionForumContextType {
  posts: ForumPost[];
  addPost: (post: Omit<ForumPost, 'id' | 'date' | 'replies'>) => void;
  addReply: (postId: string, reply: Omit<ForumReply, 'id' | 'date'>) => void;
}

const DiscussionForumContext = createContext<DiscussionForumContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'discussion_forum_v1';

export function DiscussionForumProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
            setPosts(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load forum posts from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
        } catch (error) {
            console.error("Failed to save forum posts to localStorage", error);
        }
    }
  }, [posts, isLoaded]);

  const addPost = (post: Omit<ForumPost, 'id' | 'date' | 'replies'>) => {
    const newPost: ForumPost = {
      ...post,
      id: `post_${Date.now().toString()}`,
      date: new Date().toISOString(),
      replies: [],
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  
  const addReply = (postId: string, reply: Omit<ForumReply, 'id' | 'date'>) => {
    const newReply: ForumReply = {
      ...reply,
      id: `reply_${Date.now().toString()}`,
      date: new Date().toISOString(),
    };
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return { ...post, replies: [...post.replies, newReply] };
      }
      return post;
    }));
  };
  
  const contextValue = useMemo(() => ({ posts, addPost, addReply }), [posts]);

  return (
    <DiscussionForumContext.Provider value={contextValue}>
      {children}
    </DiscussionForumContext.Provider>
  );
}

export function useDiscussionForum() {
  const context = useContext(DiscussionForumContext);
  if (context === undefined) {
    throw new Error('useDiscussionForum must be used within a DiscussionForumProvider');
  }
  return context;
}
