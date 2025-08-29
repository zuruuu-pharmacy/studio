
"use client";

import { useMode } from "@/contexts/mode-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function ModeToggle() {
  const { mode } = useMode();
  const router = useRouter();

  const handleModeChange = () => {
    // Instead of toggling, we navigate to the root to re-trigger role selection.
    router.push('/');
  };

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={handleModeChange} variant="outline" size="sm">
        <LogOut className="mr-2 h-4 w-4" />
         <span>Switch Role ({mode})</span>
      </Button>
    </div>
  );
}
