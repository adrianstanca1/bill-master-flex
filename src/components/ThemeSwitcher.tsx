import React, { useState } from "react";
import { applyUserTheme, loadTheme, saveTheme, type ThemePreset } from "@/lib/theme";

const presets: { key: ThemePreset; name: string }[] = [
  { key: "emerald", name: "Emerald" },
  { key: "blue", name: "Blue" },
  { key: "violet", name: "Violet" },
];

export default function ThemeSwitcher() {
  const [preset, setPreset] = useState<ThemePreset>(loadTheme().preset);

  function change(p: ThemePreset) {
    setPreset(p);
    const next = { ...loadTheme(), preset: p };
    saveTheme(next);
    applyUserTheme(next);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {presets.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => change(p.key)}
          className={`button-secondary ${preset === p.key ? "ring-2 ring-primary" : ""}`}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
