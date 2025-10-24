'use client';

import { useState } from 'react';
import { typedFetch } from '@/lib/fetcher';
import styles from './page.module.css';

interface PingResult {
  ok: boolean;
  status: number;
  latency: number;
  error?: string;
}

export default function OktaPingPage() {
  const [result, setResult] = useState<PingResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handlePing() {
    setLoading(true);
    const response = await typedFetch<PingResult>('/api/okta/ping');
    if (response.ok && response.data) {
      setResult(response.data);
    }
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h1>Okta Connection Test</h1>
      <button className={styles.button} onClick={handlePing} disabled={loading}>
        Test Connection
      </button>
      {result && (
        <div className={styles.card}>
          {result.ok ? (
            <>
              <p style={{ color: 'green' }}>✓ Connection successful</p>
              <p>Latency: {result.latency}ms</p>
            </>
          ) : (
            <>
              <p style={{ color: 'red' }}>✗ Connection failed</p>
              <p>Error: {result.error}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
