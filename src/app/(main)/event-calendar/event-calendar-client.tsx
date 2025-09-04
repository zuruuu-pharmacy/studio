
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEventCalendar, EVENT_CATEGORIES, type EventCategory, CalendarEvent, Attachment } from '@/contexts/event-calendar-context';
import { useDiscussionForum } from "@/contexts/discussion-forum-context";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, CalendarIcon, Search, ExternalLink, Download, MessageSquare, KeyRound, Edit, Paperclip } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import * as ics from 'ics';
import { usePatient } from "@/contexts/patient-context";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const TEACHER_CODE = "239774";

const getFileType = (fileName: string): 'image' | 'pdf' | 'other' => {
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)) return 'image';
  if (/\.pdf$/i.test(fileName)) return 'pdf';
  return 'other';
};

const handleFileUpload = (file: File): Promise<Attachment> => {
    return new Promise((resolve, reject) => {
        if (file.size > MAX_FILE_SIZE) {
            return reject(new Error('File size exceeds 10MB limit.'));
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


const eventSchema = z.object({
  title: z.string().min(3, "Title is required."),
  description: z.string().optional(),
  date: z.date({ required_error: "A date is required." }),
  category: z.string().min(1, "Please select a category."),
  registrationLink: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  attachments: z.any().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

const categoryColors: { [key in EventCategory]: string } = {
  Academic: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-500/50",
  Professional: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-500/50",
  "Skill-based": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-500/50",
  Career: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-500/50",
  Community: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 border-teal-500/50",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-500/50",
};


export function EventCalendarClient() {
  const { events, addEvent, updateEvent, deleteEvent } = useEventCalendar();
  const { addPost } = useDiscussionForum();
  const { patientState } = usePatient();
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  
  const authorName = patientState.activeUser?.demographics?.name || 'Anonymous Student';

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: selectedDate,
      category: "Other",
      registrationLink: "",
      attachments: null,
    },
  });
  
  const dailyEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter(event => isSameDay(event.date, selectedDate))
  }, [events, selectedDate]);
  
  const filteredEvents = useMemo(() => {
    const lowercasedSearch = searchTerm.toLowerCase();
    const eventsToFilter = dailyEvents;
    
    if (!lowercasedSearch) return eventsToFilter;

    return eventsToFilter.filter(event => 
        event.title.toLowerCase().includes(lowercasedSearch) ||
        (event.description && event.description.toLowerCase().includes(lowercasedSearch)) ||
        event.category.toLowerCase().includes(lowercasedSearch)
    );
  }, [dailyEvents, searchTerm]);


  const groupedEvents = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
        (acc[event.category] = acc[event.category] || []).push(event);
        return acc;
    }, {} as Record<EventCategory, CalendarEvent[]>);

  }, [filteredEvents]);
  
  const totalEventsForDay = dailyEvents.length;
  const showingEventsCount = filteredEvents.length;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    form.setValue('date', date || new Date());
  };
  
  const handleOpenEventDialog = (event: CalendarEvent | null = null) => {
    setEditingEvent(event);
    if (event) {
        form.reset({
            title: event.title,
            description: event.description,
            date: event.date,
            category: event.category,
            registrationLink: event.registrationLink,
            attachments: null, // Don't pre-fill file input
        });
    } else {
        form.reset({
          title: "",
          description: "",
          date: selectedDate || new Date(),
          category: "Other",
          registrationLink: "",
          attachments: null,
        });
    }
    setIsModalOpen(true);
  }

  const handleFormSubmit = form.handleSubmit(async (data) => {
    let newAttachments: Attachment[] | undefined;
    if (data.attachments && data.attachments[0]) {
        try {
            newAttachments = [await handleFileUpload(data.attachments[0])];
        } catch (e) {
            toast({ variant: 'destructive', title: 'Upload Failed', description: (e as Error).message });
            return;
        }
    }
    
    if (editingEvent) {
        // Update existing event
        updateEvent(editingEvent.id, {
            ...editingEvent,
            ...data,
            category: data.category as EventCategory,
            attachments: newAttachments ? [...(editingEvent.attachments || []), ...newAttachments] : editingEvent.attachments
        });
        toast({ title: "Event Updated", description: `${data.title} has been updated.` });

    } else {
        // Create new event
        const forumPostId = `post_event_${Date.now()}`;
        addPost({
            id: forumPostId,
            title: `Event Feedback: ${data.title}`,
            content: `This is a discussion thread for the event "${data.title}" held on ${format(data.date, 'PPP')}.\n\nDescription: ${data.description || 'N/A'}`,
            author: 'Event Bot',
            category: 'Community',
            replies: [],
            date: new Date().toISOString(),
        });
        addEvent({
          title: data.title,
          description: data.description,
          date: data.date,
          category: data.category as EventCategory,
          registrationLink: data.registrationLink,
          forumThreadId: forumPostId,
          attachments: newAttachments,
        });
        toast({ title: "Event Added", description: `${data.title} has been added to your calendar.` });
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  });

  const handleDownloadIcs = (event: CalendarEvent) => {
    const { error, value } = ics.createEvent({
        title: event.title,
        description: event.description,
        start: [event.date.getFullYear(), event.date.getMonth() + 1, event.date.getDate(), event.date.getHours(), event.date.getMinutes()],
        duration: { hours: 1 }, // Default duration
    });

    if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not create calendar file.' });
        return;
    }

    const blob = new Blob([value as string], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/ /g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const handleAccessCodeCheck = () => {
    if (accessCode === TEACHER_CODE) {
      setIsTeacher(true);
      setIsTeacherModalOpen(false);
      toast({ title: "Teacher Access Granted" });
    } else {
      toast({ variant: "destructive", title: "Incorrect Code" });
    }
  }


  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <Card>
        <CardContent className="p-2">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="w-full"
                modifiers={{
                    hasEvent: events.map(e => e.date),
                }}
                modifiersStyles={{
                    hasEvent: {
                        fontWeight: 'bold',
                        border: '2px solid hsl(var(--primary))',
                    }
                }}
            />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <CardTitle>
                Events for {selectedDate ? format(selectedDate, 'PPP') : 'N/A'}
              </CardTitle>
              <CardDescription>
                {totalEventsForDay} event(s) scheduled. 
                {searchTerm && ` Showing ${showingEventsCount}.`}
              </CardDescription>
            </div>
             <div className="flex gap-2">
                <Dialog open={isTeacherModalOpen} onOpenChange={setIsTeacherModalOpen}>
                    <DialogTrigger asChild><Button variant="outline"><KeyRound className="mr-2"/> Teacher Access</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Teacher Access</DialogTitle><DialogDescription>Enter the code to edit and delete events.</DialogDescription></DialogHeader>
                        <div className="space-y-2">
                            <Label htmlFor="access-code">Access Code</Label>
                            <Input id="access-code" type="password" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAccessCodeCheck()} />
                        </div>
                        <DialogFooter><Button onClick={handleAccessCodeCheck}>Verify</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button onClick={() => handleOpenEventDialog()}>
                  <Plus className="mr-2" /> Add Event
                </Button>
            </div>
          </div>
          <div className="relative mt-4">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input 
                placeholder="Search events for this day..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
             />
          </div>
        </CardHeader>
        <CardContent>
          {totalEventsForDay > 0 ? (
            <div className="space-y-4">
              {Object.keys(groupedEvents).length === 0 && searchTerm ? (
                <div className="text-center text-muted-foreground py-12">
                    <Search className="mx-auto h-12 w-12 mb-4" />
                    <p>No events match your search.</p>
                </div>
              ) : (
                EVENT_CATEGORIES.map(category => {
                    const eventsInCategory = groupedEvents[category as EventCategory];
                    if (!eventsInCategory) return null;
                    return (
                    <div key={category}>
                        <h3 className="font-semibold text-lg mb-2">{category}</h3>
                        <ul className="space-y-3">
                        {eventsInCategory.map(event => (
                            <li key={event.id} className="p-3 rounded-lg border bg-muted/50 flex justify-between items-start gap-2">
                            <div className="flex-1 space-y-2">
                                <Badge className={categoryColors[event.category]}>{event.category}</Badge>
                                <p className="font-semibold mt-1">{event.title}</p>
                                {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                                
                                {event.attachments && event.attachments.length > 0 && (
                                     <div className="pt-2">
                                        <h4 className="font-semibold text-xs mb-1 flex items-center gap-1"><Paperclip className="h-3 w-3"/> Resources</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {event.attachments.map((att, i) => (
                                                <a key={i} href={att.dataUri} download={att.name}>
                                                    <Button variant="outline" size="sm">
                                                        <Download className="mr-2"/>{att.name}
                                                    </Button>
                                                </a>
                                            ))}
                                        </div>
                                     </div>
                                )}

                                <div className='flex flex-wrap gap-2 pt-2'>
                                  {event.registrationLink && (
                                      <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                                          <Button variant="secondary" size="sm">
                                              RSVP / Register <ExternalLink className="ml-2 h-4 w-4"/>
                                          </Button>
                                      </a>
                                  )}
                                  <Button variant="outline" size="sm" onClick={() => handleDownloadIcs(event)}>
                                      Add to Calendar <Download className="ml-2 h-4 w-4"/>
                                  </Button>
                                   {event.forumThreadId && (
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/student-discussion-forum?postId=${event.forumThreadId}`)}>
                                        Discuss & Review <MessageSquare className="ml-2 h-4 w-4"/>
                                    </Button>
                                  )}
                                </div>
                            </div>
                            {isTeacher && (
                                <div className="flex flex-col gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleOpenEventDialog(event)}>
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                <Trash2 className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the event: "{event.title}".</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteEvent(event.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
                            </li>
                        ))}
                        </ul>
                    </div>
                    )
                })
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <CalendarIcon className="mx-auto h-12 w-12 mb-4" />
              <p>No events scheduled for this day.</p>
            </div>
          )}
        </CardContent>
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                  <DialogDescription>
                    {editingEvent ? 'Update the details for this event.' : `Add a new event for ${selectedDate ? format(selectedDate, 'PPP') : ''}.`}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <FormField name="title" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField name="category" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>{EVENT_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="description" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField name="registrationLink" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Registration Link (Optional)</FormLabel><FormControl><Input type="url" placeholder="https://zoom.us/..." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField
                            name="attachments"
                            control={form.control}
                            render={({ field: { onChange, ...fieldProps} }) => (
                                <FormItem>
                                    <FormLabel>Attach Resources (Optional)</FormLabel>
                                    <FormControl>
                                        <Input {...fieldProps} type="file" onChange={(e) => onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                         />
                        <DialogFooter>
                            <Button type="submit">{editingEvent ? "Save Changes" : "Create Event"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
              </DialogContent>
         </Dialog>
      </Card>
    </div>
  );
}
