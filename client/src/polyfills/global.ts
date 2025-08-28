declare global {
  interface Window { global?: any }
}

// Make Node's `global` alias the browser `window` (for libs that assume it)
if (typeof window !== "undefined" && (window as any).global === undefined) {
  (window as any).global = window;
}

export {};