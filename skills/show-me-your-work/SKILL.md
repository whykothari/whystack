---
name: show-me-your-work
description: "Keep a decision log for long or unattended work, one row per decision (what, why, evidence, result), so I can review the run after I step away. Use for /show-me-your-work, multi-phase runs, or work I check later."
disable-model-invocation: true
---

# Show me your work

Adapted from cursor/plugins pstack (MIT, Lauren Tan). See LICENSE.

Keep one log per task. I read it after the run to decide whether to trust the result.

## The format

A TSV file with one row per decision. Each cell stays on one line. Evidence is a pointer, not prose.

Start a new log from `references/decision-log-template.tsv`, which holds the header row. The columns are:

- **ts.** ISO 8601 timestamp in UTC (Coordinated Universal Time).
- **phase.** The phase or workstream.
- **decision.** What you chose or did, in one line.
- **why.** The reason, in plain words.
- **evidence.** A path or link that proves it, such as a commit SHA, a PR number, `file:line`, a screenshot path, or a Shopify admin URL. Never a paragraph.
- **result.** The outcome, such as `tests pass`, `reverted`, `order count matches`, `INCONCLUSIVE`, or `open`.

An example. A reviewer must understand each row at a glance.

```
ts	phase	decision	why	evidence	result
2026-10-20T09:02:00Z	frame	counted the products to update first, 412 in 3 collections	wanted the size before a long run	scripts/count.sh output	found 9 products with no SKU
2026-10-20T09:40:00Z	backup	exported all product metafields before any change	so we can restore the old values	backup/metafields-2026-10-20.json	412 products saved
2026-10-20T11:15:00Z	update	changed the size-chart metafield on collection 1	smallest batch first, to check the result before the rest	commit 7c21e0a, storefront screenshot	shows correctly, 0 errors
2026-10-20T12:30:00Z	update	stopped the n8n flow that re-syncs metafields	it overwrote the new values every hour	n8n execution 5531	paused, needs a fix before restart
```

## Log a row

Write each row the way you would tell me what you did. Use plain words and concrete actions. The **unslop** skill applies to log text.

Use `scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>`. It adds the timestamp, writes the header on first use, removes tabs and newlines, and puts a single quote before a cell that starts with `=`, `+`, `-`, or `@`. That stops a spreadsheet from running the cell as a formula. If you append with `printf` instead, handle the same characters.

Log decisions and checkpoints, not every action. Log a choice between options, a finished unit with its test result, a pivot or revert with its cause, a blocker, and a fixed gate. For a loop, log one row per pass. Skip the obvious.

A run is one agent session, with its later turns. A new chat, a resumed session in another tool, or a replacement agent starts a new run. When a run adds to a log that already has rows, its first row has phase `start`. Before it writes, the run reads the last rows to see whether another run wrote since its own last row. If so, it writes a new `start` row. A `start` row names the `ts` range of the earlier rows that this run did not write, and its evidence names this run (tool and session id). Use phase `start` for nothing else.

## Where it lives

The log is a working file. Do not commit it by default. Keep it at `decisions.tsv` in the work folder, or at `.audit/<task-slug>.tsv` when several tasks run at the same time. Add the path to `.git/info/exclude` so git ignores it.

Commit the log only when the work is large enough that I need the trail to trust the result. Ask me first, as for any commit.

## Rules

- Append only. A wrong call gets a new row that replaces it. Never edit or delete a row.
- Prefer evidence from committed scripts over one-off commands, so I can run the check again.

## Check the log against the transcript

At the end of the run, before you hand back, check that the log tells the truth. Read only this session's transcript:

- Claude Code: `~/.claude/projects/<project-folder>/<session-id>.jsonl`, where the project folder is the work folder path with each `/` and `.` changed to `-`.
- Codex: the newest file for this session under `~/.codex/sessions/<year>/<month>/<day>/`.

Do not read other sessions. They hold unrelated private work.

Compare this run's rows with what happened. A run's rows start at its `start` row, or at the first row if this run made the log. They stop at the next `start` row of another run.

- Each row must match a real decision or action.
- Each evidence pointer must resolve and show what the row claims.
- A choice, pivot, or dropped approach that shaped the work but has no row is a gap. Add a row for it.

Fix the log, not the story. Never edit or remove a row, even a wrong one. Add a row that replaces it, with what happened and a pointer that resolves.

## Review by the other model

When you invoke this skill, you approve this one review step by the other agent. Before you hand back, have a model from the other company read the log and the transcript. A self-review does not count.

- In Claude Code, run `codex exec -s read-only -C <work-folder> "<review prompt>"`. It uses GPT-6.1 Sol from the Codex config.
- In Codex, run `claude -p --model claude-opus-5-5 --permission-mode plan "<review prompt>"`.

The review prompt gives the log path and the transcript path, and asks for flags on these points only:

- Decisions with weak or no evidence.
- Checks that the log claims but the transcript does not show.
- Choices that look risky now, such as a premature step, extra scope, or a fix that hides a symptom.
- Gaps that I could miss on a quick read.

The reviewer does not redo the work and does not change files.

End each reply for a run with a log in an "Attention" section. Its first line is `reviewed by <model>`. Then list each flag with the row or moment it points to. "No flags" is a valid result. If the review could not run, say so and give the error.

## Read the log

Read from top to bottom, follow the evidence pointers, and check some of them. GitHub shows a committed TSV as a table. In a terminal, run `column -s$'\t' -t decisions.tsv`.

## Use from other skills

Other skills send their decision trail here. Name this skill and let it own the format. Do not copy the columns into the other skill.
