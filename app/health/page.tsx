'use client';

import { useState, useEffect } from 'react';
import { typedFetch } from '@/lib/fetcher';
import styles from './page.module.css';

interface HealthData {
  ok: boolean;
  status: number;
  timestamp: string;
  environment: string;
  nodeVersion: string;
  cache: string;
}

export default function HealthPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchHealth() {
      const response = await typedFetch<HealthData>('/api/health');
      if (response.ok && response.data) {
        setHealthData(response.data);
      }
      setLoading(false);
    }

    fetchHealth();
  }, []);

  return (
    <div className={styles.container}>
      <h1>People Picker - Health Check</h1>
      {loading ? (
        <p>Loading...</p>
      ) : healthData ? (
        <div className={styles.card}>
          <h2>PeoplePickerc1</h2>
          <div>
            {healthData.ok ? (
              <>
                <span className={`${styles.statusIndicator} ${styles.statusOk}`}></span>
                <span>Status: OK</span>
              </>
            ) : (
              <>
                <span className={`${styles.statusIndicator} ${styles.statusError}`}></span>
                <span>Status: Error</span>
              </>
            )}
          </div>
          <p>Environment: {healthData.environment}</p>
          <p>Node Version: {healthData.nodeVersion}</p>
          <p>Cache Type: {healthData.cache}</p>
          <p>Timestamp: {healthData.timestamp}</p>
        </div>
      ) : (
        <p>Failed to load health data</p>
      )}
    </div>
  );
}
