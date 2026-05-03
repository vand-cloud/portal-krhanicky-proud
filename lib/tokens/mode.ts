// Mode — light/dark switcher (sets data-theme attribute)
"use client";

import { useEffect } from "react";
import type { Concept } from "./concept";

export function useThemeMode(mode: Concept["mode"]) {
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);
}
