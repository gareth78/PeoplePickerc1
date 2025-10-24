import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { fetchOktaUsersWithRetry } from '@/lib/okta';

export async function GET() {
  const cacheKey = 'okta-ping';

  const cached = await cache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const startTime = Date.now();

  try {
    await fetchOktaUsersWithRetry(undefined, 1, undefined);
    const latency = Date.now() - startTime;

    const result = {
      ok: true,
      status: 200,
      latency,
    };

    await cache.set(cacheKey, result, 60);

    return NextResponse.json(result);
  } catch (error) {
    const latency = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    const result = {
      ok: false,
      status: 500,
      latency,
      error: errorMessage,
    };

    return NextResponse.json(result, { status: 500 });
  }
}
