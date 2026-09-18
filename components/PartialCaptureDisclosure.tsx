import type {ReactNode} from "react";
export default function PartialCaptureDisclosure({children}:{children?:ReactNode}){return <p className="mt-4 text-xs leading-relaxed text-[#6B6D71]">{children}{children&&" "}Contact details you enter may be saved before submission to help recover an unfinished quote request. <a href="/privacy" className="underline">Privacy policy</a></p>;}
