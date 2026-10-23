import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Card, Tone } from '../types'

// /show redraws Claude's last reply as big cards in the transcript. A small
// model sorts the reply into cards. The command's row stores them as plain
// lines, so the cards draw again after a reload, and the model reads them too.

const COMMAND = 'show'

const TONES: Record<Tone, string> = { done: 'green', open: 'yellow', next: 'magenta', warn: 'red', info: 'cyan' }
const MARKS: Record<Tone, string> = { done: '✓', open: '○', next: '→', warn: '!', info: '•' }

const lastAnswer = atom({ plugin: 'show', key: 'lastAnswer' } as const, '')

const SYSTEM = `You turn an AI assistant's reply into big cards for a reader with ADHD.
Return JSON only, no prose: {"cards":[{"tone":"done","title":"2 to 4 words","lines":["at most 8 words"]}]}
- 2 to 6 cards. Each card has 0 to 3 lines.
- tone is one of: done (finished), open (not done), next (what the reader must do or decide), warn (a risk or error), info (a fact).
- Keep names, numbers, paths, and commands exact. Drop filler and reasons that change nothing.
- Put a question or a step for the reader in one "next" card, last.`

const FAILED = 'Could not draw the cards. Run /show again.'

const CARD_LINE = /^\[(done|open|next|warn|info)\] (.+)$/

export function toText(cards: Card[]): string {
  return cards.map(card => [`[${card.tone}] ${card.title}`, ...card.lines.map(line => `  ${line}`)].join('\n')).join('\n')
}

export function fromText(text: string): Card[] | undefined {
  const cards: Card[] = []
  for (const row of text.split('\n')) {
    const head = CARD_LINE.exec(row)
    if (head) cards.push({ tone: head[1] as Tone, title: head[2], lines: [] })
    else if (row.startsWith('  ') && cards.length) cards[cards.length - 1].lines.push(row.trim())
    else if (row.trim()) return undefined
  }
  return cards.length ? cards : undefined
}

export function parseCards(reply: string): Card[] | undefined {
  const start = reply.indexOf('{')
  const end = reply.lastIndexOf('}')
  if (start < 0 || end < start) return undefined
  try {
    const raw = JSON.parse(reply.slice(start, end + 1)).cards
    if (!Array.isArray(raw)) return undefined
    const cards = raw
      .filter((c: any) => c && c.tone in TONES && typeof c.title === 'string' && c.title.trim())
      .slice(0, 6)
      .map((c: any): Card => ({
        tone: c.tone,
        title: c.title.trim().replace(/\s+/g, ' '),
        lines: (Array.isArray(c.lines) ? c.lines : [])
          .filter((l: unknown) => typeof l === 'string' && l.trim())
          .slice(0, 3)
          .map((l: string) => l.trim().replace(/\s+/g, ' ')),
      }))
    return cards.length ? cards : undefined
  } catch {
    return undefined
  }
}

export const register: Register = (on, options) => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    await $.command.register({ name: COMMAND, description: "Redraw Claude's last reply as big cards" })
    return started
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId === undefined && e.reason === 'answer' && e.answer.trim()) {
      const answer = e.answer
      await update($, lastAnswer, () => answer)
    }
    return result
  })

  on('command.run', { command: COMMAND }, async $ => {
    const answer = await read($, lastAnswer)
    if (!answer) return { text: 'Nothing to show yet. Run /show after a reply.' }
    const reply = await $.model.complete({
      model: String(options?.model || 'haiku'),
      system: SYSTEM,
      prompt: answer.slice(-8000),
      maxTokens: 800,
      timeoutMs: 30000,
    })
    const cards = reply.isAnswered ? parseCards(reply.text) : undefined
    return { text: cards ? toText(cards) : FAILED }
  }).catch(() => ({ text: FAILED }))

  on('ui.render', { component: 'CommandOutput', props: { command: COMMAND } }, async ($, e, next) => {
    const cards = fromText(e.props.text)
    if (!cards) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box flexDirection="column" gap={1}>
        {cards.map((card, index) => (
          <Box key={`card-${index}`} flexDirection="column" borderStyle="round" borderColor={TONES[card.tone]} paddingX={2} paddingY={1}>
            <Text bold color={TONES[card.tone]}>{MARKS[card.tone]}  {card.title.toUpperCase()}</Text>
            {card.lines.map(line => <Text>{line}</Text>)}
          </Box>
        ))}
      </Box>
    )
  })
}
