
"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDiscussionForum, FORUM_CATEGORIES, type ForumCategory } from "@/contexts/discussion-forum-context";
import { usePatient } from "@/contexts/patient-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Plus, Send, ArrowLeft, UserCircle, Folder, ThumbsUp, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/lib/utils";

const newPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  category: z.string().min(1, "Please select a category."),
});
type NewPostValues = z.infer<typeof newPostSchema>;

const newReplySchema = z.object({
  reply: z.string().min(1, "Reply cannot be empty."),
});
type NewReplyValues = z.infer<typeof newReplySchema>;

export function StudentDiscussionForumClient() {
  const { posts, addPost, addReply, upvoteReply, toggleBestAnswer } = useDiscussionForum();
  const { patientState } = usePatient();
  
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  const newPostForm = useForm<NewPostValues>({ resolver: zodResolver(newPostSchema) });
  const newReplyForm = useForm<NewReplyValues>({ resolver: zodResolver(newReplySchema) });

  const currentUser = patientState.activeUser;
  const authorName = currentUser?.demographics?.name || 'Anonymous Student';
  const getInitials = (name?: string) => {
    if (!name) return "AS";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  if (!currentUser || currentUser.role !== 'student') {
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>This feature is available for students only. Please log in as a student to participate.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/"><Button>Back to Login</Button></Link>
            </CardContent>
        </Card>
    )
  }

  const handleCreatePost = newPostForm.handleSubmit((data) => {
    addPost({ ...data, author: authorName, category: data.category as ForumCategory });
    toast({ title: "Post Created!", description: "Your new discussion topic is live." });
    newPostForm.reset({ title: "", content: "", category: "" });
    setIsNewPostModalOpen(false);
  });

  const handleCreateReply = newReplyForm.handleSubmit((data) => {
    if (!selectedPostId) return;
    addReply(selectedPostId, { content: data.reply, author: authorName });
    newReplyForm.reset({ reply: "" });
  });

  const selectedPost = posts.find(p => p.id === selectedPostId);

  const sortedReplies = useMemo(() => {
    if (!selectedPost) return [];
    return [...selectedPost.replies].sort((a, b) => {
        if (a.isBestAnswer) return -1;
        if (b.isBestAnswer) return 1;
        return b.upvotes - a.upvotes;
    });
  }, [selectedPost]);


  if (selectedPost) {
    const isOriginalPoster = selectedPost.author === authorName;
    return (
      <div className="space-y-4">
        <Button onClick={() => setSelectedPostId(null)} variant="outline"><ArrowLeft className="mr-2"/> Back to All Posts</Button>
        <Card>
          <CardHeader>
            <CardTitle>{selectedPost.title}</CardTitle>
            <CardDescription>
                Category: {selectedPost.category} | Posted by {selectedPost.author} on {new Date(selectedPost.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="whitespace-pre-wrap">{selectedPost.content}</p>
            <hr />
            <h3 className="font-semibold text-lg">Replies ({selectedPost.replies.length})</h3>
            <div className="space-y-4">
              {sortedReplies.map(reply => (
                <div key={reply.id} className={cn("flex gap-4 p-4 rounded-lg", reply.isBestAnswer && "bg-green-100 dark:bg-green-900/30 border-2 border-green-500")}>
                  <Avatar><AvatarFallback>{getInitials(reply.author)}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">{reply.author}</p>
                        {reply.isBestAnswer && <div className="flex items-center gap-1 text-sm font-bold text-green-600"><Star className="h-4 w-4 fill-current" /> BEST ANSWER</div>}
                    </div>
                    <p className="text-sm text-muted-foreground py-2">{reply.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                        <Button variant="outline" size="sm" onClick={() => upvoteReply(selectedPost.id, reply.id)}>
                           <ThumbsUp className="mr-2 h-4 w-4"/> {reply.upvotes}
                        </Button>
                         {isOriginalPoster && (
                            <Button variant="ghost" size="sm" onClick={() => toggleBestAnswer(selectedPost.id, reply.id)}>
                                <Star className="mr-2 h-4 w-4"/> Mark as Best
                            </Button>
                         )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Form {...newReplyForm}>
              <form onSubmit={handleCreateReply} className="flex gap-2">
                <FormField name="reply" control={newReplyForm.control} render={({ field }) => (
                  <FormItem className="flex-grow"><FormControl><Input {...field} placeholder="Write a reply..." /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit"><Send className="h-4 w-4"/></Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Discussion Threads</CardTitle>
          <Dialog open={isNewPostModalOpen} onOpenChange={setIsNewPostModalOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2"/> New Post</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Start a New Discussion</DialogTitle></DialogHeader>
              <Form {...newPostForm}>
                <form onSubmit={handleCreatePost} className="space-y-4">
                   <FormField name="category" control={newPostForm.control} render={({ field }) => (
                     <FormItem>
                       <FormLabel>Category</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                         <FormControl><SelectTrigger><SelectValue placeholder="Select a subject category..." /></SelectTrigger></FormControl>
                         <SelectContent>
                           {FORUM_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                         </SelectContent>
                       </Select>
                       <FormMessage />
                     </FormItem>
                   )} />
                  <FormField name="title" control={newPostForm.control} render={({ field }) => (
                    <FormItem><FormLabel>Topic Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField name="content" control={newPostForm.control} render={({ field }) => (
                    <FormItem><FormLabel>Your Question or Comment</FormLabel><FormControl><Textarea {...field} rows={6} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <DialogFooter><Button type="submit">Create Post</Button></DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Browse discussions by category or start a new thread.</CardDescription>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <MessageSquare className="mx-auto h-12 w-12 mb-4" />
            <p>No discussions yet. Be the first to start one!</p>
          </div>
        ) : (
          <Accordion type="multiple" className="w-full space-y-3">
            {FORUM_CATEGORIES.map(category => {
              const postsInCategory = posts.filter(p => p.category === category);
              if (postsInCategory.length === 0) return null;

              return (
                <AccordionItem value={category} key={category} className="border rounded-lg bg-background/50">
                  <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-2"><Folder className="text-primary"/>{category}</div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <ul className="space-y-2">
                      {postsInCategory.map(post => (
                        <li key={post.id}>
                          <button onClick={() => setSelectedPostId(post.id)} className="w-full text-left p-2 rounded-md hover:bg-muted">
                            <p className="font-semibold">{post.title}</p>
                            <p className="text-sm text-muted-foreground">by {post.author} on {new Date(post.date).toLocaleDateString()} | {post.replies.length} replies</p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
