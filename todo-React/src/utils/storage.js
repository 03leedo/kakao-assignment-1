import { isValidDateKey } from "./date";

function canUseLocalStorage() {
  return typeof localStorage !== "undefined";
}

export function loadJson(key, fallbackValue, validateValue) {
  if (!canUseLocalStorage()) {
    return fallbackValue;
  }

  const savedValue = localStorage.getItem(key);

  if (!savedValue) {
    return fallbackValue;
  }

  try {
    const parsedValue = JSON.parse(savedValue);

    if (validateValue && !validateValue(parsedValue)) {
      localStorage.removeItem(key);
      return fallbackValue;
    }

    return parsedValue;
  } catch {
    localStorage.removeItem(key);
    return fallbackValue;
  }
}

export function saveJson(key, value) {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

export function loadDateKey(key, fallbackValue) {
  if (!canUseLocalStorage()) {
    return fallbackValue;
  }

  const savedValue = localStorage.getItem(key);

  if (!isValidDateKey(savedValue)) {
    localStorage.removeItem(key);
    return fallbackValue;
  }

  return savedValue;
}

export function saveDateKey(key, dateKey) {
  if (!canUseLocalStorage() || !isValidDateKey(dateKey)) {
    return;
  }

  localStorage.setItem(key, dateKey);
}
