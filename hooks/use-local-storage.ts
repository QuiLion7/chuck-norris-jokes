"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Inicializa o estado com uma função para evitar execução durante SSR
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Erro ao recuperar do localStorage:", error);
      return initialValue;
    }
  });

  // Referência para o valor atual para uso em callbacks
  const valueRef = useRef(storedValue);
  
  // Atualiza a referência quando o valor muda
  useEffect(() => {
    valueRef.current = storedValue;
  }, [storedValue]);

  // Função para atualizar o valor no localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permite que o valor seja uma função para seguir o mesmo padrão do useState
      const valueToStore =
        value instanceof Function ? value(valueRef.current) : value;

      // Salva o estado
      setStoredValue(valueToStore);

      // Salva no localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
    }
  }, [key]);

  // Sincroniza com mudanças no localStorage de outras abas/janelas
  // usando um intervalo de polling em vez de eventos
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Função para verificar se o valor no localStorage mudou
    const checkStorageValue = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsedItem = JSON.parse(item);
          // Só atualiza se o valor for diferente
          if (JSON.stringify(parsedItem) !== JSON.stringify(valueRef.current)) {
            setStoredValue(parsedItem);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar localStorage:", error);
      }
    };

    // Verifica a cada 1 segundo (pode ser ajustado conforme necessário)
    const intervalId = setInterval(checkStorageValue, 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => {
      clearInterval(intervalId);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}
