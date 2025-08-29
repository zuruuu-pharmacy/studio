
"use client";

import { useMode } from "@/contexts/mode-context";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Users, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";

export function ModeToggle() {
  const { mode } = useMode();
  const router = useRouter();

  const handleModeChange = () => {
    // Instead of toggling, we navigate to the root to re-trigger role selection.
    router.push('/');
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="mode-toggle" className="flex items-center gap-2 cursor-pointer">
        <Users className="h-5 w-5" />
        <span>Patient</span>
      </Label>
      <Switch
        id="mode-toggle"
        checked={mode === "pharmacist"}
        onCheckedChange={handleModeChange}
        aria-label="Toggle between patient and pharmacist mode"
      />
      <Label htmlFor="mode-toggle" className="flex items-center gap-2 cursor-pointer">
        <Stethoscope className="h-5 w-5" />
        <span>Pharmacist</span>
      </Label>
    </div>
  );
}
