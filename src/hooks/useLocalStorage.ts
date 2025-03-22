import { useState, useEffect } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
    window.dispatchEvent(new Event("localStorageChange"));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const newBackupValue = localStorage.getItem(key);
      const parsedValue = newBackupValue ? JSON.parse(newBackupValue) : initialValue;
      if (parsedValue !== value) {
        setValue(parsedValue);
      }
    };

    window.addEventListener("localStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("localStorageChange", handleStorageChange);
    };
  }, [key, initialValue, value]);

  return [value, setStoredValue] as const;
};