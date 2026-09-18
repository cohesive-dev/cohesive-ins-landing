import {NextRequest,NextResponse} from 'next/server';

// Keep paid contractor URLs usable when a copied path changes letter case.
// Internal rewrite preserves the browser URL, attribution parameters and session.
export function proxy(request:NextRequest){
 const url=request.nextUrl.clone();
 if(url.pathname.toLowerCase()==='/contractor-test'&&url.pathname!=='/contractor-test'){
  url.pathname='/contractor-test';return NextResponse.rewrite(url);
 }
 return NextResponse.next();
}
export const config={matcher:['/:path([cC][oO][nN][tT][rR][aA][cC][tT][oO][rR]-[tT][eE][sS][tT])']};
