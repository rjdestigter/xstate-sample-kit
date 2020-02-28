/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly E2E?: 'on' | 'off';
    readonly REACT_APP_DISABLE_Q_SHUFFLE?: 'TRUE' | 'FALSE';
  }
}