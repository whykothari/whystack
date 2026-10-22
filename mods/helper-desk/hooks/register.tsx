import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Helper, Task } from '../types'

// The band above the prompt follows the main to-do list. The pane has one
// card per subagent ("helper"), live while it runs.

const PANE = 'helper-desk'
const COMMAND = 'helpers'
const BAR = 20
const CARDS_MAX = 8

const tasks = atom({ plugin: 'helper-desk', key: 'tasks' } as const, [] as Task[])
const helpers = atom({ plugin: 'helper-desk', key: 'helpers' } as const, [] as Helper[])
const now = atom({ plugin: 'helper-desk', key: 'now' } as const, 0)

let isPaneOpen = false
// After the person closes the pane, a new helper doesn't open it again.
let isPaneDismissed = false

function bar(done: number, total: number, width = BAR): string {
  const full = total === 0 ? 0 : Math.round((done / total) * width)
  return '█'.repeat(full) + '░'.repeat(width - full)
}

function clock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

async function openPane($: EngineInterface) {
  const opened = await $.ui.open({ id: PANE, title: 'Helpers' })
  isPaneOpen = opened.isPlaced
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    await $.command.register({ name: COMMAND, description: 'Show or hide the Helpers pane: one card per subagent' })
    // Moves the running helpers' clocks; quiet when none runs.
    $.clock.every(1000, () => {
      void (async () => {
        if (!(await read($, helpers)).some(h => h.status === 'running')) return
        const at = await $.clock.now()
        await update($, now, () => at)
      })()
    })
    return started
  })

  on('command.run', { command: COMMAND }, async $ => {
    if (isPaneOpen) {
      await $.ui.close({ id: PANE })
      isPaneOpen = false
      return { text: 'Helpers pane closed.' }
    }
    isPaneDismissed = false
    await openPane($)
    return { text: isPaneOpen ? 'Helpers pane open.' : 'No room for the pane here. Make the terminal wider.' }
  })

  on('ui.close', ($, e, next) => {
    if (e.id === PANE) {
      isPaneOpen = false
      if (e.origin.kind === 'person') isPaneDismissed = true
    }
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    if (e.tool === 'TodoWrite') {
      const list = e.todos.map(t => ({ content: t.content, status: t.status, activeForm: t.activeForm }))
      if (e.agentId === undefined) {
        await update($, tasks, () => list)
      } else {
        const done = list.filter(t => t.status === 'completed').length
        await update($, helpers, all =>
          all.map(h => (h.agentId === e.agentId ? { ...h, todoDone: done, todoTotal: list.length } : h)),
        )
      }
    }
    if (e.agentId !== undefined) {
      const tool = e.tool
      await update($, helpers, all =>
        all.map(h => (h.agentId === e.agentId ? { ...h, tools: h.tools + 1, lastTool: tool } : h)),
      )
    }
    return next(e)
  })

  on('agent.spawn', async ($, e, next) => {
    const started = await next(e)
    if (started.deny !== undefined) return started
    const at = await $.clock.now()
    const helper: Helper = {
      id: started.agentId ?? e.tool_use_id,
      agentId: started.agentId,
      description: e.description,
      type: e.subagentType,
      model: started.model,
      status: 'running',
      startedAt: at,
      tools: 0,
    }
    await update($, helpers, all => [...all.filter(h => h.id !== helper.id), helper].slice(-50))
    await update($, now, () => at)
    if (!isPaneOpen && !isPaneDismissed) await openPane($)
    return started
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    const at = await $.clock.now()
    if (e.agentId !== undefined) {
      const status = e.reason === 'answer' && !e.isAborted ? 'done' : 'failed'
      await update($, helpers, all =>
        all.map(h => (h.agentId === e.agentId ? { ...h, status, endedAt: at } : h)),
      )
      await update($, now, () => at)
    } else {
      // A finished list leaves the band once its turn ends.
      await update($, tasks, list => (list.every(t => t.status === 'completed') ? [] : list))
    }
    return result
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const list = await read($, tasks)
    if (e.props.hasSurvey || list.length === 0) return next(e)

    const { Box, Text, Button } = $.ui.resolve(e)
    const done = list.filter(t => t.status === 'completed').length
    const current = list.find(t => t.status === 'in_progress')
    const running = (await read($, helpers)).filter(h => h.status === 'running').length
    const width = Math.max(8, Math.min(BAR, e.props.bodyColumns - 40))

    return (
      <Box flexDirection="row" gap={1}>
        <Text color="magenta" bold>Tasks</Text>
        <Text color="magenta">{bar(done, list.length, width)}</Text>
        <Text bold>{done}/{list.length}</Text>
        {current ? <Text dimColor wrap="truncate-end">{current.activeForm}</Text> : null}
        {running > 0 ? (
          <Button key="helpers" label={`Helpers ${running}`} onPress={() => openPane($)} />
        ) : null}
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const at = await read($, now)
    const all = await read($, helpers)
    const shown = [...all.filter(h => h.status === 'running'), ...all.filter(h => h.status !== 'running').reverse()].slice(0, CARDS_MAX)
    const width = Math.max(8, Math.min(BAR, e.props.bodyColumns - 20))

    if (shown.length === 0) {
      return <Text dimColor>No helpers yet. Subagents show here while they work.</Text>
    }

    return (
      <Box flexDirection="column" gap={1}>
        {shown.map(h => {
          const color = h.status === 'running' ? 'magenta' : h.status === 'done' ? 'green' : 'red'
          const mark = h.status === 'running' ? '●' : h.status === 'done' ? '✓' : '✗'
          const elapsed = clock((h.endedAt ?? Math.max(at, h.startedAt)) - h.startedAt)
          const progress =
            h.todoTotal !== undefined
              ? `${bar(h.todoDone ?? 0, h.todoTotal, width)} ${h.todoDone ?? 0}/${h.todoTotal}`
              : h.status === 'running'
                ? 'working'
                : bar(1, 1, width)
          return (
            <Box key={h.id} flexDirection="column" borderStyle="round" borderColor={color} paddingX={1}>
              <Text bold wrap="truncate-end">
                <Text color={color}>{mark} </Text>
                {h.description || h.type}
              </Text>
              <Text dimColor wrap="truncate-end">{h.type} · {h.model}</Text>
              <Text color={color}>{progress}</Text>
              <Text dimColor wrap="truncate-end">
                {h.tools} tool calls · {elapsed}{h.lastTool && h.status === 'running' ? ` · ${h.lastTool}` : ''}
              </Text>
            </Box>
          )
        })}
      </Box>
    )
  })
}
