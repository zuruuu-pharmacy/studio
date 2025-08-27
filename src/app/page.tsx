import DashboardPage from './(main)/page';

export default function Home() {
  // This page now renders the main dashboard directly.
  // The middleware handles redirecting unauthenticated users to the login page.
  return <DashboardPage />;
}
