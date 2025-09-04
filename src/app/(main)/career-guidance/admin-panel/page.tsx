
import { BackButton } from "@/components/back-button";
import { AdminPanelClient } from "./admin-panel-client";

export default function AdminPanelPage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Faculty &amp; Admin Panel</h1>
      <p className="text-muted-foreground mb-6">
        Manage Career Guidance Hub content, verify listings, and view engagement analytics.
      </p>
      <AdminPanelClient />
    </div>
  );
}
