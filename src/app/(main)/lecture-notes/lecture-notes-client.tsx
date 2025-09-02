
"use client";

import { useTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, BookOpen, KeyRound, Folder, File, Download, Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useLectureNotes } from "@/contexts/lecture-notes-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const TEACHER_CODE = "239774";

const formSchema = z.object({
  topicName: z.string().min(3, "Please provide a topic name."),
  folder: z.string().min(1, "Please select a folder."),
  noteFile: z.any().refine(file => file?.length === 1, "A file is required."),
});
type FormValues = z.infer<typeof formSchema>;

const FOLDERS = [
    "Pharmacology",
    "Pharmaceutics",
    "Pharmacognosy",
    "Pathology",
    "Pharmaceutical Chemistry",
    "Computer",
    "Tests"
];

export function LectureNotesClient() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { notes, addNote, deleteNote } = useLectureNotes();
  
  const [showUpload, setShowUpload] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicName: "",
      folder: "",
      noteFile: undefined,
    }
  });
  
  const handleAccessCodeCheck = () => {
    if (accessCode === TEACHER_CODE) {
      setShowUpload(true);
      setIsModalOpen(false);
      toast({ title: "Access Granted", description: "You can now upload and manage notes." });
    } else {
      toast({ variant: "destructive", title: "Incorrect Code" });
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > MAX_FILE_SIZE) {
      toast({ variant: "destructive", title: "Error", description: "File size exceeds 10MB limit." });
      form.setValue('noteFile', undefined);
    }
  };

  const handleFormSubmit = form.handleSubmit(async (data: FormValues) => {
    const file = data.noteFile[0];
    if (!file) {
      toast({ variant: "destructive", title: "Error", description: "File is missing." });
      return;
    }
    
    startTransition(async () => {
        try {
            const fileDataUri = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            addNote({
                topicName: data.topicName,
                folder: data.folder,
                fileName: file.name,
                fileDataUri: fileDataUri,
            });

            toast({title: "Upload Successful", description: `${file.name} has been added to the library.`});
            form.reset();

        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Upload Failed", description: "There was an error processing your file." });
        }
    });
  });

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    toast({ title: "Note Deleted", description: "The selected note has been removed." });
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-end">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button><KeyRound className="mr-2"/> Teacher Access</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Teacher Access Required</DialogTitle>
                        <DialogDescription>Please enter the access code to upload or delete study materials.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="access-code">Access Code</Label>
                        <Input 
                            id="access-code"
                            type="password"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAccessCodeCheck()}
                        />
                    </div>
                    <DialogFooter><Button onClick={handleAccessCodeCheck}><KeyRound className="mr-2"/>Verify Code</Button></DialogFooter>
                </DialogContent>
             </Dialog>
        </div>

      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Note</CardTitle>
            <CardDescription>Select a folder and provide the topic name and file.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <FormField name="folder" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a folder to upload to..." /></SelectTrigger></FormControl>
                        <SelectContent>
                            {FOLDERS.map(folder => <SelectItem key={folder} value={folder}>{folder}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="topicName" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Note Topic / Title</FormLabel><FormControl><Input placeholder="e.g., Beta-blockers" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="noteFile" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Note File</FormLabel><FormControl>
                    <Input type="file" ref={field.ref} name={field.name} onBlur={field.onBlur} onChange={(e) => { field.onChange(e.target.files); handleFileChange(e); }} />
                  </FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Add Note to Library
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
            <CardTitle>Notes Library</CardTitle>
            <CardDescription>Browse and download notes uploaded by teachers.</CardDescription>
        </CardHeader>
        <CardContent>
            {notes.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-48 text-center p-6 bg-muted/50 rounded-lg">
                    <BookOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground">The Library is Empty</h3>
                    <p className="text-muted-foreground/80 mt-2">Teachers can upload notes to get started.</p>
                </div>
            ) : (
                <Accordion type="multiple" className="w-full space-y-3">
                    {FOLDERS.map(folderName => {
                        const notesInFolder = notes.filter(n => n.folder === folderName);
                        if (notesInFolder.length === 0) return null;

                        return (
                             <AccordionItem value={folderName} key={folderName} className="border rounded-lg bg-background/50">
                                <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                                    <div className="flex items-center gap-2"><Folder className="text-primary"/>{folderName}</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4">
                                   <ul className="space-y-2">
                                        {notesInFolder.map(note => (
                                            <li key={note.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                                                <div className="flex items-center gap-2">
                                                    <File className="h-5 w-5 text-muted-foreground"/>
                                                    <span className="font-medium">{note.topicName}</span>
                                                    <span className="text-xs text-muted-foreground">({note.fileName})</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <a href={note.fileDataUri} download={note.fileName}>
                                                        <Button variant="ghost" size="icon"><Download className="h-5 w-5"/></Button>
                                                    </a>
                                                    {showUpload && (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                                    <Trash2 className="h-5 w-5"/>
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the note titled "{note.topicName}".
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>Delete</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                   </ul>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
