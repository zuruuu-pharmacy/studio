import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Welcome to Zuruu AI Pharmacy</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    You need to be logged in to access the dashboard.
                </p>
                <div className="mt-8">
                    <Link href="/login" passHref legacyBehavior>
                        <a className="rounded-md bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90">
                            Go to Login
                        </a>
                    </Link>
                </div>
            </div>
        </main>
    );
}
