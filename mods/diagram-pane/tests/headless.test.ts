import { expect, mock, test } from 'claude-code/testing'

// Headless (-p, SDK): no pane, no /diagram command, no MCP tools. The control test
// runs last in this file, so the module-level flag is left false for other files.
function wire(on: any, counts: { open: number; command: number; tool: number }, surfaces: string[] = []) {
  mock.store(on, {})
  mock.env(on, {})
  on('session.surfaces', () => ({ value: surfaces }))
  on('session.attach', (_$: any, e: any) => ({ clientId: e.clientId }))
  on('session.start', (_$: any, e: any) => ({ cwd: e.cwd }))
  on('ui.log', () => ({ value: undefined }))
  on('ui.open', () => { counts.open += 1; return { value: undefined } })
  on('command.register', () => { counts.command += 1; return { value: undefined } })
  on('tool.register', () => { counts.tool += 1; return { value: undefined } })
}

test('headless session opens no pane and registers no command or tool', async ($, on) => {
  const counts = { open: 0, command: 0, tool: 0 }
  wire(on, counts)
  await $.session.start({ cwd: '/nowhere', surface: 'terminal', isInteractive: false })

  expect(counts.open).toBe(0)
  expect(counts.command).toBe(0)
  expect(counts.tool).toBe(0)
})

// The desktop app: an SDK session that its app attaches to after it starts.
test('SDK session sets up the pane, command and tools when the app attaches', async ($, on) => {
  const counts = { open: 0, command: 0, tool: 0 }
  wire(on, counts)
  await $.session.start({ cwd: '/nowhere', surface: null, isInteractive: false })
  expect(counts.command).toBe(0)

  await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' })
  expect(counts.open).toBe(1)
  expect(counts.command).toBe(1)
  expect(counts.tool).toBe(2)
})

// After /reload-plugins the app is attached already, and no attach comes.
test('SDK session with the app attached at start sets up at once', async ($, on) => {
  const counts = { open: 0, command: 0, tool: 0 }
  wire(on, counts, ['desktop'])
  await $.session.start({ cwd: '/nowhere', surface: null, isInteractive: false })

  expect(counts.open).toBe(1)
  expect(counts.command).toBe(1)
  expect(counts.tool).toBe(2)
})

// Positive control: the same stubs open the pane, add /diagram and register both tools.
test('interactive session opens the pane and registers the command and tools', async ($, on) => {
  const counts = { open: 0, command: 0, tool: 0 }
  wire(on, counts)
  await $.session.start({ cwd: '/nowhere', surface: 'terminal', isInteractive: true })

  expect(counts.open).toBe(1)
  expect(counts.command).toBe(1)
  expect(counts.tool).toBe(2)
})
