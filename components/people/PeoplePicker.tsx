'use client';

import { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/types';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { usePeopleSearch } from '@/lib/hooks/usePeopleSearch';
import PersonCard from './PersonCard';
import styles from './PeoplePicker.module.css';

interface PeoplePickerProps {
  value: User | null;
  onChange: (user: User | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function PeoplePicker({
  value,
  onChange,
  placeholder = 'Search by name, title, or location...',
  disabled = false,
}: PeoplePickerProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const { results, loading, error, nextCursor, search, reset } = usePeopleSearch();
  const debouncedValue = useDebounce(inputValue, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedValue.length >= 2) {
      search(debouncedValue);
      setIsOpen(true);
    } else {
      reset();
      setIsOpen(false);
    }
  }, [debouncedValue, search, reset]);

  function handleSelect(user: User) {
    onChange(user);
    setInputValue(user.displayName);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (activeIndex < results.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  function handleLoadMore() {
    if (nextCursor) {
      search(inputValue, nextCursor);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="people-listbox"
        aria-activedescendant={activeIndex >= 0 ? `people-option-${activeIndex}` : undefined}
      />
      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdown} id="people-listbox" role="listbox">
          {loading ? (
            <div className={styles.loadingText}>Searching...</div>
          ) : error ? (
            <div className={styles.errorText}>{error}</div>
          ) : results.length === 0 ? (
            <div className={styles.noResults}>No results found</div>
          ) : (
            <>
              <ul className={styles.resultsList}>
                {results.map((user, index) => (
                  <li
                    key={user.id}
                    id={`people-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <PersonCard
                      user={user}
                      isSelected={index === activeIndex}
                      onClick={() => handleSelect(user)}
                    />
                  </li>
                ))}
              </ul>
              {nextCursor && (
                <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                  Load more
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
