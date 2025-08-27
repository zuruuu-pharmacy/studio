import type { Metadata } from 'next';
import './globals.css';
import { ModeProvider } from '@/contexts/mode-context';
import { Toaster } from '@/components/ui/toaster';
import { PatientProvider } from '@/contexts/patient-context';

export const metadata: Metadata = {
  title: 'Zuruu AI Pharmacy',
  description: 'An AI-powered suite of tools for pharmacists and patients.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ModeProvider>
            {children}
            <Toaster />
        </ModeProvider>
      </body>
    </html>
  );
}
