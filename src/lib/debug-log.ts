// Only logs under `wxt dev`/`dev:firefox` (COMMAND === 'serve'). WXT/Vite
// replaces `import.meta.env.COMMAND` with a literal at build time, so in a
// production build this whole call is dead code the minifier strips —
// nothing from these traces ships in the built extension.
export function debugLog(...args: unknown[]): void {
  if (import.meta.env.COMMAND === 'serve') {
    console.log(...args);
  }
}
