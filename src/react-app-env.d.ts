/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly E2E?: 'on' | 'off';
  }
}