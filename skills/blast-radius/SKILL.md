---
name: blast-radius
description: "Find what a change could break outside the diff before it ships, and prove the one fact that makes it safe by running real code, not by writing about it. Covers code, Shopify themes and metafields, n8n workflows, and scripts. Use for 'blast radius of X', 'what could this break', or a small change you do not trust."
disable-model-invocation: true
---

# Blast radius

Adapted from cursor/plugins pstack (MIT, Lauren Tan). See LICENSE.

Find what a change breaks somewhere else, before it ships. `how` says what the thing does. `why` says why it has this shape. `blast-radius` says what the change breaks elsewhere.

A list of callers is not the job. Grep finds those in a second. The job is the breakage that grep does not show.

## Do not trust your own writeup

A writeup that sounds right has no value by itself. It sounds the same whether it is true or not. Find the one or two facts that the change's safety depends on, and prove them by running something.

### How sure you are

For each fact, go as far down this list as is cheap, and say where you stopped.

1. You said so. This has no value by itself.
2. You pointed at the line: a real `file:line`, the library source, or the workflow node.
3. You showed that the bad case cannot happen. You followed the failure step by step and it does not get there.
4. You ran it. A script or test calls the real code and fails loudly if you are wrong.
5. You reproduced it in the running system, on a development theme, a test store, or a copy of the n8n workflow.

Step 4 is usually one small script that calls the exact function, API, or query that you are worried about.

Never prove a fact with a write to the live store, a live workflow, or real customer data. Use a development theme, a test store, a copy of the workflow, or a read-only call. If proof needs a live write, stop and ask me.

## Steps

1. **Read the change.** Read the diff and the symbols, files, nodes, or settings that it adds, changes, or deletes. Find what the change now does differently, including the part that the diff does not show. Use step 2 of the `why` skill to pull the PR and commits.
2. **Find the one fact that makes it safe.** Most changes that look risky are safe because of one fact, such as "this metafield is only read by the product template". If that fact holds, most risks are cleared at once. Spend your time here, not on a long list of maybes.
3. **Look where grep stops.** Check these places:
   - The library or app source, its pinned version, and any local patch.
   - The Shopify API version, and every reader of a metafield, tag, or setting: the theme, apps, n8n flows, and scripts.
   - Theme sections and snippets that other templates also use.
   - Webhooks and their retries, n8n node order and error branches, and scheduled runs.
   - The columns that a flow reads from a Google Sheet, JSON field names, and email or CSV formats that another system parses.
   - Code or flows two or three steps downstream.
4. **Be honest about each risk.** Give it a real chance and a real cost. Keep the risks you confirmed. List the ones you checked and cleared in a separate list. The `why` rules apply: cite a real `file:line` or node, treat an empty search as an answer, and never invent a caller or an API.
5. **Prove the one fact.** Write a script or test that runs the real code, run it, and paste the output.
6. **For a large or wide change, get a second model.** When you invoke this skill, you approve this one handoff. In Claude Code, run `codex exec -s read-only -C <repo> "<question>"`. In Codex, run `claude -p --model claude-opus-5-5 --permission-mode plan "<question>"`. Ask the same question, then merge the answers. Different models find different real bugs.

## What to hand back

- **What it does.** What changed, including the part that is not obvious.
- **The one fact that makes it safe.** State it, say which step of the list you reached, and show the proof. If you could not prove it, write "unproven".
- **Risks.** For each, say how it breaks, the `file:line` or node, how likely and how bad, and how to check. Paste the proof for the ones that matter.
- **Cleared.** What you checked and why it is fine.
- **Before you ship.** The cheapest test or repro that catches the real bug, with the script you wrote.

Apply `unslop`. Cite real code. Remove customer data and anything private before the text goes anywhere public.
