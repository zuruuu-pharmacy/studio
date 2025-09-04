
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, GraduationCap, School, BookOpen, BarChart, Settings, UserCheck } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const adminTasks = [
    {
        title: "Verify Job Postings",
        description: "Review and approve new job and internship opportunities submitted by employers.",
        icon: Briefcase,
        link: "/career-guidance/jobs-internships",
    },
    {
        title: "Update Certifications & Licensing",
        description: "Keep the library of professional certifications and international exam requirements up-to-date.",
        icon: GraduationCap,
        link: "/career-guidance/certifications-library",
    },
    {
        title: "Manage Mentor & Alumni Network",
        description: "Invite and approve new mentors and upload alumni success stories.",
        icon: Users,
        link: "/career-guidance/mentors-alumni",
    },
    {
        title: "Push Campus-wide Surveys",
        description: "Create and distribute surveys or polls to the student body via the Student Polls module.",
        icon: BarChart,
        link: "/student-polls",
    },
     {
        title: "Upload Lecture Notes & Resources",
        description: "Add new materials to the Lecture Notes Library for students to access.",
        icon: BookOpen,
        link: "/lecture-notes",
    },
     {
        title: "Engagement Analytics",
        description: "View dashboards on how students are engaging with different career paths and resources.",
        icon: BarChart,
        link: "/career-guidance/analytics-dashboard",
    },
];

const mockUsers = [
    { id: '1', name: 'Ali Ahmed', role: 'Student', status: 'Active' },
    { id: '2', name: 'Fatima Khan', role: 'Student', status: 'Active' },
    { id: '3', name: 'Dr. Usman Khalid', role: 'Faculty', status: 'Active' },
    { id: '4', name: 'Hina Iqbal', role: 'Moderator', status: 'Active' },
];

export function AdminPanelClient() {
  const [users, setUsers] = useState(mockUsers);
  const [policies, setPolicies] = useState({
      requireJobApproval: true,
      requireStoryApproval: false,
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast({ title: "Role Updated", description: `User role has been changed to ${newRole}.` });
  }

  const handlePolicyChange = (policyName: keyof typeof policies, value: boolean) => {
    setPolicies(prev => ({ ...prev, [policyName]: value }));
    toast({ title: "Policy Updated", description: "Content review policy has been changed." });
  }

  return (
    <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
            {adminTasks.map((task) => (
                 <Card key={task.title}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><task.icon />{task.title}</CardTitle>
                        <CardDescription>{task.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href={task.link}>
                            <Button variant="secondary">Go to Module</Button>
                        </Link>
                    </CardContent>
                 </Card>
            ))}
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings />Content Governance</CardTitle>
                <CardDescription>Assign moderator roles and set content review policies for the platform.</CardDescription>
            </CardHeader>
             <CardContent className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><UserCheck />User Roles</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Current Role</TableHead>
                                <TableHead>Set Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {users.map(user => (
                             <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell><Badge variant={user.role === 'Moderator' ? 'default' : 'secondary'}>{user.role}</Badge></TableCell>
                                <TableCell>
                                    <Select value={user.role} onValueChange={(newRole) => handleRoleChange(user.id, newRole)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Student">Student</SelectItem>
                                            <SelectItem value="Faculty">Faculty</SelectItem>
                                            <SelectItem value="Moderator">Moderator</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                           ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold mb-4">Review Policies</h3>
                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <Label htmlFor="job-approval" className="flex flex-col space-y-1">
                            <span>Job Postings</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Require admin approval for all new employer job postings.
                            </span>
                        </Label>
                        <Switch id="job-approval" checked={policies.requireJobApproval} onCheckedChange={(val) => handlePolicyChange('requireJobApproval', val)}/>
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <Label htmlFor="story-approval" className="flex flex-col space-y-1">
                            <span>Alumni Stories</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Require admin approval for all new alumni success stories.
                            </span>
                        </Label>
                        <Switch id="story-approval" checked={policies.requireStoryApproval} onCheckedChange={(val) => handlePolicyChange('requireStoryApproval', val)}/>
                    </div>
                </div>
             </CardContent>
        </Card>
    </div>
  );
}
