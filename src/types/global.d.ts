declare global {
  interface Document {
    fonts?: {
      ready?: Promise<void>;
    };
  }
}
export {};
