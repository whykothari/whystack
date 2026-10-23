import { expect, mock, test } from 'claude-code/testing'

import { fromText, parseCards, toText } from '../hooks/register'

const ROW = {
  plugin: 'show',
  component: 'CommandOutput',
  surface: 'desktop',
  props: { command: 'show', args: '', isErrored: false },
} as const

const MODEL_REPLY = `{"cards":[
  {"tone":"done","title":"Codex card works","lines":["Seen in the Helpers pane"]},
  {"tone":"open","title":"Three items left","lines":["filetree options","8 old brew packages","claudemods repo"]},
  {"tone":"next","title":"Pick one","lines":[]}
]}`

function wire(on: any, reply: string) {
  mock.store(on, {})
  on('session.start', (_$: any, e: any) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: undefined }))
  on('model.complete', () => ({ value: { isAnswered: true, text: reply } }))
  on('turn.complete', (_$: any, e: any) => ({ text: e.answer }))
}

test('the cards survive the trip through the command row', () => {
  const cards = parseCards(MODEL_REPLY)!
  expect(cards).toHaveLength(3)
  expect(fromText(toText(cards))).toEqual(cards)
})

test('a reply that is not cards is refused', () => {
  expect(parseCards('Sure, here you go.')).toBeUndefined()
  expect(parseCards('{"cards":[{"tone":"loud","title":"x"}]}')).toBeUndefined()
  expect(fromText('Nothing to show yet.')).toBeUndefined()
})

test('/show draws the last reply as big cards', async ($, on) => {
  wire(on, MODEL_REPLY)
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await $.turn.complete({ reason: 'answer', answer: 'A long reply about the Codex card and what is left.' } as any)

  const run = await $.command.run({ command: 'show', args: '' } as any)
  const ui = await $.ui.mount({ ...ROW, props: { ...ROW.props, text: run.text! } })
  const shown = (await ui.findAll({ type: 'Text' })).map((t: any) => t.text).join('\n')
  await ui.unmount()

  expect(shown).toContain('CODEX CARD WORKS')
  expect(shown).toContain('8 old brew packages')
  expect(shown).toContain('→  PICK ONE')
})

test('/show before any reply says so', async ($, on) => {
  wire(on, MODEL_REPLY)
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  const run = await $.command.run({ command: 'show', args: '' } as any)
  expect(run.text).toContain('Nothing to show yet')
})
