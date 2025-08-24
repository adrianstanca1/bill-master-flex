import React, { useState } from "react";
import { applyUserTheme, loadTheme, saveTheme, type ThemePreset, type ThemeSettings } from "@/lib/theme";

const presets: { key: ThemePreset; name: string; color: string }[] = [
  { key: "emerald", name: "Emerald", color: "hsl(160, 51%, 58%)" },
  { key: "blue", name: "Blue", color: "hsl(210, 100%, 60%)" },
  { key: "violet", name: "Violet", color: "hsl(270, 90%, 65%)" },
];

export default function ThemeSwitcher() {
  // Cache the full theme locally to avoid repeated storage reads
  const [theme, setTheme] = useState<ThemeSettings>(() => loadTheme());

  function change(p: ThemePreset) {
    const next = { ...theme, preset: p };
    setTheme(next);
    saveTheme(next);
    applyUserTheme(next);
  }

  return (
    <div className="flex gap-3 flex-wrap">
      {presets.map((p) => (
        <button
          key={p.key}
          type="button"
          aria-label={p.name}
          onClick={() => change(p.key)}
          className={`w-8 h-8 rounded-full border-2 border-transparent transition-all ${
            theme.preset === p.key ? "ring-2 ring-offset-2 ring-primary" : ""
          }`}
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
