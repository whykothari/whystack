---
name: handoff
description: Write the current session into a short handoff file so a new Claude Code or Codex session can continue the work. Use for /handoff.
argument-hint: "What will the next session do?"
disable-model-invocation: true
---

Adapted from mattpocock/skills handoff (MIT, Matt Pocock). See LICENSE.

Write a handoff file so that a new agent, in Claude Code or Codex, can continue this work without this chat.

## Where

Save it to `~/.local/share/handoffs/<repo-or-folder>-<YYYY-MM-DD-HHMM>.md`. Make the folder if it does not exist. Do not save it in a repo, because some of my repos are public.

## What goes in

- **Goal.** What I want, in one or two lines.
- **State.** What is done, what is in progress, and what is not started. Include uncommitted changes and their paths.
- **Decisions.** What we decided and why, and what I approved. Say which approvals do not carry over, such as commits or pushes.
- **Next step.** The first thing the next agent does.
- **Open questions.** What is still mine to decide.
- **Skills to use.** The skills the next agent loads, by name.

Point to things that already exist instead of copying them: specs, plans, commits, PRs, diffs, docs, and decision logs from `show-me-your-work`. Give the path or URL.

Remove secrets, such as API keys, passwords, and tokens. Remove customer names, emails, addresses, and order details. Refer to an order by its number only.

Keep it short. A new agent reads the whole file before it starts.

## Arguments

If I passed arguments ($ARGUMENTS), they describe what the next session does. Write the file for that task.

## Reply

Give the file path and this line for me to paste into the next session:

Read <path> and continue the work.
