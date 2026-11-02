"use client";
import { useEffect } from "react";

// Sets <html lang="es"> while a Spanish page is mounted and restores the previous value on client navigation away.
export default function SpanishDocumentLang() {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.lang;
    root.lang = "es";
    return () => {
      root.lang = previous || "en";
    };
  }, []);
  return null;
}
