// 2026 roofing and tree service general liability price data (Kevin 11/27).
// Source: Cohesive Insurance CRM, read 2026-11-27. Quotes issued Oct 20 to Nov 26, 2026, all $1M per
// occurrence / $2M aggregate, cheapest quote per business and policy form, primary class roofing or tree work.
// Binds: policies bound Oct 20 to Nov 25, 2026 on the same program and limits. Generated from the CRM pull;
// edit only by re-running the pull, never by hand.

export const PRICE_DATA_UPDATED = "2026-11-27";
export const PRICE_DATA_WINDOW = { start: "2026-10-20", end: "2026-11-26" };

export type Form = "occurrence" | "claims-made";
export type BandRow = { band: string; occN: number; occMedian: number | null; occLow: number | null; cmN: number; cmMedian: number | null; cmLow: number | null };
export type StateRow = { abbr: string; name: string; businesses: number; occLow: number | null; cmLow: number | null };
export type BindRow = { trade: "roof" | "tree"; state: string; boundDate: string; form: Form; premium: number };

export const PRICE_SUMMARY = {"roof": {"businesses": 286, "quotes": {"occurrence": 281, "claims-made": 276}}, "tree": {"businesses": 266, "quotes": {"occurrence": 188, "claims-made": 265}}} as const;

export const PRICE_BANDS: Record<"roof" | "tree", BandRow[]> = {
 "roof": [
  {
   "band": "Under $250K",
   "occN": 68,
   "occMedian": 1795.09,
   "occLow": 1795.09,
   "cmN": 69,
   "cmMedian": 1359.42,
   "cmLow": 1359.42
  },
  {
   "band": "$250K to $500K",
   "occN": 171,
   "occMedian": 1895.09,
   "occLow": 1795.09,
   "cmN": 168,
   "cmMedian": 1446.99,
   "cmLow": 1359.42
  },
  {
   "band": "$500K to $1M",
   "occN": 14,
   "occMedian": 3568.08,
   "occLow": 2993.15,
   "cmN": 14,
   "cmMedian": 2443.2,
   "cmLow": 2118.25
  },
  {
   "band": "$1M to $2M",
   "occN": 14,
   "occMedian": 8699.39,
   "occLow": 7183.46,
   "cmN": 11,
   "cmMedian": 5392.35,
   "cmLow": 4632.44
  },
  {
   "band": "Over $2M",
   "occN": 11,
   "occMedian": 22886.49,
   "occLow": 13881.19,
   "cmN": 11,
   "cmMedian": 14014.26,
   "cmLow": 8651.09
  }
 ],
 "tree": [
  {
   "band": "Under $250K",
   "occN": 163,
   "occMedian": 1706.85,
   "occLow": 1706.85,
   "cmN": 226,
   "cmMedian": 1271.18,
   "cmLow": 1271.18
  },
  {
   "band": "$250K to $500K",
   "occN": 15,
   "occMedian": 1806.85,
   "occLow": 1706.85,
   "cmN": 25,
   "cmMedian": 1371.18,
   "cmLow": 1271.18
  },
  {
   "band": "$500K to $1M",
   "occN": 6,
   "occMedian": 7178.15,
   "occLow": 5380.33,
   "cmN": 8,
   "cmMedian": 3885.14,
   "cmLow": 3510.56
  },
  {
   "band": "Over $1M",
   "occN": 1,
   "occMedian": 11504.57,
   "occLow": 11504.57,
   "cmN": 3,
   "cmMedian": 10760.0,
   "cmLow": 7185.1
  }
 ]
};

