import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.spec.ts',   // testes em __tests__ com .spec.ts
    '**/?(*.)+(spec|test).ts',     // ou qualquer lugar com .spec.ts ou .test.ts
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'], // ajusta conforme a estrutura do seu projeto
};

export default config;