"use client";

import { useCallback, useSyncExternalStore } from "react";

import { isValidDateKey } from "@/lib/date";

const TODO_DATE_STORAGE_EVENT = "todo-date-storage";

type PersistentDateAction = string | ((currentDateKey: string) => string);

export function usePersistentDateKey(
  storageKey: string,
  fallbackDateKey: string,
): [string, (action: PersistentDateAction) => void] {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener(TODO_DATE_STORAGE_EVENT, onStoreChange);

    return () => {
      window.removeEventListener("storage", onStoreChange);
      window.removeEventListener(TODO_DATE_STORAGE_EVENT, onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    return getStoredDateKey(storageKey, fallbackDateKey);
  }, [fallbackDateKey, storageKey]);

  const getServerSnapshot = useCallback(() => {
    return fallbackDateKey;
  }, [fallbackDateKey]);

  const dateKey = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setDateKey = useCallback(
    (action: PersistentDateAction) => {
      const currentDateKey = getStoredDateKey(storageKey, fallbackDateKey);
      const nextDateKey = typeof action === "function" ? action(currentDateKey) : action;

      window.localStorage.setItem(storageKey, nextDateKey);
      window.dispatchEvent(new Event(TODO_DATE_STORAGE_EVENT));
    },
    [fallbackDateKey, storageKey],
  );

  return [dateKey, setDateKey];
}

function getStoredDateKey(storageKey: string, fallbackDateKey: string): string {
  if (typeof window === "undefined") {
    return fallbackDateKey;
  }

  const storedDateKey = window.localStorage.getItem(storageKey);

  if (!storedDateKey || !isValidDateKey(storedDateKey)) {
    return fallbackDateKey;
  }

  return storedDateKey;
}
