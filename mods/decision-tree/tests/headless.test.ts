import { expect, mock, test } from 'claude-code/testing'

// Headless (-p, SDK): no /explain command is registered. The control test runs last
// in this file, so the module-level flag is left false for other files.
function wire(on: any, counts: { command: number }, surfaces: string[] = []) {
  mock.store(on, {})
  mock.env(on, {})
  on('session.surfaces', () => ({ value: surfaces }))
  on('session.attach', (_$: any, e: any) => ({ clientId: e.clientId }))
  on('session.start', (_$: any, e: any) => ({ cwd: e.cwd }))
  on('command.register', () => { counts.command += 1; return { value: undefined } })
}

test('headless session registers no /explain command', async ($, on) => {
  const counts = { command: 0 }
  wire(on, counts)
  await $.session.start({ cwd: '/nowhere', surface: null, isInteractive: false })

  expect(counts.command).toBe(0)
})

// The desktop app: an SDK session that its app attaches to after it starts.
test('SDK session registers /explain when the app attaches', async ($, on) => {
  const counts = { command: 0 }
  wire(on, counts)
  await $.session.start({ cwd: '/nowhere', surface: null, isInteractive: false })
  expect(counts.command).toBe(0)

  await $.session.attach({ surface: 'desktop', clientId: 'desktop:default' })
  expect(counts.command).toBe(1)
})

// After /reload-plugins the app is attached already, and no attach comes.
test('SDK session with the app attached at start registers /explain', async ($, on) => {
  const counts = { command: 0 }
  wire(on, counts, ['desktop'])
  await $.session.start({ cwd: '/nowhere', surface: null, isInteractive: false })

  expect(counts.command).toBe(1)
})

// Positive control: the same stubs register /explain in an interactive session.
test('interactive session registers the /explain command', async ($, on) => {
  const counts = { command: 0 }
  wire(on, counts)
  await $.session.start({ cwd: '/nowhere', surface: 'terminal', isInteractive: true })

  expect(counts.command).toBe(1)
})
