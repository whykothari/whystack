import type { EngineInterface, PromptSubmitInput, Register } from 'claude-code'

// A long prompt typed in one go (often dictated) gets an offer before it is
// sent: a few questions on what it leaves open, then a brief in four parts in
// the prompt box. The person reads the brief and sends it with Enter.

const MIN_WORDS = 150
const MODEL = 'sonnet'
const MAKE = 'Make a brief'
const SEND = 'Send it now'
const SECTIONS = ['Goal', 'Context', 'Limits', 'Done when'] as const
// A brief this mod wrote ends with this section, so sending it asks nothing.
const LAST_HEADING = `## ${SECTIONS[SECTIONS.length - 1]}`

const QUESTIONS_SYSTEM = `You read a long, loose request that a person wrote for an AI coding agent.
Find at most 3 points where the request is unclear, leaves a choice open, or contradicts itself, and where the answer changes the work.
Skip points the agent can find out by itself from the code or the files.
For each point, write one short question and 2 to 4 short answers the person is likely to pick.
Reply with JSON only, no other text, in this shape:
{"questions":[{"question":"...?","header":"max 12 chars","options":["...","..."]}]}
If nothing important is unclear, reply {"questions":[]}.`

const BRIEF_SYSTEM = `You turn a long, loose request into a clear brief for an AI coding agent.
Keep every fact, name, path and number the person gave. Add no new requirements.
Use the person's answers to settle the open points.
Write plain, short sentences. Use exactly these four Markdown headings, in this order:
${SECTIONS.map(s => `## ${s}`).join('\n')}
Goal: what to do, in one to three sentences.
Context: why it matters and what the agent must know.
Limits: what not to touch, what to keep, what to ask about first.
Done when: checks that show the work is finished.
Reply with the brief only.`

type Question = { question: string; header?: string; options: string[] }

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

function isCandidate(e: PromptSubmitInput): boolean {
  return (
    (e.origin?.kind === 'composer' || e.origin?.kind === 'bridge') &&
    e.command === undefined &&
    e.isMeta === undefined &&
    e.turnId === undefined &&
    wordCount(e.text) >= MIN_WORDS &&
    !e.text.includes(LAST_HEADING)
  )
}

/** The model's questions, cut to what the dialog takes; none when the reply can't be read. */
function parseQuestions(reply: string): Question[] {
  const json = reply.slice(reply.indexOf('{'), reply.lastIndexOf('}') + 1)
  try {
    const list: unknown = JSON.parse(json).questions
    if (!Array.isArray(list)) return []
    return list
      .filter((q): q is Question => typeof q?.question === 'string' && Array.isArray(q.options))
      .slice(0, 3)
      .map(q => ({
        question: q.question.trim().endsWith('?') ? q.question.trim() : `${q.question.trim()}?`,
        header: typeof q.header === 'string' ? q.header.slice(0, 12) : undefined,
        options: q.options.filter(o => typeof o === 'string' && o.trim() !== '').slice(0, 4),
      }))
      .filter(q => q.options.length >= 2)
  } catch {
    return []
  }
}

async function askQuestions($: EngineInterface, text: string): Promise<string[]> {
  const found = await $.model.complete({ model: MODEL, system: QUESTIONS_SYSTEM, prompt: text, maxTokens: 800, timeoutMs: 60_000 })
  if (!found.isAnswered) return []
  const answers: string[] = []
  for (const q of parseQuestions(found.text)) {
    // A dismissed question is left open; the brief says so in Limits.
    const answer = await $.ui.ask(q.question, { options: q.options, header: q.header }).catch(() => null)
    answers.push(`Q: ${q.question}\nA: ${answer ?? '(not answered)'}`)
  }
  return answers
}

async function writeBrief($: EngineInterface, text: string, answers: string[]): Promise<string | null> {
  const prompt = answers.length === 0 ? text : `${text}\n\nThe person's answers:\n\n${answers.join('\n\n')}`
  const brief = await $.model.complete({ model: MODEL, system: BRIEF_SYSTEM, prompt, maxTokens: 2000, timeoutMs: 90_000 })
  return brief.isAnswered && brief.text.includes(LAST_HEADING) ? brief.text.trim() : null
}

// The box empties when the dropped prompt leaves it, so the fill waits a moment.
function fillLater($: EngineInterface, text: string, note: string) {
  void (async () => {
    await $.clock.sleep(300)
    const filled = await $.prompt.fill({ text }).catch(() => ({ isFilled: false }))
    if (filled.isFilled) {
      $.ui.toast(note)
    } else {
      $.ui.log(`brain-dump could not fill the prompt box. The text:\n\n${text}`)
    }
  })()
}

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    if (!isCandidate(e)) return next(e)

    const choice = await $.ui
      .ask('This prompt is long. Make a brief from it first?', { options: [MAKE, SEND], header: 'Brain dump' })
      .catch(() => SEND)
    if (choice !== MAKE) return next(e)

    $.ui.status('brain-dump: reading your prompt')
    try {
      const answers = await askQuestions($, e.text)
      $.ui.status('brain-dump: writing the brief')
      const brief = await writeBrief($, e.text, answers)
      if (brief === null) {
        fillLater($, e.text, 'Could not make a brief. Your prompt is back in the box.')
        return { drop: 'brain-dump could not make a brief, so it put your prompt back.' }
      }
      fillLater($, brief, 'The brief is in the prompt box. Check it, then press Enter.')
      return { drop: 'brain-dump made a brief from this prompt.' }
    } finally {
      $.ui.status(undefined)
    }
  }).catch(($, e, next) => next(e))
}
