import { useSyncExternalStore, useCallback } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Safe helper untuk me-serialize data ke string
  const serialize = (val: T): string => {
    return typeof val === 'string' ? val : JSON.stringify(val);
  };

  // Safe helper untuk me-deserialize data dari string
  const deserialize = (val: string): T => {
    if (typeof initialValue === 'string') {
      return val as unknown as T;
    }
    try {
      return JSON.parse(val) as T;
    } catch {
      return initialValue;
    }
  };

  const getSnapshot = useCallback(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : serialize(initialValue);
    } catch {
      return serialize(initialValue);
    }
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => {
    return serialize(initialValue);
  }, [initialValue]);

  const rawStore = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const current = deserialize(rawStore);
        const nextValue = value instanceof Function ? value(current) : value;
        const serialized = serialize(nextValue);

        localStorage.setItem(key, serialized);
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error(`Error saving localStorage key "${key}":`, e);
      }
    },
    [key, rawStore]
  );

  return [deserialize(rawStore), setValue];
}