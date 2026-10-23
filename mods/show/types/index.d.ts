export type Tone = 'done' | 'open' | 'next' | 'warn' | 'info'

export type Card = { tone: Tone; title: string; lines: string[] }

declare module 'claude-code' {
  interface PluginState {
    show: { lastAnswer: string }
  }
}
