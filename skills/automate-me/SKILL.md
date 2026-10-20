---
name: automate-me
description: "Use for \"automate me\", \"update my profile\", \"capture how I work\", or when I want agents to follow my working style. Mines my recent Claude Code and Codex sessions, asks me a few questions, then proposes edits to ~/.agents/AGENTS.md and, for longer rules, to the yash-mode skill."
disable-model-invocation: true
---

# Automate me

Adapted from cursor/plugins pstack (MIT, Lauren Tan). See LICENSE.

Turn my working habits into instructions that agents follow. This skill runs the steps in order. It uses the `unslop` skill for prose and a skill-authoring skill (such as `skill-creator`) if one is available.

## Where rules go

- **`~/.agents/AGENTS.md`.** My profile. Claude Code and Codex load it in every session. Put a rule here only if it applies to almost every task and fits in one or two lines. Keep the file short.
- **`~/.agents/skills/yash-mode/SKILL.md`.** Longer rules that apply only to some work, such as subagent habits or review steps. Agents load it on demand. Create it only when there are rules for it.

Both files are in the public repo `whykothari/whystack`. Put no customer data, private business numbers, or secrets in them.

## Flow

### 0. Read what exists

Read `~/.agents/AGENTS.md` and `~/.agents/skills/yash-mode/SKILL.md` if it exists. Find the date of the last edit with `git -C ~/.agents log -1 --format=%cI -- <path>`. Mine only sessions after that date, unless I ask for a full pass.

### 1. Mine my sessions

The sessions are in these places:

- Claude Code: `~/.claude/projects/*/*.jsonl`.
- Codex: `~/.codex/sessions/<year>/<month>/<day>/*.jsonl`.

Split the period into 2 or 3 slices, with enough sessions in each. Give each slice to one subagent (in Claude Code, the `Explore` subagent type). In Codex without subagents, do the slices one after another. Each subagent reads only my messages and the agent replies that I corrected. It returns a short list of patterns, each with a pointer (file and line), not quotes of business content.

Look for these signals:

- Corrections of replies: length, format, tone, and requests such as "say it simpler".
- Approval habits: what I approve without a second look, and what I always want to see first.
- Delegation: when I want subagents, the other agent, or a specific model.
- The meaning of "done": tests, a live check, a review.
- Code and prose rules that I repeat.
- Git habits: commits, pushes, branches.

A pattern counts when it is in 2 or more slices. Drop a pattern that I stated once, or stated once and contradicted later.

### 2. Ask me

Mining misses intent that has not come up yet. In Claude Code, use the AskUserQuestion tool with 1 or 2 multiple-choice questions, 2 to 4 options each. In Codex, ask the same questions in chat. Start broad ("Which areas matter most?"), then ask about the areas I picked. End with one open question for anything the options missed. Do not ask more than 6 questions in total.

### 3. Sort the findings

Group the rules into sections. Use only the sections that have a rule that is not a default. "Communicate clearly" is not a rule. "Recommend one option, with the price" is a rule.

Then put each rule in its file, as described in "Where rules go". If a rule already exists and agents still break it, do not write it again. Tell me, and suggest the `correct` skill to enforce it.

### 4. Draft

Edit the existing files in place. Keep the sections that I have not contradicted. Change a section only when there is new evidence. Add a section only for a new rule.

For a new `yash-mode` skill, use this frontmatter. The description triggers on "yash-mode" and "work in my style", not on general words such as "write code".

```
---
name: yash-mode
description: "Use for /yash-mode or when asked to work in Yash's style. <one line on what it covers>."
disable-model-invocation: true
---
```

### 5. Edit the prose

Apply `unslop` to every line. Show me the draft as a diff and take feedback. Expect more than one round. Cut hard. A profile is not a manual.

### 6. Land it

Ask me before you commit or push, as for any commit.

## Guardrails

- **Do not fit to one conversation.** Need more than one instance before you write a rule.
- **Keep it operational.** No metaphors, no copies of other skills. Point to a skill or file by path instead of pasting it.
- **Add no rule that models follow by default.** Opus 5.5 and GPT-6.1 Sol already check their work and write clearly. Rules for default behaviour cost tokens and add nothing.
- **Use "I" and "me" for the founder in AGENTS.md,** to match the current file.
- **Do not force symmetry.** Skip a section that has no rule.

## Check

The result is subjective. Read it with me: does it sound like me, and did it miss anything? Then land it.

## When not to use

- A skill for one task or one workflow, such as "how I write commit messages". Write a normal skill.
- A rule for one repo. Put it in that repo's `AGENTS.md`.
