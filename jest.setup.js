// Adiciona as extensões do jest-dom para testes de DOM
import '@testing-library/jest-dom';

// Mock para o objeto window.navigator.share
Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    ...window.navigator,
    share: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Mock para localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock para o objeto window.isSecureContext
Object.defineProperty(window, 'isSecureContext', {
  value: true,
});

// Mock para o clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

// Mock para módulos que podem causar problemas
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock('sonner', () => ({
  toast: jest.fn(),
  Toaster: () => <div data-testid="toaster" />,
}));

// Suprimir erros de console durante os testes
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
