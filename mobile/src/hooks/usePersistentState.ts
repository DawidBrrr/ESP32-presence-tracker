import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(key)
      .then((stored) => {
        if (!active) {
          return;
        }

        if (stored) {
          setValue(JSON.parse(stored) as T);
        }
      })
      .catch((error) => {
        console.error(`Failed to read ${key} from storage`, error);
      })
      .finally(() => {
        if (active) {
          setHydrated(true);
        }
      });

    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const persist = async () => {
      if (value === null || value === undefined) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }
    };

    persist().catch((error) => {
      console.error(`Failed to persist ${key} to storage`, error);
    });
  }, [hydrated, key, value]);

  return [value, setValue, hydrated] as const;
}