export const PRICE_STATES: Record<"roof" | "tree", StateRow[]> = {
 "roof": [
  {
   "abbr": "TX",
   "name": "Texas",
   "businesses": 66,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "FL",
   "name": "Florida",
   "businesses": 40,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "GA",
   "name": "Georgia",
   "businesses": 19,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "CO",
   "name": "Colorado",
   "businesses": 14,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "OH",
   "name": "Ohio",
   "businesses": 13,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "IL",
   "name": "Illinois",
   "businesses": 11,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "MA",
   "name": "Massachusetts",
   "businesses": 9,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "MO",
   "name": "Missouri",
   "businesses": 9,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "NJ",
   "name": "New Jersey",
   "businesses": 8,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "NC",
   "name": "North Carolina",
   "businesses": 8,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "TN",
   "name": "Tennessee",
   "businesses": 8,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "VA",
   "name": "Virginia",
   "businesses": 7,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "WI",
   "name": "Wisconsin",
   "businesses": 7,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "AZ",
   "name": "Arizona",
   "businesses": 6,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "IN",
   "name": "Indiana",
   "businesses": 6,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "NY",
   "name": "New York",
   "businesses": 6,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "PA",
   "name": "Pennsylvania",
   "businesses": 6,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "AL",
   "name": "Alabama",
   "businesses": 5,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "MN",
   "name": "Minnesota",
   "businesses": 5,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "SC",
   "name": "South Carolina",
   "businesses": 5,
   "occLow": 1795.09,
   "cmLow": 1359.42
  },
  {
   "abbr": "UT",
   "name": "Utah",
   "businesses": 5,
   "occLow": 1895.09,
   "cmLow": 1446.99
  }
 ],
 "tree": [
  {
   "abbr": "NC",
   "name": "North Carolina",
   "businesses": 20,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "TX",
   "name": "Texas",
   "businesses": 20,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "GA",
   "name": "Georgia",
   "businesses": 19,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "MO",
   "name": "Missouri",
   "businesses": 16,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "PA",
   "name": "Pennsylvania",
   "businesses": 15,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "IN",
   "name": "Indiana",
   "businesses": 14,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "VA",
   "name": "Virginia",
   "businesses": 13,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "TN",
   "name": "Tennessee",
   "businesses": 12,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "OH",
   "name": "Ohio",
   "businesses": 11,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "AL",
   "name": "Alabama",
   "businesses": 10,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "MN",
   "name": "Minnesota",
   "businesses": 10,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "OR",
   "name": "Oregon",
   "businesses": 10,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "IL",
   "name": "Illinois",
   "businesses": 9,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "SC",
   "name": "South Carolina",
   "businesses": 9,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "AZ",
   "name": "Arizona",
   "businesses": 8,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "FL",
   "name": "Florida",
   "businesses": 7,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "KY",
   "name": "Kentucky",
   "businesses": 7,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "CO",
   "name": "Colorado",
   "businesses": 6,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "WI",
   "name": "Wisconsin",
   "businesses": 6,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "MS",
   "name": "Mississippi",
   "businesses": 5,
   "occLow": 1706.85,
   "cmLow": 1271.18
  },
  {
   "abbr": "NJ",
   "name": "New Jersey",
   "businesses": 5,
   "occLow": 1706.85,
   "cmLow": 1271.18
  }
 ]
};

