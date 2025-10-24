import { User } from '@/lib/types';
import styles from './PersonCard.module.css';

interface PersonCardProps {
  user: User;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function PersonCard({ user, isSelected = false, onClick }: PersonCardProps) {
  function getInitials(name: string): string {
    const words = name.split(' ');
    const firstLetter = words[0]?.charAt(0) || '';
    const lastLetter = words[words.length - 1]?.charAt(0) || '';
    return (firstLetter + (words.length > 1 ? lastLetter : '')).toUpperCase();
  }

  const className = isSelected ? `${styles.card} ${styles.cardSelected}` : styles.card;

  return (
    <div className={className} onClick={onClick}>
      <div className={styles.avatar}>{getInitials(user.displayName)}</div>
      <div className={styles.content}>
        <div className={styles.name}>{user.displayName}</div>
        {user.title && <div className={styles.title}>{user.title}</div>}
        {user.officeLocation && <div className={styles.location}>{user.officeLocation}</div>}
        <div className={styles.email}>{user.email}</div>
      </div>
    </div>
  );
}
