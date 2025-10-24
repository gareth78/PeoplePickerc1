import { NextResponse } from 'next/server';

export async function GET() {
  const response = {
    ok: true,
    status: 200,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    cache: process.env.CACHE_TYPE || 'memory',
  };

  return NextResponse.json(response);
}
