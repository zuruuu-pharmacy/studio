
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDiscussionForum, FORUM_CATEGORIES, type ForumCategory, type Attachment } from "@/contexts/discussion-forum-context";
import { usePatient } from "@/contexts/patient-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Plus, Send, ArrowLeft, UserCircle, Folder, ThumbsUp, Star, Paperclip, Download, Search, Flame, KeyRound, Trash2, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const TEACHER_CODE = "239774";


const newPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  category: z.string().min(1, "Please select a category."),
  attachment: z.any().optional(),
});
type NewPostValues = z.infer<typeof newPostSchema>;

const newReplySchema = z.object({
  reply: z.string().min(1, "Reply cannot be empty."),
  attachment: z.any().optional(),
});
type NewReplyValues = z.infer<typeof newReplySchema>;

const getFileType = (fileName: string): 'image' | 'pdf' | 'other' => {
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)) return 'image';
  if (/\.pdf$/i.test(fileName)) return 'pdf';
  return 'other';
};

const handleFileUpload = (file: File): Promise<Attachment> => {
    return new Promise((resolve, reject) => {
        if (file.size > MAX_FILE_SIZE) {
            return reject(new Error('File size exceeds 5MB limit.'));
        }
        const reader = new FileReader();
        reader.onload = () => {
            resolve({
                name: file.name,
                type: getFileType(file.name),
                dataUri: reader.result as string,
            });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

function AttachmentDisplay({ attachments }: { attachments?: Attachment[] }) {
    if (!attachments || attachments.length === 0) return null;
    return (
        <div className="mt-4 space-y-2">
            {attachments.map((att, i) => (
                att.type === 'image' ? (
                    <Image key={i} src={att.dataUri} alt={att.name} width={300} height={300} className="rounded-md border max-w-sm" />
                ) : (
                    <a key={i} href={att.dataUri} download={att.name} className="block">
                        <Button variant="outline"><Download className="mr-2"/>Download {att.name}</Button>
                    </a>
                )
            ))}
        </div>
    )
}

export function StudentDiscussionForumClient() {
  const { posts, addPost, addReply, upvoteReply, toggleBestAnswer, deletePost, deleteReply } = useDiscussionForum();
  const { patientState, toggleBookmark } = usePatient();
  const currentUser = patientState.activeUser;
  
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [accessCode, setAccessCode] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const newPostForm = useForm<NewPostValues>({ 
    resolver: zodResolver(newPostSchema),
    defaultValues: {
        title: "",
        content: "",
        category: "",
        attachment: null,
    }
  });
  const newReplyForm = useForm<NewReplyValues>({ 
    resolver: zodResolver(newReplySchema),
    defaultValues: {
        reply: "",
        attachment: null,
    }
  });

  const reputationScores = useMemo(() => {
    const scores = new Map<string, number>();
    posts.forEach(post => {
        post.replies.forEach(reply => {
            scores.set(reply.author, (scores.get(reply.author) || 0) + reply.upvotes);
        });
    });
    return scores;
  }, [posts]);

  const selectedPost = useMemo(() => posts.find(p => p.id === selectedPostId), [posts, selectedPostId]);
  
  const sortedReplies = useMemo(() => {
    if (!selectedPost) return [];
    return [...selectedPost.replies].sort((a, b) => {
        if (a.isBestAnswer) return -1;
        if (b.isBestAnswer) return 1;
        return b.upvotes - a.upvotes;
    });
  }, [selectedPost]);
  
  const filteredPosts = useMemo(() => {
    if (!currentUser) return [];
    const lowercasedFilter = searchTerm.toLowerCase();
    return posts.filter((post) => {
        const isBookmarked = currentUser.bookmarkedPostIds?.includes(post.id);
        const matchesSearch = post.title.toLowerCase().includes(lowercasedFilter) ||
                              post.content.toLowerCase().includes(lowercasedFilter) ||
                              post.category.toLowerCase().includes(lowercasedFilter);
        
        if(showBookmarksOnly) {
            return isBookmarked && matchesSearch;
        }
        return matchesSearch;
    });
  }, [searchTerm, posts, showBookmarksOnly, currentUser]);
  
  const hotTopics = useMemo(() => {
    return [...posts].sort((a, b) => b.replies.length - a.replies.length).slice(0, 3);
  }, [posts]);

  const authorName = currentUser?.demographics?.name || 'Anonymous Student';
  const getInitials = (name?: string) => {
    if (!name) return "AS";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const handleCreatePost = newPostForm.handleSubmit(async (data) => {
    let newAttachments: Attachment[] | undefined;
    if (data.attachment && data.attachment[0]) {
        try {
            newAttachments = [await handleFileUpload(data.attachment[0])];
        } catch (e) {
            toast({ variant: 'destructive', title: 'Upload Failed', description: (e as Error).message });
            return;
        }
    }
    addPost({ ...data, author: authorName, category: data.category as ForumCategory, attachments: newAttachments });
    toast({ title: "Post Created!", description: "Your new discussion topic is live." });
    newPostForm.reset();
    setIsNewPostModalOpen(false);
  });

  const handleCreateReply = newReplyForm.handleSubmit(async (data) => {
    if (!selectedPostId) return;
    let newAttachments: Attachment[] | undefined;
     if (data.attachment && data.attachment[0]) {
        try {
            newAttachments = [await handleFileUpload(data.attachment[0])];
        } catch (e) {
            toast({ variant: 'destructive', title: 'Upload Failed', description: (e as Error).message });
            return;
        }
    }
    addReply(selectedPostId, { content: data.reply, author: authorName, attachments: newAttachments });
    newReplyForm.reset();
  });
  
  const handleDeletePost = (postId: string) => {
    deletePost(postId);
    toast({ title: "Post Deleted" });
    setSelectedPostId(null);
  };

  const handleDeleteReply = (postId: string, replyId: string) => {
    deleteReply(postId, replyId);
    toast({ title: "Reply Deleted" });
  };
  
  const handleAccessCodeCheck = () => {
    if (accessCode === TEACHER_CODE) {
      setIsTeacher(true);
      setIsTeacherModalOpen(false);
      toast({ title: "Moderator Access Granted" });
    } else {
      toast({ variant: "destructive", title: "Incorrect Code" });
    }
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


  if (selectedPost) {
    const isOriginalPoster = selectedPost.author === authorName;
    const isBookmarked = currentUser.bookmarkedPostIds?.includes(selectedPost.id) ?? false;
    const authorReputation = reputationScores.get(selectedPost.author) || 0;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <Button onClick={() => setSelectedPostId(null)} variant="outline"><ArrowLeft className="mr-2"/> Back to All Posts</Button>
            <div className="flex gap-2">
                 <Button variant={isBookmarked ? "default" : "outline"} onClick={() => toggleBookmark(selectedPost.id)}>
                    <Bookmark className={cn("mr-2 h-4 w-4", isBookmarked && "fill-current")} />
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
                {isTeacher && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="mr-2"/>Delete Post</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this post and all its replies.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeletePost(selectedPost.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{selectedPost.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
                <span>Category: {selectedPost.category} | Posted by {selectedPost.author} on {new Date(selectedPost.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 text-amber-500"><Star className="h-4 w-4"/> {authorReputation}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="whitespace-pre-wrap">{selectedPost.content}</p>
            <AttachmentDisplay attachments={selectedPost.attachments} />
            <hr />
            <h3 className="font-semibold text-lg">Replies ({selectedPost.replies.length})</h3>
            <div className="space-y-4">
              {sortedReplies.map(reply => {
                 const replyAuthorReputation = reputationScores.get(reply.author) || 0;
                 return (
                    <div key={reply.id} className={cn("flex gap-4 p-4 rounded-lg", reply.isBestAnswer && "bg-green-100 dark:bg-green-900/30 border-2 border-green-500")}>
                        <Avatar><AvatarFallback>{getInitials(reply.author)}</AvatarFallback></Avatar>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">{reply.author}</p>
                                    <span className="flex items-center gap-1 text-xs text-amber-500"><Star className="h-3 w-3"/> {replyAuthorReputation}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                {reply.isBestAnswer && <div className="flex items-center gap-1 text-sm font-bold text-green-600"><Star className="h-4 w-4 fill-current" /> BEST ANSWER</div>}
                                {isTeacher && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><Trash2 className="h-4 w-4 text-destructive"/></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Delete this reply?</AlertDialogTitle></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteReply(selectedPost.id, reply.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground py-2">{reply.content}</p>
                            <AttachmentDisplay attachments={reply.attachments} />
                            <div className="flex items-center gap-4 mt-2">
                                <Button variant="outline" size="sm" onClick={() => upvoteReply(selectedPost.id, reply.id)}>
                                <ThumbsUp className="mr-2 h-4 w-4"/> {reply.upvotes}
                                </Button>
                                {(isOriginalPoster || isTeacher) && (
                                    <Button variant="ghost" size="sm" onClick={() => toggleBestAnswer(selectedPost.id, reply.id)}>
                                        <Star className="mr-2 h-4 w-4"/> {reply.isBestAnswer ? 'Unmark as Best' : 'Mark as Best'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )})}
            </div>
            <Form {...newReplyForm}>
              <form onSubmit={handleCreateReply} className="space-y-4">
                 <FormField name="reply" control={newReplyForm.control} render={({ field }) => (
                  <FormItem><FormLabel>Your Reply</FormLabel><FormControl><Textarea {...field} placeholder="Write a reply..." /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex gap-4 items-end">
                    <FormField name="attachment" control={newReplyForm.control} render={({ field: { onChange, ...fieldProps} }) => (
                      <FormItem>
                          <FormLabel>Attach File (Optional)</FormLabel>
                          <FormControl><Input {...fieldProps} type="file" onChange={(e) => onChange(e.target.files)} /></FormControl>
                          <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit"><Send className="h-4 w-4"/></Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <CardTitle>Discussion Threads</CardTitle>
                        <div className="flex gap-2">
                             <Dialog open={isTeacherModalOpen} onOpenChange={setIsTeacherModalOpen}>
                                <DialogTrigger asChild><Button variant="outline"><KeyRound className="mr-2"/> Moderator Access</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Moderator Access</DialogTitle><DialogDescription>Enter the code to enable moderation tools.</DialogDescription></DialogHeader>
                                    <div className="space-y-2">
                                        <Label htmlFor="access-code">Access Code</Label>
                                        <Input id="access-code" type="password" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAccessCodeCheck()} />
                                    </div>
                                    <DialogFooter><Button onClick={handleAccessCodeCheck}>Verify</Button></DialogFooter>
                                </DialogContent>
                            </Dialog>
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
                                                <SelectContent>{FORUM_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
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
                                        <FormField name="attachment" control={newPostForm.control} render={({ field: { onChange, ...fieldProps} }) => (
                                            <FormItem>
                                                <FormLabel>Attach File (Optional)</FormLabel>
                                                <FormControl><Input {...fieldProps} type="file" onChange={(e) => onChange(e.target.files)} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <DialogFooter><Button type="submit">Create Post</Button></DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <CardDescription>Browse discussions by category or start a new thread.</CardDescription>
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Search all discussions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={sortBy} onValueChange={(v) => setSortBy(v as "newest" | "oldest")}>
                                <SelectTrigger><SelectValue placeholder="Sort by..." /></SelectTrigger>
                                <SelectContent><SelectItem value="newest">Sort by Newest</SelectItem><SelectItem value="oldest">Sort by Oldest</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                        <Switch id="bookmarks-only" checked={showBookmarksOnly} onCheckedChange={setShowBookmarksOnly} />
                        <Label htmlFor="bookmarks-only">Show My Bookmarks Only</Label>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredPosts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                        <MessageSquare className="mx-auto h-12 w-12 mb-4" />
                        <p>{searchTerm ? `No results found for "${searchTerm}".` : (showBookmarksOnly ? 'You have no bookmarked posts.' : 'No discussions yet. Be the first to start one!')}</p>
                    </div>
                    ) : (
                    <Accordion type="multiple" className="w-full space-y-3" defaultValue={FORUM_CATEGORIES}>
                        {FORUM_CATEGORIES.map(category => {
                        const postsInCategory = filteredPosts
                            .filter(p => p.category === category)
                            .sort((a, b) => sortBy === 'newest' ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime());

                        if (postsInCategory.length === 0) return null;

                        return (
                            <AccordionItem value={category} key={category} className="border rounded-lg bg-background/50">
                            <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                                <div className="flex items-center gap-2"><Folder className="text-primary"/>{category}</div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4">
                                <ul className="space-y-2">
                                {postsInCategory.map(post => {
                                    const isBookmarked = currentUser.bookmarkedPostIds?.includes(post.id) ?? false;
                                    return (
                                    <li key={post.id} className="flex justify-between items-center group">
                                        <button onClick={() => setSelectedPostId(post.id)} className="flex-1 text-left p-2 rounded-md hover:bg-muted">
                                            <p className="font-semibold">{post.title}</p>
                                            <p className="text-sm text-muted-foreground">by {post.author} | {post.replies.length} replies</p>
                                        </button>
                                        <Button variant="ghost" size="icon" onClick={() => toggleBookmark(post.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-current text-primary")}/>
                                        </Button>
                                    </li>
                                )})}
                                </ul>
                            </AccordionContent>
                            </AccordionItem>
                        );
                        })}
                    </Accordion>
                    )}
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Flame className="text-destructive"/> Hot Topics</CardTitle>
                    <CardDescription>Most active discussions right now.</CardDescription>
                </CardHeader>
                <CardContent>
                    {hotTopics.length > 0 ? (
                         <ul className="space-y-2">
                            {hotTopics.map(post => (
                                <li key={post.id}>
                                    <button onClick={() => setSelectedPostId(post.id)} className="w-full text-left p-2 rounded-md hover:bg-muted">
                                        <p className="font-semibold text-sm">{post.title}</p>
                                        <p className="text-xs text-muted-foreground">{post.replies.length} replies</p>
                                    </button>
                                </li>
                            ))}
                         </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">No active discussions yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
