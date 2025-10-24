import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { fetchOktaUsersWithRetry } from '@/lib/okta';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const cursor = searchParams.get('cursor');

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Query must be at least 2 characters',
      },
      { status: 400 }
    );
  }

  const cacheKey = `people:${query}:${cursor || 'first'}`;
  const cacheTTL = parseInt(process.env.CACHE_TTL_SECONDS || '600', 10);

  const cached = await cache.get(cacheKey);
  if (cached) {
    return NextResponse.json({
      ok: true,
      data: cached,
      meta: {
        cached: true,
      },
    });
  }

  try {
    const result = await fetchOktaUsersWithRetry(query, 10, cursor || undefined);

    const data = {
      items: result.items,
      nextCursor: result.nextCursor,
    };

    await cache.set(cacheKey, data, cacheTTL);

    return NextResponse.json({
      ok: true,
      data,
      meta: {
        count: result.items.length,
        cached: false,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Search failed';

    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
