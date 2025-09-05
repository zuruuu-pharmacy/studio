
import { BackButton } from "@/components/back-button";
import { OfflineModeClient } from "./offline-mode-client";

export default function OfflineModePage() {
  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-bold mb-2 font-headline">Offline Mode & Data</h1>
      <p className="text-muted-foreground mb-6">
        Download key materials for offline study and manage your cached data.
      </p>
      <OfflineModeClient />
    </div>
  );
}
