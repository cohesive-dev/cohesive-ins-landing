"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * /rate-check - MOBILE-FIRST policy-upload page (cell 3 of the contractor
 * 3-way capture test). Deliberately minimal: name + phone + email + upload
 * your current policy / dec page. No questions - the dec page carries the
 * carrier, limits, premium, and expiration, which feeds the
 * quote-from-incumbent method directly.
 *
 * Mobile mechanics: the file input accepts images + PDF and offers the
 * camera (capture="environment"), so a phone user just snaps photos of the
 * dec page one-handed. Images are downscaled client-side to stay far below
 * the platform's request-body limit (phone photos are 3-8MB raw; three of
 * them would 413 otherwise).
 *
 * Uploads go to POST /api/policy-upload -> quotes@ with attachments. Like
 * the restaurant lane, this BYPASSES the CRM inbound webhook (no auto-SMS):
 * these are high-premium leads that get the human call lane.
 */

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.(...args);
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const MAX_FILES = 5;
// Total post-compression budget, safely under the 4.5MB serverless body cap.
const MAX_TOTAL_BYTES = 3_500_000;

type Picked = { file: File; name: string; size: number };

// Downscale an image to <=1800px JPEG. Non-images (PDFs) pass through.
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
}

export default function RateCheckPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState<Picked[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [errMsg, setErrMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fired = useRef<Set<string>>(new Set());
  const track = useCallback((n: string) => {
    if (fired.current.has(n)) return;
    fired.current.add(n);
    fbq("trackCustom", n);
  }, []);

  const emailValid = EMAIL_RE.test(email.trim());
  const totalBytes = files.reduce((s, p) => s + p.size, 0);

  async function addFiles(list: FileList | null) {
    if (!list) return;
    track("FormStart");
    track("UploadStarted");
    const next = [...files];
    for (const raw of Array.from(list)) {
      if (next.length >= MAX_FILES) break;
      const file = await compressImage(raw);
      if (file.size > MAX_TOTAL_BYTES) {
        setErrMsg(
          "That file is too large even after compression - try photos of the pages instead of a scan.",
        );
        continue;
      }
      next.push({ file, name: raw.name, size: file.size });
    }
    setFiles(next.slice(0, MAX_FILES));
  }

  const canSubmit =
    name.trim() &&
    phone.trim() &&
    emailValid &&
    files.length > 0 &&
    totalBytes <= MAX_TOTAL_BYTES &&
    status !== "sending";

  // Partial capture: contact given but never submitted -> quotes@ only.
  const latest = useRef({ name, phone, email, status, fileCount: files.length });
  latest.current = { name, phone, email, status, fileCount: files.length };
  const sentPartial = useRef(false);
  const firePartial = useRef(() => {});
  firePartial.current = () => {
    if (sentPartial.current) return;
    const cur = latest.current;
    if (cur.status === "done" || cur.status === "sending") return;
    const validEmail = EMAIL_RE.test(cur.email.trim()) ? cur.email.trim() : undefined;
    if (!(validEmail || cur.phone.trim())) return;
    sentPartial.current = true;
    const body = JSON.stringify({
      name: cur.name || undefined,
      email: validEmail,
      phone: cur.phone.trim() || undefined,
      businessType: "Contractor - rate check (policy upload)",
      source: "contractor-upload",
      partial: true,
      final: true,
      details: [
        { label: "Files attached before leaving", value: String(cur.fileCount) },
      ],
    });
    try {
      const ok = navigator.sendBeacon(
        "/api/intake",
        new Blob([body], { type: "application/json" }),
      );
      if (!ok) throw new Error("beacon refused");
    } catch {
      fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  };

  useEffect(() => {
    const onHide = () => firePartial.current();
    const onVis = () => {
      if (document.visibilityState === "hidden") firePartial.current();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (name.trim() && phone.trim() && emailValid) track("ContactDone");
  }, [name, phone, emailValid, track]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    setErrMsg("");
    const eventId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    try {
      const fd = new FormData();
      fd.set("name", name.trim());
      fd.set("phone", phone.trim());
      fd.set("email", email.trim());
      fd.set("eventId", eventId);
      files.forEach((p) => fd.append("files", p.file, p.name));
      const res = await fetch("/api/policy-upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      fbq("track", "Lead", {}, { eventID: eventId });
      fbq("trackCustom", "RateCheckSubmit");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      fbq("trackCustom", "SubmitError");
      setErrMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "done") {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF1FF] text-3xl">
          ✅
        </div>
        <h1 className="mt-6 text-3xl font-bold text-[#131517]">
          Got it - we&rsquo;re on it.
        </h1>
        <p className="mt-3 max-w-md text-[#6B6D71]">
          A licensed agent will review your policy and call or text you with
          what we find - usually within a day. Want to talk now? Call{" "}
          <a href="tel:+19295945450" className="font-semibold text-[#2040E7]">
            (929) 594-5450
          </a>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
        <div className="mx-auto max-w-xl px-5 py-8 sm:py-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#2040E7]">
            Free business insurance rate check
          </span>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-[#131517] sm:text-4xl">
            Upload your policy. We&rsquo;ll beat it - or tell you it&rsquo;s
            already good.
          </h1>
          <p className="mt-3 text-[#27455C]">
            Upload your current policy (or just snap a photo of it). We use AI
            to automatically shop it and find you a better rate - a licensed
            agent reviews everything before it reaches you.
          </p>
        </div>
      </section>

      <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 px-5 py-8">
        <div className="grid gap-4">
          <input
            value={name}
            onChange={(e) => {
              track("FormStart");
              setName(e.target.value);
            }}
            placeholder="Your name"
            autoComplete="name"
            aria-label="Your name"
            className={inputClasses}
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              track("FormStart");
              setPhone(e.target.value);
            }}
            placeholder="Phone"
            autoComplete="tel"
            inputMode="tel"
            aria-label="Phone"
            className={inputClasses}
          />
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                track("FormStart");
                setEmail(e.target.value);
              }}
              placeholder="Email"
              autoComplete="email"
              inputMode="email"
              aria-label="Email"
              className={inputClasses}
            />
            {email && !emailValid && (
              <p className="mt-1 text-xs text-red-600">
                Please enter a valid email address.
              </p>
            )}
          </div>
        </div>

        {/* Upload target: one huge tap area; camera on phones */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[110px] w-full touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[#2040E7]/40 bg-[#F7F9FF] px-6 py-6 text-center transition hover:border-[#2040E7] active:bg-[#EEF1FF]"
        >
          <span className="text-3xl">📄</span>
          <span className="text-base font-semibold text-[#1A33B9]">
            {files.length === 0
              ? "Upload your policy (or snap a photo)"
              : "Add another file or page"}
          </span>
          <span className="text-xs text-[#6B6D71]">
            PDF or photos - the declarations page is all we need
          </span>
        </button>

        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((p, i) => (
              <li
                key={`${p.name}-${i}`}
                className="flex items-center justify-between rounded-lg border border-[#EEF1FF] bg-white px-4 py-2.5 text-sm"
              >
                <span className="truncate text-[#131517]">{p.name}</span>
                <button
                  type="button"
                  aria-label={`Remove ${p.name}`}
                  onClick={() =>
                    setFiles((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="ml-3 shrink-0 font-semibold text-[#6B6D71] hover:text-red-600"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        {totalBytes > MAX_TOTAL_BYTES && (
          <p className="text-xs text-red-600">
            Those files are too large together - remove one, or use photos
            instead of full scans.
          </p>
        )}

        {status === "error" && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {errMsg}
          </p>
        )}
        {errMsg && status !== "error" && (
          <p className="text-xs text-amber-700">{errMsg}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="min-h-[52px] w-full touch-manipulation rounded-xl bg-[#2040E7] px-6 py-4 text-center text-base font-semibold text-white transition hover:bg-[#1A33B9] active:bg-[#1A33B9] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Uploading…" : "Check my rate"}
        </button>
        <p className="text-center text-xs text-[#6B6D71]">
          Commercial policies only. We&rsquo;ll only use your policy to check
          your rate - nothing else.
        </p>
      </form>
    </main>
  );
}

const inputClasses =
  "w-full rounded-lg border border-[#D8DEF5] bg-white px-4 py-3 text-base text-[#131517] outline-none transition focus:border-[#2040E7] focus:ring-2 focus:ring-[#2040E7]/20";
