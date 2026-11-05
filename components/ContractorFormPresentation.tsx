"use client";
import PartialCaptureDisclosure from './PartialCaptureDisclosure';
import {contractorButtonClass} from './ContractorPageTheme';

export function ContractorFormActions({status,error,enabled,next=false,onBack,submitLabel,disclosureFirst=false}:{status:string;error:string;enabled:boolean;next?:boolean;onBack?:()=>void;submitLabel?:string;disclosureFirst?:boolean}){
 const disclosure=<PartialCaptureDisclosure>{disclosureFirst?'By saving your details, you ask us to contact you about a contractor insurance quote. More questions follow.':"We’ll only use your details to prepare and send your insurance quote."}</PartialCaptureDisclosure>;
 return <>{error&&<p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
 {onBack&&<button type="button" onClick={onBack} className="border rounded p-4">Back</button>}
 {disclosureFirst&&disclosure}
 <button type="submit" disabled={!enabled} className={contractorButtonClass}>{status==='saving'?'Saving…':status==='sending'?'Sending…':submitLabel??(next?'Next':'Get my quote')}</button>
 {!disclosureFirst&&disclosure}</>;
}
export function ContractorFormSuccess(){return <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
 <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF1FF] text-3xl">🛠️</div>
 <h1 className="mt-6 text-3xl font-bold text-[#131517]">Thanks - we&rsquo;ve got it.</h1>
 <p className="mt-3 max-w-md text-[#6B6D71]">A licensed agent will run your quote and reach out shortly - most come back within a day. Want to talk now? Call{' '}<a href="tel:+19295945450" className="font-semibold text-[#2040E7]">(929) 594-5450</a>.</p>
 </main>;}
