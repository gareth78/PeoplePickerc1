'use client';

import { useState } from 'react';
import { typedFetch } from '@/lib/fetcher';
import { User } from '@/lib/types';
import styles from './page.module.css';

export default function SamplePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFetch() {
    setLoading(true);
    setError(null);

    const response = await typedFetch<{ items: User[] }>('/api/people/sample');

    if (response.ok && response.data) {
      setUsers(response.data.items);
    } else {
      setError(response.error || 'Failed to fetch');
    }

    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h1>Sample Users from Okta</h1>
      <button className={styles.button} onClick={handleFetch} disabled={loading}>
        Fetch 5 Sample Users
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Title</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td>{user.title || '-'}</td>
                <td>{user.officeLocation || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
