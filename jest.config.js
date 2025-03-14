// @ts-check
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Forneça o caminho para o seu aplicativo Next.js
  dir: './',
});

// Qualquer configuração personalizada que você queira passar para o Jest
const customJestConfig = {
  // Adiciona um setup após o ambiente de teste ser configurado
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Manipula aliases de módulos
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
};

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração Next.js
module.exports = createJestConfig(customJestConfig);
