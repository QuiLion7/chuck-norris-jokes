"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Inicializa o estado com o valor do localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Erro ao recuperar do localStorage:", error);
    }
  }, [key]);

  // Função para atualizar o valor no localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que o valor seja uma função para seguir o mesmo padrão do useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Salva o estado
      setStoredValue(valueToStore);

      // Salva no localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
    }
  };

  return [storedValue, setValue] as const;
}
