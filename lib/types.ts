export interface User {
  id: string;
  displayName: string;
  email: string;
  title: string | null;
  officeLocation: string | null;
  avatarUrl: string | null;
}

export interface OktaUser {
  id: string;
  profile: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email: string;
    title?: string;
    city?: string;
    officeLocation?: string;
  };
}

export interface PeopleSearchResult {
  items: User[];
  nextCursor: string | null;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  meta?: {
    count?: number;
    latency?: number;
    cached?: boolean;
  };
}

export interface CacheInterface {
  get(key: string): Promise<any | null>;
  set(key: string, value: any, ttlSeconds: number): Promise<void>;
  clear(): Promise<void>;
}
