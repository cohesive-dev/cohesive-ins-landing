"use client";
import {useEffect,useRef,useState} from "react";
const GMAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const inputClasses =
  "w-full rounded-lg border border-[#D8DEF5] bg-white px-4 py-3 text-base text-[#131517] outline-none transition focus:border-[#2040E7] focus:ring-2 focus:ring-[#2040E7]/20";

// ---- Google Places address autocomplete -----------------------------------

type GPrediction = { description: string; place_id: string };
type GPlaceResult = { formatted_address?: string };
type GAutocompleteService = {
  getPlacePredictions: (
    req: Record<string, unknown>,
    cb: (preds: GPrediction[] | null, status: string) => void,
  ) => void;
};
type GPlacesService = {
  getDetails: (
    req: Record<string, unknown>,
    cb: (place: GPlaceResult | null, status: string) => void,
  ) => void;
};
type GMaps = {
  maps: {
    places: {
      AutocompleteService: new () => GAutocompleteService;
      PlacesService: new (attrContainer: HTMLElement) => GPlacesService;
      AutocompleteSessionToken: new () => object;
    };
  };
};
const getGoogle = () => (window as unknown as { google?: GMaps }).google;

function loadGoogleMaps(key: string): Promise<void> {
  const w = window as unknown as {
    google?: GMaps;
    __gmapsPromise?: Promise<void>;
  };
  if (w.google?.maps?.places) return Promise.resolve();
  if (w.__gmapsPromise) return w.__gmapsPromise;
  w.__gmapsPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key,
    )}&libraries=places&loading=async`;
    s.async = true;
    // With loading=async, onload fires before google.maps.places is populated,
    // so poll for it before resolving — otherwise consumers init too early.
    s.onload = () => {
      const ready = () => {
        if ((window as unknown as { google?: GMaps }).google?.maps?.places) {
          resolve();
        } else {
          setTimeout(ready, 50);
        }
      };
      ready();
    };
    s.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(s);
  });
  return w.__gmapsPromise;
}

// A styled address input backed by Google Places. Drives a custom suggestions
// dropdown off AutocompleteService (the classic Autocomplete widget doesn't
// bind cleanly to a React-controlled input) + a session token so a whole
// type-then-select counts as one billed session. Dark-safe: with no key it's
// just a plain input.
export default function AddressAutocomplete({
  value,
  onChange,
  placeholder,
  ariaLabel,
  id,
  required = false,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  required?: boolean;
}) {
  const [suggestions, setSuggestions] = useState<GPrediction[]>([]);
  const [open, setOpen] = useState(false);
  const svc = useRef<GAutocompleteService | null>(null);
  const places = useRef<GPlacesService | null>(null);
  const token = useRef<object | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Mirrors the live input so an async Place Details reply can tell whether the
  // user has moved on since it was requested.
  const latestValue = useRef(value);
  latestValue.current = value;

  useEffect(() => {
    if (!GMAPS_KEY) return;
    loadGoogleMaps(GMAPS_KEY)
      .then(() => {
        const g = getGoogle();
        if (!g?.maps?.places) return;
        svc.current = new g.maps.places.AutocompleteService();
        places.current = new g.maps.places.PlacesService(
          document.createElement("div"),
        );
        token.current = new g.maps.places.AutocompleteSessionToken();
      })
      .catch(() => {});
  }, []);

  const query = (input: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (!svc.current || input.trim().length < 4) {
      setSuggestions([]);
      return;
    }
    timer.current = setTimeout(() => {
      svc.current?.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "us" },
          types: ["address"],
          sessionToken: token.current,
        },
        (preds, status) => {
          if (status === "OK" && preds) {
            setSuggestions(preds.slice(0, 5));
            setOpen(true);
          } else {
            setSuggestions([]);
          }
        },
      );
    }, 300);
  };

  // On select, show the prediction immediately, then upgrade to the full
  // formatted address (with ZIP) via Place Details. Rotate the session token.
  const choose = (p: GPrediction) => {
    setSuggestions([]);
    setOpen(false);
    onChange(p.description);
    // Place Details is async. If the user keeps typing (or picks another
    // prediction) before it returns, applying the result would silently
    // overwrite their newer text with a stale address. Only upgrade if the
    // field still holds exactly what this call was made for.
    const expected = p.description;
    places.current?.getDetails(
      {
        placeId: p.place_id,
        fields: ["formatted_address"],
        sessionToken: token.current,
      },
      (place, status) => {
        if (
          status === "OK" &&
          place?.formatted_address &&
          latestValue.current === expected
        ) {
          onChange(place.formatted_address);
        }
        const g = getGoogle();
        if (g?.maps?.places) {
          token.current = new g.maps.places.AutocompleteSessionToken();
        }
      },
    );
  };

  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        name={id}
        required={required}
        maxLength={id ? 200 : undefined}
        value={value ?? ""}
        onChange={(e) => {
          onChange(e.target.value);
          query(e.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        className={inputClasses}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[#D8DEF5] bg-white shadow-lg">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(s);
                }}
                className="block w-full px-4 py-3 text-left text-[15px] text-[#131517] hover:bg-[#EEF1FF]"
              >
                {s.description}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

