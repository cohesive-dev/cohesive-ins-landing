import { Suspense } from 'react';
import ContractorExperimentForm from '@/components/ContractorExperimentForm';
export const metadata={title:'Contractor insurance quote | Cohesive',robots:{index:false,follow:false}};
export default function Page(){return <Suspense fallback={<p>Loading your quote request…</p>}><ContractorExperimentForm/></Suspense>;}
