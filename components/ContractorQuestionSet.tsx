"use client";
import {cloneElement,createContext,isValidElement,useContext,useEffect,useRef} from 'react';
import {acceptedPhoneShape} from '@/lib/phone-shape';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import {TRADES} from '@/lib/contractor-trades';
import {OTHER_TRADES,PRIMARY_PCT,REVENUE,EMPLOYEES,PAYROLL,USES_SUBCONTRACTORS,SUBCONTRACTOR_COSTS,STRUCTURE,CURRENT_GL,CURRENT_PREMIUM,type Option} from '@/lib/contractor-full-options';
const FIELD_KEYS:Record<string,string>={'Full name':'fullName','Email':'email','Phone':'phone','Legal business name':'legalName','Business address':'address',"What's your primary trade?":'trade','Any other trades?':'otherTrades','How much of your work is your primary trade?':'primaryPct','Describe your other trade or services':'otherTradeDescription','Annual revenue (roughly)':'revenue','W2 employees':'employees','Annual W2 payroll (roughly)':'payroll','Do you hire subcontractors?':'usesSubcontractors','Annual subcontractor costs (roughly)':'subcontractorCosts','Business structure':'structure','What year did you start the business?':'yearStarted','Do you have general liability coverage today?':'currentGl','What are you paying now for GL, per year?':'currentPremium'};
const VisibleFields=createContext<{keys:string[];sections:string[]}|null>(null);
export default function ContractorQuestionSet({f,set,visible,contactFirst=false}:{f:Record<string,string>;set:(k:string,v:string)=>void;visible?:string[];contactFirst?:boolean}){
 const qualified=true,hasW2Employees=!!f.employees&&!f.employees.startsWith('0'),usesSubcontractors=f.usesSubcontractors==='Yes';
 const emailValid=/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(f.email||''),phoneValid=acceptedPhoneShape(f.phone);
 const selectedOtherTrades=f.otherTrades&&f.otherTrades!=='None'?f.otherTrades.split(', ').filter(Boolean):f.otherTrades==='None'?['None']:[];
 const otherTradeOptions=OTHER_TRADES.filter(o=>o.value==='None'||o.value!==f.trade);
 const needsOtherTradeDescription=f.trade==='Other trade'||selectedOtherTrades.includes('Other trade');
 function toggleOtherTrade(value:string){if(value==='None'){set('otherTrades','None');return;}const cur=selectedOtherTrades.filter(t=>t!=='None');set('otherTrades',(cur.includes(value)?cur.filter(t=>t!==value):[...cur,value]).join(', '));}
 const sections=visible?[...(visible.some(k=>['fullName','email','phone'].includes(k))?['Your contact info']:[]),...(visible.some(k=>!['fullName','email','phone','currentGl','currentPremium','mailingAddress'].includes(k))?['About your business']:[]),...(visible.some(k=>['currentGl','currentPremium'].includes(k))?['Your current coverage']:[])]:[];
 return <VisibleFields.Provider value={visible?{keys:visible,sections}:null}><div className="space-y-8">
        {/* Contact */}
        <Section title="Your contact info">
{!contactFirst && (          <Field label="Full name" required>
            <Input value={f.fullName} onChange={(v) => set("fullName", v)} placeholder="Jane Smith" autoComplete="name" />
          </Field>)}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field label="Email" required>
                <Input type="email" value={f.email} onChange={(v) => set("email", v)} placeholder="you@example.com" autoComplete="email" inputMode="email" />
              </Field>
              {f.email && !emailValid && (
                <p className="mt-1 text-xs text-red-600">
                  Please enter a valid email address.
                </p>
              )}
            </div>
            <div>
              <Field label="Phone" required>
                <Input type="tel" value={f.phone} onChange={(v) => set("phone", v)} placeholder="(929) 594-5450" autoComplete="tel" inputMode="tel" />
              </Field>
              {f.phone && !phoneValid && (
                <p className="mt-1 text-xs text-red-600">
                  Please enter a valid phone number.
                </p>
              )}
            </div>
          </div>
{contactFirst && (          <Field label="Full name" required>
            <Input value={f.fullName} onChange={(v) => set("fullName", v)} placeholder="Jane Smith" autoComplete="name" />
          </Field>)}
        </Section>

        {/* Business */}
        {qualified && (
          <Section title="About your business">
            <Field label="Legal business name" required>
              <Input value={f.legalName} onChange={(v) => set("legalName", v)} placeholder="Smith Contracting LLC" autoComplete="organization" />
            </Field>
            <Field label="Business address" required hint="Street, city, state, ZIP">
              <AddressAutocomplete value={f.address} onChange={(v) => set("address", v)} placeholder="123 Main St, San Antonio, TX 78216" />
            </Field>
            <Field label="What's your primary trade?" required>
              <Select value={f.trade} onChange={(v) => set("trade", v)} options={TRADES} placeholder="Select one" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Any other trades?" required alignOnDesktop>
                <MultiSelect
                  values={selectedOtherTrades}
                  onToggle={toggleOtherTrade}
                  options={otherTradeOptions}
                  placeholder="Select all that apply"
                />
              </Field>
              <Field label="How much of your work is your primary trade?" required alignOnDesktop>
                <Select value={f.primaryPct} onChange={(v) => set("primaryPct", v)} options={PRIMARY_PCT} placeholder="Select one" />
              </Field>
            </div>
            {needsOtherTradeDescription && (
              <Field label="Describe your other trade or services" required>
                <Input value={f.otherTradeDescription} onChange={(v) => set("otherTradeDescription", v)} placeholder="Tell us what work you do" />
              </Field>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Annual revenue (roughly)" required alignOnDesktop>
                <Select value={f.revenue} onChange={(v) => set("revenue", v)} options={REVENUE} placeholder="Select one" />
              </Field>
              <Field label="W2 employees" required hint="Do not include owners or subcontractors." alignOnDesktop>
                <Select value={f.employees} onChange={(v) => set("employees", v)} options={EMPLOYEES} placeholder="Select one" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {hasW2Employees && (
                <Field label="Annual W2 payroll (roughly)" required hint="Wages to employees, not subcontractor payments." alignOnDesktop>
                  <Select value={f.payroll} onChange={(v) => set("payroll", v)} options={PAYROLL} placeholder="Select one" />
                </Field>
              )}
              <Field label="Do you hire subcontractors?" required alignOnDesktop>
                <Select value={f.usesSubcontractors} onChange={(v) => set("usesSubcontractors", v)} options={USES_SUBCONTRACTORS} placeholder="Select one" />
              </Field>
              {usesSubcontractors && (
                <Field label="Annual subcontractor costs (roughly)" required hint="Total amount paid to subcontractors each year." alignOnDesktop>
                  <Select value={f.subcontractorCosts} onChange={(v) => set("subcontractorCosts", v)} options={SUBCONTRACTOR_COSTS} placeholder="Select one" />
                </Field>
              )}
              <Field label="Business structure" alignOnDesktop>
                <Select value={f.structure} onChange={(v) => set("structure", v)} options={STRUCTURE} placeholder="Select one" />
              </Field>
            </div>
            <Field label="What year did you start the business?">
              <Input value={f.yearStarted} onChange={(v) => set("yearStarted", v)} placeholder="2015" inputMode="numeric" />
            </Field>
          </Section>
        )}

        {/* Current coverage */}
        {qualified && (
          <Section title="Your current coverage">
            <Field label="Do you have general liability coverage today?">
              <Select value={f.currentGl} onChange={(v) => set("currentGl", v)} options={CURRENT_GL} placeholder="Select one" />
            </Field>
            <Field label="What are you paying now for GL, per year?" hint="Best guess is fine.">
              <Select value={f.currentPremium} onChange={(v) => set("currentPremium", v)} options={CURRENT_PREMIUM} placeholder="Select one" />
            </Field>
          </Section>
        )}

</div></VisibleFields.Provider>;
}
// ---- little presentational helpers ---------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const ctx=useContext(VisibleFields);
  if(ctx && !ctx.sections.includes(title))return null;
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-[#27455C]">{title}</h2>
      {children}
    </section>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {children}
    </p>
  );
}

function Field({
  label,
  hint,
  required,
  alignOnDesktop,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  alignOnDesktop?: boolean;
  children: React.ReactNode;
}) {
  const ctx=useContext(VisibleFields);const key=FIELD_KEYS[label];
  if(ctx && !ctx.keys.includes(key))return null;
  // A <div>, not a <label>: several fields hold button groups (radio chips),
  // and wrapping those in a <label> makes tapping the question text toggle
  // the first chip. The label is pushed down as an accessible name instead.
  const control = isValidElement(children)
    ? cloneElement(children as React.ReactElement<{ ariaLabel?: string }>, {
        ariaLabel: label,
      })
    : children;
  return (
    <div className="space-y-1.5" data-funnel-field={key}>
      <div className={alignOnDesktop ? "sm:min-h-[3.25rem]" : undefined}>
        <span className="block text-sm font-medium text-[#131517]">
          {label}
          {required && <span className="text-[#2040E7]"> *</span>}
        </span>
        {hint && <span className="mt-1 block text-xs text-[#6B6D71]">{hint}</span>}
      </div>
      {control}
    </div>
  );
}

// text-base (16px) is deliberate: inputs under 16px make iOS Safari auto-zoom
// on focus. min-h keeps a comfortable tap target.
const inputClasses =
  "w-full rounded-lg border border-[#D8DEF5] bg-white px-4 py-3 text-base text-[#131517] outline-none transition focus:border-[#2040E7] focus:ring-2 focus:ring-[#2040E7]/20";

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  ariaLabel,
  inputMode,
}: {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  ariaLabel?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-label={ariaLabel}
      inputMode={inputMode}
      className={inputClasses}
    />
  );
}


