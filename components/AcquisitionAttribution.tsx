"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

/** Capture before a visitor follows links from a page without a quote form. No network. */
export default function AcquisitionAttribution() {
  const pathname = usePathname();
  useEffect(() => { captureAttribution(); }, [pathname]);
  return null;
}
