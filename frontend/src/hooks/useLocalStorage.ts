import { useEffect, useState, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  const setItem = useCallback((newValue: T | ((val: T) => T)) => {
    setValue((currentValue) => {
      const resolvedValue = newValue instanceof Function ? newValue(currentValue) : newValue;
      
      if (typeof window !== "undefined") {
        if (resolvedValue === null || resolvedValue === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(resolvedValue));
        }
        window.dispatchEvent(new Event("local-storage-" + key));
      }
      
      return resolvedValue;
    });
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = () => {
      const stored = window.localStorage.getItem(key);
      setValue(stored ? (JSON.parse(stored) as T) : initialValue);
    };

    const eventName = "local-storage-" + key;
    window.addEventListener(eventName, handleStorageChange);
    window.addEventListener("storage", handleStorageChange); // for cross-tab sync

    return () => {
      window.removeEventListener(eventName, handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, initialValue]);

  return [value, setItem] as const;
}
