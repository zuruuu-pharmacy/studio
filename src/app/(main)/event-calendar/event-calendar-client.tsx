
"use client";

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEventCalendar, EVENT_CATEGORIES, type EventCategory, CalendarEvent } from '@/contexts/event-calendar-context';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, CalendarIcon } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


const eventSchema = z.object({
  title: z.string().min(3, "Title is required."),
  description: z.string().optional(),
  date: z.date({ required_error: "A date is required." }),
  category: z.string().min(1, "Please select a category."),
});

type EventFormValues = z.infer<typeof eventSchema>;

const categoryColors: { [key in EventCategory]: string } = {
  Academic: "bg-blue-500/80 text-white",
  Professional: "bg-purple-500/80 text-white",
  "Skill-based": "bg-green-500/80 text-white",
  Career: "bg-orange-500/80 text-white",
  Community: "bg-teal-500/80 text-white",
  Other: "bg-gray-500/80 text-white",
};

export function EventCalendarClient() {
  const { events, addEvent, deleteEvent } = useEventCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: selectedDate,
      category: "Other",
    },
  });

  const groupedEvents = useMemo(() => {
    if (!selectedDate) return {};
    const eventsForDay = events.filter(event => isSameDay(event.date, selectedDate)).sort((a,b) => a.date.getTime() - b.date.getTime());
    
    return eventsForDay.reduce((acc, event) => {
        (acc[event.category] = acc[event.category] || []).push(event);
        return acc;
    }, {} as Record<EventCategory, CalendarEvent[]>);

  }, [events, selectedDate]);
  
  const totalEventsForDay = useMemo(() => {
    if (!selectedDate) return 0;
    return events.filter(event => isSameDay(event.date, selectedDate)).length;
  }, [events, selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    form.setValue('date', date || new Date());
  };
  
  const handleOpenNewEventDialog = () => {
    form.reset({
      title: "",
      description: "",
      date: selectedDate,
      category: "Other",
    });
    setIsModalOpen(true);
  }

  const handleFormSubmit = form.handleSubmit((data) => {
    addEvent({
      title: data.title,
      description: data.description,
      date: data.date,
      category: data.category as EventCategory,
    });
    toast({ title: "Event Added", description: `${data.title} has been added to your calendar.` });
    setIsModalOpen(false);
  });

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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                Events for {selectedDate ? format(selectedDate, 'PPP') : 'N/A'}
              </CardTitle>
              <CardDescription>
                {totalEventsForDay} event(s) scheduled.
              </CardDescription>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenNewEventDialog}>
                  <Plus className="mr-2" /> Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>
                    Add a new event to your calendar for {selectedDate ? format(selectedDate, 'PPP') : ''}.
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
                        <DialogFooter>
                            <Button type="submit">Save Event</Button>
                        </DialogFooter>
                    </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {totalEventsForDay > 0 ? (
            <div className="space-y-4">
              {EVENT_CATEGORIES.map(category => {
                const eventsInCategory = groupedEvents[category as EventCategory];
                if (!eventsInCategory) return null;
                return (
                  <div key={category}>
                    <h3 className="font-semibold text-lg mb-2">{category}</h3>
                    <ul className="space-y-3">
                      {eventsInCategory.map(event => (
                         <li key={event.id} className="p-3 rounded-lg border bg-muted/50 flex justify-between items-start">
                          <div>
                            <Badge className={categoryColors[event.category]}>{event.category}</Badge>
                            <p className="font-semibold mt-1">{event.title}</p>
                            {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                          </div>
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
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <CalendarIcon className="mx-auto h-12 w-12 mb-4" />
              <p>No events scheduled for this day.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
