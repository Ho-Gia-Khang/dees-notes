export function getLocalStorage(key: string): any | undefined {
  const value = localStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(`Error parsing localStorage value for key "${key}":`, e);
      return undefined;
    }
  }
}

export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting localStorage value for key "${key}":`, e);
  }
}

export function clearLocalStorage(keys: string[]) {
  keys.forEach((key) => localStorage.removeItem(key));
}

export function delayMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
