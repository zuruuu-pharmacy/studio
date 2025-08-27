"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Waves } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<null | 'google' | 'apple'>(null);


  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
        document.cookie = "session=true; path=/; max-age=3600";
        router.push('/');
        router.refresh();
        setIsLoading(false);
    }, 1000);
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    setIsSocialLoading(provider);
    // Simulate network request
    setTimeout(() => {
        document.cookie = "session=true; path=/; max-age=3600";
        router.push('/');
        router.refresh();
        setIsSocialLoading(null);
    }, 1000);
  }

  const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" {...props}>
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.485 12.5C34.643 8.995 29.622 7 24 7c-9.4 0-17 7.6-17 17s7.6 17 17 17s17-7.6 17-17c0-1.606-.282-3.155-.79-4.667z" />
      <path fill="#FF3D00" d="M6.306 14.691c-1.424 2.852-2.306 6.06-2.306 9.479s.882 6.627 2.306 9.479l-5.633 4.439C.882 34.32 0 29.832 0 25.16s.882-9.16 2.673-12.908l5.633 4.439z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-4.82c-1.873 1.25-4.282 1.95-6.95 1.95c-5.216 0-9.617-3.486-11.233-8.234l-6.14 4.832C9.53 39.52 16.22 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-1.496 0-2.91-.256-4.22-.718l-6.22 4.82C18.067 43.14 22.89 44 24 44c9.4 0 17-7.6 17-17c0-1.606-.282-3.155-.79-4.667z" />
    </svg>
  );

  const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" {...props}>
          <path fill="currentColor" d="M19.16,14.33a4,4,0,0,1-1.33,3.35,4.3,4.3,0,0,1-3.39,1.33,3.74,3.74,0,0,1-2.43-1,4,4,0,0,1-1.4-2.62H15.4a2.26,2.26,0,0,0,2-2.18,2.18,2.18,0,0,0-2.22-2.26,4.2,4.2,0,0,0-4,4.21,4.22,4.22,0,0,0,4.23,4.21,4.3,4.3,0,0,0,2.83-.95,1.4,1.4,0,0,0,.11,2,6.15,6.15,0,0,0,3.32,1.31,6.33,6.33,0,0,0,4.14-1.48A5.36,5.36,0,0,0,22,15.7a4.2,4.2,0,0,1-2.84-1.37M14.8,4.64A4.18,4.18,0,0,1,16.27,2a4.45,4.45,0,0,1,1.75.33,4.24,4.24,0,0,1,2.39,3.29,4.2,4.2,0,0,1-1.64,3.42,4.21,4.21,0,0,1-4.47-1.78" />
      </svg>
  );
  
  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
       <div className="relative hidden md:block">
        <Image
          src="https://picsum.photos/1200/1800"
          alt="Abstract decorative image"
          fill
          className="object-cover"
          data-ai-hint="abstract texture"
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
            <CardTitle className="text-3xl font-bold tracking-tight">Create an Account</CardTitle>
            <CardDescription>Join our platform to access your pharmacy suite.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
               <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="w-full py-6 text-base" type="button" onClick={() => handleSocialLogin('google')} disabled={isSocialLoading !== null}>
                      {isSocialLoading === 'google' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon className="h-5 w-5 mr-2" />}
                      Sign up with Google
                  </Button>
                  <Button variant="outline" className="w-full py-6 text-base" type="button" onClick={() => handleSocialLogin('apple')} disabled={isSocialLoading !== null}>
                      {isSocialLoading === 'apple' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <AppleIcon className="h-5 w-5 mr-2" />}
                     Sign up with Apple
                  </Button>
               </div>
               <div className="flex items-center">
                    <div className="flex-grow border-t border-muted" />
                    <span className="mx-4 text-xs uppercase text-muted-foreground">Or</span>
                    <div className="flex-grow border-t border-muted" />
               </div>
               
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" type="text" placeholder="John Doe" required className="py-6"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="pharmacist@example.com" required className="py-6"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required className="py-6" />
              </div>
              <Button type="submit" className="w-full py-6 text-lg" disabled={isLoading || isSocialLoading !== null}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
