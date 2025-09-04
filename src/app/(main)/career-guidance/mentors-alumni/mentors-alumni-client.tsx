
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Construction, MessageSquare } from "lucide-react";

const placeholderMentors = [
  { name: 'Dr. Fatima Ahmed', role: 'Clinical Pharmacist, National Hospital', expertise: 'Cardiology, Infectious Disease', img: 'https://picsum.photos/100/100?random=1' },
  { name: 'Mr. Ali Raza', role: 'R&D Scientist, Zuruu Pharma', expertise: 'Formulation, Drug Delivery', img: 'https://picsum.photos/100/100?random=2' },
  { name: 'Ms. Ayesha Khan', role: 'Regulatory Affairs Manager', expertise: 'Drug Registration, Compliance', img: 'https://picsum.photos/100/100?random=3' },
];


export function MentorsAlumniClient() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search the Network</CardTitle>
          <CardDescription>Filter mentors by expertise, company, or role.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search for mentors..." className="pl-10" />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderMentors.map(mentor => (
           <Card key={mentor.name}>
             <CardHeader className="items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={mentor.img} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{mentor.name}</CardTitle>
                <CardDescription>{mentor.role}</CardDescription>
             </CardHeader>
             <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4"><strong>Expertise:</strong> {mentor.expertise}</p>
                <Button disabled><MessageSquare className="mr-2"/>Book Session (Coming Soon)</Button>
             </CardContent>
           </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Alumni Stories</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center h-full bg-muted/50 p-8 rounded-lg">
                 <Construction className="h-16 w-16 text-muted-foreground/30 mb-4" />
                 <h3 className="text-xl font-semibold text-muted-foreground">Feature Under Construction</h3>
                 <p className="text-muted-foreground/80 mt-2">
                    Video interviews and written case studies from our alumni network are coming soon.
                 </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
