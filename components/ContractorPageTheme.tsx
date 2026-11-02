import type {ReactNode} from 'react';
export const contractorMainClass='min-h-screen bg-white';
export const contractorFormClass='mx-auto max-w-2xl space-y-8 px-5 py-8 sm:px-6 sm:py-10';
export const contractorButtonClass='min-h-[52px] w-full touch-manipulation rounded-xl bg-[#2040E7] px-6 py-4 text-center text-base font-semibold text-white transition hover:bg-[#1A33B9] active:bg-[#1A33B9] disabled:cursor-not-allowed disabled:opacity-50';
export default function ContractorPageHero({title,children}:{title?:ReactNode;children?:ReactNode}){return <section className="border-b border-[#EEF1FF] bg-[#F7F9FF]">
        <div className="mx-auto max-w-2xl px-5 py-5 sm:px-6 sm:py-7">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#2040E7]">
            For contractors &amp; construction businesses
          </span>
          <h1 className="mt-1.5 text-xl font-bold leading-snug text-[#131517] sm:text-2xl">
            {title||'General liability built for contractors'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#27455C] sm:text-base">
{children||'We use AI to automatically shop your coverage and find you a better rate, reviewed by a licensed agent.'}
          </p>
        </div>
      </section>
;}
