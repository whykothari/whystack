export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export type Task = { content: string; status: TaskStatus; activeForm: string }

export type HelperStatus = 'running' | 'done' | 'failed'

export type Helper = {
  id: string
  agentId?: string
  description: string
  type: string
  model: string
  status: HelperStatus
  startedAt: number
  endedAt?: number
  tools: number
  lastTool?: string
  todoDone?: number
  todoTotal?: number
  codexJobId?: string
  phase?: string
  summary?: string
}

// A job as the Codex plugin writes it in its state.json.
export type CodexJob = {
  id: string
  kind: string
  title?: string
  status: string
  phase?: string | null
  summary?: string | null
  sessionId?: string
  createdAt?: string
  startedAt?: string
  completedAt?: string
}

declare module 'claude-code' {
  interface PluginState {
    'helper-desk': { tasks: Task[]; helpers: Helper[]; now: number }
  }
}
