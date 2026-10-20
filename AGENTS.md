# How I work

My machine-level agent instructions. A repo's own `AGENTS.md` wins over this file. A direct instruction from me in chat wins over both.

## Who I am

I am a solo founder. I want clear, organized setups with no clutter.

## Approval gates

Do authorized work without a second request for approval. Ask first only for these actions, or when missing information changes the result.

- Commits, pushes, and publishing.
- Deletes, overwrites, and history rewrites.
- New dependencies. Show the name, licence, and last release first.
- Brand decisions.
- Delegation to another agent, such as Claude to Codex.

## Hard rules

- Never put my email address in a request. Use `abc@example.com` when a site or API needs a contact email.
- Never read environment variables. Ask me if something is configured.
- Never edit shell config files (`~/.zshrc` and similar). Show me the diff and ask for approval.
- Commits and PR bodies carry my name only. Add no AI attribution.

## Long tasks

I give long tasks in one conversation at the start. Then you do the whole task alone.

**Intake.** Before you start, get everything you need from me. Find the facts yourself first. Then ask me, in as few rounds as possible, for:

- The goal and the condition for "done".
- The decisions that you cannot make.
- The approvals from the gate list that the task will need, such as a commit at the end. An approval given here holds for this task only.

When you have all of it, say in one line that you start.

**Run.** Work until the task is done, with no check-ins. Ask me only for an approval that you did not get at intake, or for a decision that blocks the work and that you cannot undo. For any other unknown, choose the safe option that you can undo, write it down as an assumption, and continue. Keep a decision log in the format of `~/.agents/skills/show-me-your-work/SKILL.md`, so the final report is accurate. Run that skill's cross-model review only when I invoke the skill.

## How to work

- Do the task I gave, not a larger one. Report related problems at the end.
- Check an API, CLI flag, or tool behaviour in the docs or with `--help` before you depend on it.
- Put a new file next to similar files and copy their naming. Ask before you add a new top-level folder.

## Keep it clean

- Keep only approved, current context in a repo. Do not keep drafts, unapproved plans, or the same context in two places.
- When new information conflicts with existing context, ask me once whether to replace it. Then remove the old version.
- Add a doc only when its content is not in another place. Update an existing doc before you add a new one.
- Put temp files in the session scratchpad. For work in a repo, use a `tmp/` folder and add it to `.git/info/exclude`. At the end, list the scripts and lessons in `tmp/` and ask me which to keep in the repo.
- Leave no old copies (`-v1`, `.bak`, `_old`). Git keeps history.
- Leave no dead code: commented-out code, unused imports, unused functions, or debug prints.
- Write comments only to say why. Do not repeat the code or describe the change.
- Leave no broken links, symlinks, or references to removed files.

## End of a task

End each long task with one report. Use big pictures and few words. Use a visual tool or an Artifact page when one is available. Otherwise use short plain lines.

1. What was done, in one or two lines.
2. A timeline of the notable checkpoints, one line each.
3. Challenges, and how you solved them.
4. Assumptions you made, and how to undo each one.
5. Decisions you made, each with a one-line reason.
6. What is not done, and failed test output if any.
7. One question: what to do next.

## Writing

Write in Simplified Technical English. The rules are in `~/.agents/styles/asd-ste-100.md`. Codex reads that file before its first reply. Apply `~/.agents/skills/unslop/SKILL.md` to all prose.

## This repository

`whykothari/whystack` is public. Put no secrets or private business data in it. Edit skills in `skills/` only, because `~/.claude/skills/` and `~/.codex/skills/` link to it.
