"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Waves } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for the email, a reset link has been sent.",
    });
    router.push('/login');
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
       <div className="relative hidden md:block">
        <Image
          src="https://picsum.photos/1200/1800"
          alt="Abstract decorative image"
          fill
          className="object-cover"
          data-ai-hint="abstract gradient"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/50" />
        <div className="absolute top-8 left-8 flex items-center gap-2">
           <Waves className="h-12 w-12 text-primary-foreground" />
           <h1 className="text-4xl font-bold font-headline text-primary-foreground">Zuruu AI</h1>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md shadow-none border-none">
          <CardHeader className="text-left space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">Forgot Your Password?</CardTitle>
            <CardDescription>No worries. Enter your email address and we'll send you a link to reset it.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetRequest} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="pharmacist@example.com" required className="py-6"/>
              </div>
              <Button type="submit" className="w-full py-6 text-lg">
                Send Reset Link
              </Button>
            </form>
          </CardContent>
          <div className="mt-4 text-center text-sm">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
