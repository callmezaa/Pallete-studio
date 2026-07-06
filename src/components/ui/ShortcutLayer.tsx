"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { CommandPalette } from "./CommandPalette";

export function ShortcutLayer() {
  const { commandOpen, setCommandOpen } = useKeyboardShortcuts();
  return <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />;
}
