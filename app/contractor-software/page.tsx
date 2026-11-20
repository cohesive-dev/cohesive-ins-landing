import { Suspense } from 'react';
import ContractorExperimentForm from '@/components/ContractorExperimentForm';
// Duplicate of /contractor-test for the field-service-software ads (Jobber, JobNimbus, ArboStar...), Nam 11/20.
// Same form and intake source; leads carry Landing page /contractor-software + a Promo row.
export const metadata={title:'Contractor insurance quote, $100 off | Cohesive',robots:{index:false,follow:false}};
export default function Page(){return <Suspense fallback={<p>Loading your quote request…</p>}><ContractorExperimentForm promo="software100"/></Suspense>;}
