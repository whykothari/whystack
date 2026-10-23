import { expect, mock, test } from 'claude-code/testing'

const PANE = {
  plugin: 'helper-desk',
  component: 'Pane',
  requestId: 'helper-desk',
  surface: 'desktop',
  props: {
    title: 'Helpers',
    isFocused: false,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const

const COMPANION = 'node "/plugins/codex/scripts/codex-companion.mjs" task --background "fix the flaky test"'

// Stands for the engine and for the Codex plugin's state.json, which `jobs` fills.
function wire(on: any, jobs: object[]) {
  const clock = mock.clock(on, { now: Date.parse('2026-10-23T10:00:30Z') })
  mock.store(on, {})
  mock.env(on, { HOME: '/home/me' })
  on('session.start', (_$: any, e: any) => ({ cwd: e.cwd }))
  on('session.id', () => ({ value: 'session-1' }))
  on('command.register', () => ({ value: undefined }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('fs.exists', () => ({ value: true }))
  on('fs.list', () => ({ value: [{ name: 'repo-1a2b', kind: 'dir', size: 0, mtimeMs: 0, isLink: false }] }))
  on('fs.read', () => ({ value: JSON.stringify({ version: 1, jobs }) }))
  on('tool.call', () => ({ result: {} }))
  return clock
}

async function texts($: any) {
  const ui = await $.ui.mount(PANE)
  const all = (await ui.findAll({ type: 'Text' })).map((t: any) => t.text).join('\n')
  await ui.unmount()
  return all
}

test('a Codex plugin job gets its own card, and only this session sees it', async ($, on) => {
  const jobs = [
    { id: 'task-1', kind: 'task', title: 'Codex Task', status: 'running', phase: 'editing', sessionId: 'session-1', startedAt: '2026-10-23T10:00:00Z' },
    { id: 'task-2', kind: 'task', title: 'Other session', status: 'running', sessionId: 'session-2' },
  ]
  wire(on, jobs)
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await $.tool.call({ tool: 'Bash', command: COMPANION })

  const shown = await texts($)
  expect(shown).toContain('Codex Task')
  expect(shown).toContain('Codex editing')
  expect(shown).not.toContain('Other session')

  jobs[0] = { ...jobs[0], status: 'completed', phase: 'done', summary: 'Fixed the race in the retry test', completedAt: '2026-10-23T10:02:00Z' }
  await $.tool.call({ tool: 'Bash', command: 'node "/plugins/codex/scripts/codex-companion.mjs" status' })
  const done = await texts($)
  expect(done).toContain('Fixed the race in the retry test')
  expect(done).toContain('✓')
})

test('a codex-rescue subagent and its job share one card', async ($, on) => {
  const jobs: object[] = []
  wire(on, jobs)
  on('agent.spawn', () => ({ agentId: 'agent-1', model: 'sonnet' }))
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await $.agent.spawn({ tool_use_id: 'tu-1', description: 'Rescue the build', subagentType: 'codex:codex-rescue', prompt: 'fix it' } as any)

  jobs.push({ id: 'task-3', kind: 'task', title: 'Codex Task', status: 'running', phase: 'investigating', sessionId: 'session-1' })
  await $.tool.call({ tool: 'Bash', command: COMPANION, agentId: 'agent-1' } as any)

  const shown = await texts($)
  expect(shown).toContain('Rescue the build')
  expect(shown).toContain('Codex investigating')
  expect(shown).not.toContain('Codex Task')
})

test('a foreground codex exec call gets a card; a background one does not', async ($, on) => {
  wire(on, [])
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await $.tool.call({ tool: 'Bash', command: 'codex exec -s read-only "review the log"' })
  expect(await texts($)).toContain('Codex · exec')

  await $.tool.call({ tool: 'Bash', command: 'codex exec "second run"', run_in_background: true })
  const cards = (await texts($)).split('Codex · exec').length - 1
  expect(cards).toBe(1)
})

test('the clock follows a background job to its end', async ($, on) => {
  const jobs = [{ id: 'task-4', kind: 'task', title: 'Background task', status: 'running', phase: 'running', sessionId: 'session-1' }]
  const clock = wire(on, jobs)
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await $.tool.call({ tool: 'Bash', command: COMPANION })
  expect(await texts($)).toContain('Codex running')

  jobs[0] = { ...jobs[0], status: 'failed', phase: 'failed' }
  await clock.advance(1000)
  await clock.settle()
  expect(await texts($)).toContain('✗')
})