export const PRICE_BINDS: BindRow[] = [
 {
  "trade": "roof",
  "state": "FL",
  "boundDate": "2026-10-21",
  "form": "occurrence",
  "premium": 2154.16
 },
 {
  "trade": "roof",
  "state": "CO",
  "boundDate": "2026-10-25",
  "form": "claims-made",
  "premium": 1253.42
 },
 {
  "trade": "roof",
  "state": "TX",
  "boundDate": "2026-10-27",
  "form": "occurrence",
  "premium": 1795.09
 },
 {
  "trade": "roof",
  "state": "NJ",
  "boundDate": "2026-10-27",
  "form": "claims-made",
  "premium": 1394.06
 },
 {
  "trade": "roof",
  "state": "FL",
  "boundDate": "2026-10-29",
  "form": "occurrence",
  "premium": 1795.09
 },
 {
  "trade": "roof",
  "state": "FL",
  "boundDate": "2026-10-30",
  "form": "occurrence",
  "premium": 1795.09
 },
 {
  "trade": "roof",
  "state": "NC",
  "boundDate": "2026-11-09",
  "form": "occurrence",
  "premium": 1718.49
 },
 {
  "trade": "roof",
  "state": "FL",
  "boundDate": "2026-11-09",
  "form": "occurrence",
  "premium": 2101.16
 },
 {
  "trade": "roof",
  "state": "TX",
  "boundDate": "2026-11-10",
  "form": "occurrence",
  "premium": 1713.4
 },
 {
  "trade": "roof",
  "state": "TX",
  "boundDate": "2026-11-10",
  "form": "occurrence",
  "premium": 1795.09
 },
 {
  "trade": "roof",
  "state": "UT",
  "boundDate": "2026-11-17",
  "form": "occurrence",
  "premium": 1917.52
 },
 {
  "trade": "roof",
  "state": "TX",
  "boundDate": "2026-11-20",
  "form": "occurrence",
  "premium": 1845.09
 },
 {
  "trade": "roof",
  "state": "TX",
  "boundDate": "2026-11-21",
  "form": "occurrence",
  "premium": 1795.09
 },
 {
  "trade": "roof",
  "state": "TX",
  "boundDate": "2026-11-23",
  "form": "occurrence",
  "premium": 1895.09
 },
 {
  "trade": "roof",
  "state": "IL",
  "boundDate": "2026-11-23",
  "form": "occurrence",
  "premium": 1795.09
 },
 {
  "trade": "roof",
  "state": "MO",
  "boundDate": "2026-11-24",
  "form": "claims-made",
  "premium": 1359.42
 },
 {
  "trade": "roof",
  "state": "WI",
  "boundDate": "2026-11-25",
  "form": "occurrence",
  "premium": 1763.4
 },
 {
  "trade": "tree",
  "state": "TX",
  "boundDate": "2026-10-29",
  "form": "claims-made",
  "premium": 1271.18
 },
 {
  "trade": "tree",
  "state": "AZ",
  "boundDate": "2026-10-30",
  "form": "claims-made",
  "premium": 1222.18
 },
 {
  "trade": "tree",
  "state": "OR",
  "boundDate": "2026-11-03",
  "form": "claims-made",
  "premium": 1271.18
 },
 {
  "trade": "tree",
  "state": "NC",
  "boundDate": "2026-11-05",
  "form": "claims-made",
  "premium": 1222.18
 },
 {
  "trade": "tree",
  "state": "AL",
  "boundDate": "2026-11-06",
  "form": "occurrence",
  "premium": 1706.85
 },
 {
  "trade": "tree",
  "state": "FL",
  "boundDate": "2026-11-09",
  "form": "claims-made",
  "premium": 1271.18
 },
 {
  "trade": "tree",
  "state": "OR",
  "boundDate": "2026-11-14",
  "form": "claims-made",
  "premium": 1271.18
 },
 {
  "trade": "tree",
  "state": "NC",
  "boundDate": "2026-11-14",
  "form": "claims-made",
  "premium": 1271.18
 },
 {
  "trade": "tree",
  "state": "CO",
  "boundDate": "2026-11-16",
  "form": "claims-made",
  "premium": 1271.18
 },
 {
  "trade": "tree",
  "state": "SC",
  "boundDate": "2026-11-17",
  "form": "claims-made",
  "premium": 1271.18
 },
 {
  "trade": "tree",
  "state": "GA",
  "boundDate": "2026-11-19",
  "form": "claims-made",
  "premium": 1371.18
 },
 {
  "trade": "tree",
  "state": "VA",
  "boundDate": "2026-11-19",
  "form": "claims-made",
  "premium": 1359.42
 },
 {
  "trade": "tree",
  "state": "IN",
  "boundDate": "2026-11-20",
  "form": "claims-made",
  "premium": 1321.18
 },
 {
  "trade": "tree",
  "state": "ID",
  "boundDate": "2026-11-25",
  "form": "claims-made",
  "premium": 1396.49
 },
 {
  "trade": "tree",
  "state": "FL",
  "boundDate": "2026-11-25",
  "form": "claims-made",
  "premium": 1311.18
 }
];

// Most common quote on each side of the Nov 16, 2026 price step (count of businesses in parentheses in the CRM pull).
export const COMMON_QUOTES = {
  roof: { before: { occurrence: 1795.09, claimsMade: 1359.42 }, since: { occurrence: 1895.09, claimsMade: 1459.42 } },
  tree: { before: { occurrence: 1706.85, claimsMade: 1271.18 }, since: { occurrence: 1806.85, claimsMade: 1371.18 } },
} as const;

// Two larger roofing accounts already shown anonymized on /insurance/roofer (TRADE_PRICE_EXTRAS), both $1M/$2M occurrence.
export const LARGE_ROOF_BINDS = [
  { revenue: "$1.3M", boundDate: "2026-11-24", premium: 5273, detail: "Residential roofer, about $125K subcontracted" },
  { revenue: "About $4M", boundDate: "2026-11-13", premium: 20241, detail: "About $1.2M subcontracted" },
] as const;
