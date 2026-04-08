import { NextRequest, NextResponse } from 'next/server';

// Route protection is handled at the layout level via getServerSession
// This middleware is intentionally a no-op
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [], // no routes matched = middleware never runs
};
