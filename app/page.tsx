'use client';

import { useState } from 'react';
import { User } from '@/lib/types';
import PeoplePicker from '@/components/people/PeoplePicker';
import styles from './page.module.css';

export default function HomePage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  function handleChange(user: User | null) {
    setSelectedUser(user);
  }

  return (
    <div className={styles.container}>
      <h1>People Picker Demo</h1>
      <p>Start typing to search for colleagues by name, title, or location</p>
      <div className={styles.pickerWrapper}>
        <PeoplePicker value={selectedUser} onChange={handleChange} />
      </div>
      {selectedUser && (
        <div className={styles.selectedCard}>
          <h2>Selected:</h2>
          <p>
            <strong>{selectedUser.displayName}</strong>
          </p>
          {selectedUser.title && <p>Title: {selectedUser.title}</p>}
          {selectedUser.officeLocation && <p>Location: {selectedUser.officeLocation}</p>}
          <p>Email: {selectedUser.email}</p>
        </div>
      )}
    </div>
  );
}
