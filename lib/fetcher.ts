import { ApiResponse } from './types';

export async function typedFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const startTime = Date.now();

  try {
    const response = await fetch(url, options);
    const latency = Date.now() - startTime;

    if (!response.ok) {
      return {
        ok: false,
        error: `HTTP error: ${response.status}`,
        meta: { latency },
      };
    }

    const data: T = await response.json();

    return {
      ok: true,
      data,
      meta: { latency },
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      ok: false,
      error: message,
      meta: { latency },
    };
  }
}