function Select({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  ariaLabel?: string;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={inputClasses}
    >
      <option value="" disabled>
        {placeholder ?? "Select"}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function MultiSelect({
  values,
  onToggle,
  options,
  placeholder,
  ariaLabel,
}: {
  values: string[];
  onToggle: (value: string) => void;
  options: Option[];
  placeholder?: string;
  ariaLabel?: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOnOutsidePress = (event: PointerEvent) => {
      const details = detailsRef.current;
      if (details?.open && event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      const details = detailsRef.current;
      if (event.key !== "Escape" || !details?.open) return;
      details.open = false;
      details.querySelector<HTMLElement>("summary")?.focus();
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const summary = values.length === 0
    ? placeholder ?? "Select all that apply"
    : values.includes("None")
      ? "None - just my primary trade"
      : values.length === 1
        ? values[0]
        : `${values.length} trades selected`;

  return (
    <details ref={detailsRef} className="group relative">
      <summary
        aria-label={ariaLabel}
        className={`${inputClasses} flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden`}
      >
        <span className="min-w-0 truncate">{summary}</span>
        <span aria-hidden="true" className="shrink-0 text-[#6B6D71] transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-[#D8DEF5] bg-white p-2 shadow-lg">
        {options.map((option) => {
          const selected = values.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              aria-pressed={selected}
              className={`flex min-h-[44px] w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${
                selected ? "bg-[#EEF1FF] text-[#1A33B9]" : "text-[#131517] hover:bg-slate-50"
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  selected ? "border-[#2040E7] bg-[#2040E7] text-white" : "border-[#AAB3C5]"
                }`}
              >
                {selected ? "✓" : ""}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </details>
  );
}

function Radio({
  name,
  value,
  onChange,
  options,
  ariaLabel,
}: {
  name: string;
  value?: string;
  onChange: (v: string) => void;
  options: Option[];
  ariaLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            type="button"
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={
              "min-h-[48px] touch-manipulation rounded-lg border px-4 py-3 text-[15px] font-medium transition " +
              (active
                ? "border-[#2040E7] bg-[#EEF1FF] text-[#1A33B9]"
                : "border-[#D8DEF5] bg-white text-[#131517] hover:border-[#2040E7]")
            }
          >
            {o.label}
          </button>
        );
      })}
      <input type="hidden" name={name} value={value ?? ""} readOnly />
    </div>
  );
}
