---
name: reflect
description: Start three review subagents on the current session, find what to learn from it, and turn each learning into a concrete edit to an existing skill or to AGENTS.md. Use for /reflect or when I say reflect.
disable-model-invocation: true
---

# Reflect

Adapted from cursor/plugins pstack (MIT, Lauren Tan). See LICENSE.

Find the lasting lessons in the current session, then turn them into skill edits.

Skip a session that is trivial, off-topic, or that followed an existing skill correctly. A one-off is not a lesson.

## 1. Find this session's transcript

Read only this session's transcript. Other sessions hold unrelated private work.

- Claude Code: `~/.claude/projects/<project-folder>/<session-id>.jsonl`. The project folder is the work folder path with each `/` and `.` changed to `-`. Subagent transcripts are in `<session-id>/subagents/`.
- Codex: `~/.codex/sessions/<year>/<month>/<day>/*.jsonl`.

List the newest files with `ls -t <folder>/*.jsonl | head -5`. Take the file whose first user message matches this session's first prompt. If none matches, write a short digest of the session and pass that instead.

## 2. Start three reviewers at the same time

Each reviewer gets its template from `references/` with the transcript path or digest filled in. Reviewers are read-only. They can use MCP tools to look up what the transcript cites, but they never send, post, or change anything.

| Lens | Who runs it | Template |
|---|---|---|
| Judgment | A general-purpose subagent on the session model | `references/judgment-reviewer.md` |
| Tooling | The other company's model | `references/tooling-reviewer.md` |
| Divergent | A general-purpose subagent on the session model | `references/divergent-reviewer.md` |

For the tooling lens, a different model finds different facts. When you invoke this skill, you approve this one handoff.

- In Claude Code, run `codex exec -s read-only "<filled template>"`.
- In Codex, run `claude -p --model claude-opus-5-5 --permission-mode plan "<filled template>"`.

In Codex without subagents, run the judgment and divergent lenses yourself, one after another.

## 3. Combine

Give `references/synthesizer.md` to one general-purpose subagent, with each reviewer's full output in its place. In Claude Code, use Opus. It returns an Accepted / Rejected / Backlog list.

## 4. Check for a mechanism

Move each Accepted item to Backlog when a lint rule, script, hook, or runtime check can enforce it better than prose.

## 5. Apply

Show me the full Accepted / Rejected / Backlog output. Wait for my approval before you apply an Accepted edit. I pick the rows and can change where they go. A skill change affects every future session, so do not apply edits without approval.

For the Backlog, list each item and suggest the `correct` skill to build the mechanism. Do not build it in this run.

Follow the routing of each approved row:

- **A small edit to an existing skill,** such as one bullet, a tighter sentence, or a fixed stale fact. Make it yourself.
- **A large edit,** such as a new section or more than about 10 lines. Use the `skill-creator` skill if it is available, and run its draft and test loop.
- **`tune description: <skill path>`.** The skill exists but did not trigger when it should have. Use `skill-creator` to improve the description.
- **`new skill via skill-creator: <kebab-name>`.** Create it with `skill-creator`. Do not invent the shape.
- **A rule about how I work in general.** Route it to `~/.agents/AGENTS.md` through the `automate-me` skill.

Edit skill sources in `~/.agents/skills/` only. The folders in `~/.claude/skills/` and `~/.codex/skills/` are links to them. Ask me before you commit.

## 6. Summary

A short list, with no preamble:

- Edits made: `<skill path>`, with one line on what changed.
- New skills: `<skill path>`, one line each. This is rare.
- Backlog: one line per item, with the mechanism to build.
- Dropped: one line per rejected finding, with the reason from the synthesizer.
