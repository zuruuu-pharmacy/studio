
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';

export type ForumCategory = 
    | "Pharmacology"
    | "Pharmaceutics"
    | "Pharmacognosy"
    | "Pharmaceutical Chemistry"
    | "Clinical Pharmacy"
    | "Pathology"
    | "Computer"
    | "Community";

export const FORUM_CATEGORIES: ForumCategory[] = [
    "Pharmacology",
    "Pharmaceutics",
    "Pharmacognosy",
    "Pharmaceutical Chemistry",
    "Clinical Pharmacy",
    "Pathology",
    "Computer",
    "Community"
];

export interface Attachment {
  name: string;
  type: 'image' | 'pdf' | 'other';
  dataUri: string;
}

export interface ForumReply {
  id: string;
  author: string;
  content: string;
  date: string;
  upvotes: number;
  isBestAnswer: boolean;
  attachments?: Attachment[];
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: ForumCategory;
  date: string;
  replies: ForumReply[];
  attachments?: Attachment[];
}

interface DiscussionForumContextType {
  posts: ForumPost[];
  addPost: (post: Omit<ForumPost, 'date' | 'replies'>) => void;
  addReply: (postId: string, reply: Omit<ForumReply, 'id' | 'date' | 'upvotes' | 'isBestAnswer'>) => void;
  upvoteReply: (postId: string, replyId: string) => void;
  toggleBestAnswer: (postId: string, replyId: string) => void;
  deletePost: (postId: string) => void;
  deleteReply: (postId: string, replyId: string) => void;
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

  const addPost = (post: Omit<ForumPost, 'date' | 'replies'>) => {
    const newPost: ForumPost = {
      ...post,
      date: new Date().toISOString(),
      replies: [],
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  
  const addReply = (postId: string, reply: Omit<ForumReply, 'id' | 'date' | 'upvotes' | 'isBestAnswer'>) => {
    const newReply: ForumReply = {
      ...reply,
      id: `reply_${Date.now().toString()}`,
      date: new Date().toISOString(),
      upvotes: 0,
      isBestAnswer: false,
    };
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return { ...post, replies: [...post.replies, newReply] };
      }
      return post;
    }));
  };

  const upvoteReply = (postId: string, replyId: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
            return {
                ...post,
                replies: post.replies.map(reply => 
                    reply.id === replyId ? { ...reply, upvotes: reply.upvotes + 1 } : reply
                )
            };
        }
        return post;
    }));
  };

  const toggleBestAnswer = (postId: string, replyId: string) => {
     setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
            const isAlreadyBest = post.replies.find(r => r.id === replyId)?.isBestAnswer;
            return {
                ...post,
                replies: post.replies.map(reply => {
                    // If the clicked reply is already the best, untag it.
                    if (reply.id === replyId) {
                         return { ...reply, isBestAnswer: !isAlreadyBest };
                    }
                    // If we are setting a new best answer, ensure all others are not best.
                    if (!isAlreadyBest) {
                        return { ...reply, isBestAnswer: false };
                    }
                    return reply;
                })
            };
        }
        return post;
    }));
  };

  const deletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  };
  
  const deleteReply = (postId: string, replyId: string) => {
    setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
            return {
                ...post,
                replies: post.replies.filter(reply => reply.id !== replyId)
            };
        }
        return post;
    }));
  };
  
  const contextValue = useMemo(() => ({ posts, addPost, addReply, upvoteReply, toggleBestAnswer, deletePost, deleteReply }), [posts]);

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
