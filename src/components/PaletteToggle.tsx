import { useState } from "react";
import { Button } from "@/components/ui/button";
import { applyUserTheme, loadTheme, saveTheme, ThemePreset } from "@/lib/theme";

const cycleOrder: ThemePreset[] = ["emerald", "blue", "violet"];

export default function PaletteToggle() {
  const [preset, setPreset] = useState<ThemePreset>(loadTheme().preset);

  function cycle() {
    const idx = (cycleOrder.indexOf(preset) + 1) % cycleOrder.length;
    const nextPreset = cycleOrder[idx];
    setPreset(nextPreset);
    const next = { ...loadTheme(), preset: nextPreset };
    saveTheme(next);
    applyUserTheme(next);
  }

  return (
    <Button type="button" variant="outline" onClick={cycle}>
      Change Palette
    </Button>
  );
}
