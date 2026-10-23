import type { EngineInterface } from 'claude-code'

import type { CodexJob, Helper, HelperStatus } from '../types'

// The Codex plugin (openai/codex-plugin-cc) keeps one state.json per workspace
// in its plugin data folder. Each job names the Claude session that started it.
export async function readCodexJobs($: EngineInterface, sessionId: string): Promise<CodexJob[]> {
  const config = (await $.env.get('CLAUDE_CONFIG_DIR')) || `${await $.env.get('HOME')}/.claude`
  const root = `${config}/plugins/data/codex-openai-codex/state`
  if (!(await $.fs.exists(root))) return []
  const jobs: CodexJob[] = []
  for (const entry of await $.fs.list(root)) {
    if (entry.kind !== 'dir') continue
    try {
      const state = JSON.parse(await $.fs.read(`${root}/${entry.name}/state.json`))
      for (const job of state.jobs ?? []) if (job.sessionId === sessionId) jobs.push(job)
    } catch {
      // A workspace with no state yet, or a file the plugin is writing now.
    }
  }
  return jobs
}

export const runsCodexPlugin = (command: string) => command.includes('codex-companion.mjs')

export const runsCodexExec = (command: string) => /(^|[\s;&|(])codex\s+(exec|e)\s/.test(command)

function statusOf(job: CodexJob): HelperStatus {
  if (job.status === 'completed') return 'done'
  if (job.status === 'failed' || job.status === 'cancelled') return 'failed'
  return 'running'
}

const timeOf = (iso: string | undefined) => (iso ? Date.parse(iso) : undefined)

// One card per job. A codex-rescue subagent starts its job through Bash, so a
// new job goes on that subagent's card when one is running without a job.
export function withCodexJobs(all: Helper[], jobs: CodexJob[]): Helper[] {
  let next = all
  for (const job of jobs) {
    const live = { phase: job.phase ?? undefined, summary: job.summary ?? undefined }
    const card = next.find(h => h.codexJobId === job.id)
    if (card) {
      next = next.map(h =>
        h !== card ? h
        : h.agentId !== undefined ? { ...h, ...live }
        : { ...h, ...live, status: statusOf(job), endedAt: timeOf(job.completedAt) },
      )
      continue
    }
    const rescue = next.find(h => h.status === 'running' && h.type.endsWith('codex-rescue') && !h.codexJobId)
    if (rescue) {
      next = next.map(h => (h === rescue ? { ...h, ...live, codexJobId: job.id } : h))
      continue
    }
    const startedAt = timeOf(job.startedAt ?? job.createdAt) ?? 0
    next = [
      ...next,
      {
        id: `codex:${job.id}`,
        codexJobId: job.id,
        description: job.title || `Codex ${job.kind}`,
        type: `Codex · ${job.kind}`,
        model: '',
        status: statusOf(job),
        startedAt,
        endedAt: timeOf(job.completedAt),
        tools: 0,
        ...live,
      },
    ].slice(-50)
  }
  return next
}
