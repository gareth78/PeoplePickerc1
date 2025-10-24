import { NextResponse } from 'next/server';
import { fetchOktaUsersWithRetry } from '@/lib/okta';

export async function GET() {
  try {
    const result = await fetchOktaUsersWithRetry(undefined, 5, undefined);

    return NextResponse.json({
      ok: true,
      data: {
        items: result.items,
      },
      meta: {
        count: result.items.length,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sample';

    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
