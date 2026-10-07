/// <reference types="vite/client" />
import type { CapturedPageData } from './lib/page-types';

declare global {
  namespace App {
    interface Error {
      message: string;
      templatePage?: CapturedPageData;
    }
  }
}

export {};
