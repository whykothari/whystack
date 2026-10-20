---
name: correct
description: "Find the mistakes that agents repeat in this repo and make each one impossible. Try structure first, then types, then a check whose error names the fix, then a test or hook, and write rules last. Prove each check fails on a real past mistake. Use for /correct, or after I correct an agent for the same mistake twice."
disable-model-invocation: true
---

# Correct

Adapted from cursor/plugins pstack (MIT, Lauren Tan). See LICENSE.

I keep correcting agents in this repo for the same mistakes. Change the repo so the next agent cannot make them.

Assume every contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that works. Design the repo so that a change that looks right in one file is right for the whole repo.

## Find the mistake classes

Read these sources first:

- Recent commits and reverts (`git log`, `git log --grep=revert -i`).
- PR review comments (`gh pr list --state merged`, `gh pr view <n> --comments`).
- The repo's `AGENTS.md` and `CLAUDE.md`, and comments that explain workarounds.
- Past agent sessions for this repo, where I corrected the agent. In Claude Code they are in `~/.claude/projects/<project-folder>/*.jsonl`, where the project folder is the repo path with each `/` and `.` changed to `-`. In Codex, search `~/.codex/sessions/` for sessions whose working folder is this repo. Read only sessions for this repo.

Group the mistakes into classes. A class counts when it happened twice.

## Fix each class at the highest level that works

1. **Remove it with structure.** Give each piece of state one owner and each task one supported way. Hide internals so a wrong import fails. Replace lists that people keep in sync by hand with one source. Delete old ways and dead code that an agent could copy. For an n8n flow, use one shared sub-workflow instead of copies.
2. **Block it with types.** Make the bad state impossible to write. If bad code still compiles, add a lint or script check whose error names the file, type, or function to use instead. If the bad pattern is already common, fail only when a change adds more of it.
3. **Test the behaviour, or add a hook.** Fix or delete a test that still passes when its behaviour breaks, or that fails when only internals change. For an agent action that must never happen, such as an edit to a generated file, a Claude Code or Codex hook is a hard block.
4. **Write a rule in `AGENTS.md` last, and only for a judgement call.** Nothing fails when an agent skips a rule.

## Fix and prove

Fix the most frequent classes first. Prove that each new check fails on a real past mistake, for example by running it on the commit before the fix. Run the same command locally and in CI if the repo has CI. If not, add it to the repo's test or check script.

Put each exception on the line it affects, with a reason and an expiry date. I approve each exception.

Plan one commit per class. Ask me before you commit, as for any commit.

## Keep the rule table

Keep a table in the repo's `AGENTS.md` that pairs each rule with what enforces it. When I correct you, fix the mistake and add the rule. If the rule was already there and nothing enforces it, that is a repeat. Fix it at the highest level in the same change. Remove a rule when its mistake can no longer happen.

## Reply

For each class, give the evidence, the level you picked, and why a higher level did not work.
