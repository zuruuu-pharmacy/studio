import type { Metadata } from 'next';
import './globals.css';
import { ModeProvider } from '@/contexts/mode-context';
import { Toaster } from '@/components/ui/toaster';
import { PatientProvider } from '@/contexts/patient-context';
import { LectureNotesProvider } from '@/contexts/lecture-notes-context';
import { OsceSessionsProvider } from '@/contexts/osce-sessions-context';
import { DiscussionForumProvider } from '@/contexts/discussion-forum-context';
import { PollsProvider } from '@/contexts/polls-context';
import { PathologyProvider } from '@/contexts/pathology-context';

// ✅ Recommended way to load Google Fonts in Next.js App Router
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
});

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
      <body className={ptSans.className} suppressHydrationWarning>
        <ModeProvider>
          <PatientProvider>
            <LectureNotesProvider>
              <OsceSessionsProvider>
                <DiscussionForumProvider>
                  <PollsProvider>
                    <PathologyProvider>
                      {children}
                    </PathologyProvider>
                    <Toaster />
                  </PollsProvider>
                </DiscussionForumProvider>
              </OsceSessionsProvider>
            </LectureNotesProvider>
          </PatientProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
