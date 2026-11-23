"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { redditPageVisit } from "@/lib/reddit-pixel";

/** Reddit PageVisit on the first view and on every client-side route change. */
export default function RedditPageVisit() {
  const pathname = usePathname();
  useEffect(() => { redditPageVisit(); }, [pathname]);
  return null;
}
