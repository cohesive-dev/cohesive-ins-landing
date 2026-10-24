"use client";
import { useMemo, useSyncExternalStore } from "react";

// The current URL query, without next/navigation's useSearchParams. On a statically rendered page useSearchParams
// forces the nearest Suspense boundary to render on the client only; this hook server-renders with an empty query
// and hydrates to window.location.search. The query does not change while a page is open, so there is nothing to
// subscribe to.
const subscribe = () => () => {};
const clientSearch = () => window.location.search;
const serverSearch = () => "";

export function useLocationSearch(): URLSearchParams {
  const search = useSyncExternalStore(subscribe, clientSearch, serverSearch);
  return useMemo(() => new URLSearchParams(search), [search]);
}
