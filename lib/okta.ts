// Includes exponential backoff retry logic for Okta rate limits (429 errors)
// Okta free tier: 1000 requests per minute, 10000 per hour

import { User, OktaUser, PeopleSearchResult } from './types';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function validateOktaConfig(): void {
  if (!process.env.OKTA_ORG_URL) {
    throw new Error('OKTA_ORG_URL environment variable is required');
  }
  if (!process.env.OKTA_API_TOKEN) {
    throw new Error('OKTA_API_TOKEN environment variable is required');
  }
}

function normalizeUser(oktaUser: OktaUser): User {
  const profile = oktaUser.profile;
  let displayName = profile.displayName;
  if (!displayName) {
    if (profile.firstName && profile.lastName) {
      displayName = `${profile.firstName} ${profile.lastName}`;
    } else {
      displayName = profile.email;
    }
  }

  return {
    id: oktaUser.id,
    displayName,
    email: profile.email,
    title: profile.title || null,
    officeLocation: profile.officeLocation || profile.city || null,
    avatarUrl: null,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOktaUsers(
  query?: string,
  limit: number = 10,
  cursor?: string
): Promise<PeopleSearchResult> {
  validateOktaConfig();

  const baseUrl = `${process.env.OKTA_ORG_URL}/api/v1/users`;
  const searchParams = new URLSearchParams();

  searchParams.append('limit', limit.toString());

  if (cursor) {
    searchParams.append('after', cursor);
  }

  if (query && query.trim().length > 0) {
    const escapedQuery = query.replace(/"/g, '\\"');
    const search = `profile.displayName sw "${escapedQuery}" or profile.email sw "${escapedQuery}" or profile.title sw "${escapedQuery}" or profile.officeLocation sw "${escapedQuery}"`;
    searchParams.append('search', search);
  }

  const url = `${baseUrl}?${searchParams.toString()}`;

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), 10000);

  try {
    const headers = {
      'Accept': 'application/json',
      'Authorization': `SSWS ${process.env.OKTA_API_TOKEN}`,
    };

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`Okta API error: ${response.status}`);
    }

    const data: OktaUser[] = await response.json();

    const linkHeader = response.headers.get('Link');
    let nextCursor: string | null = null;

    if (linkHeader) {
      const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      if (nextMatch) {
        const nextUrl = new URL(nextMatch[1]);
        nextCursor = nextUrl.searchParams.get('after');
      }
    }

    const items = data.map(normalizeUser);

    return {
      items,
      nextCursor,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchOktaUsersWithRetry(
  query?: string,
  limit: number = 10,
  cursor?: string,
  retryCount: number = 0
): Promise<PeopleSearchResult> {
  try {
    return await fetchOktaUsers(query, limit, cursor);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if ((errorMessage.includes('429') || errorMessage.toLowerCase().includes('rate limit')) && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
      await sleep(delay);
      return fetchOktaUsersWithRetry(query, limit, cursor, retryCount + 1);
    }

    throw error;
  }
}
