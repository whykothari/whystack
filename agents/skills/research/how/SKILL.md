---
name: how
description: "Use for \"how does X work\", a walkthrough before I change something, and \"where should this live\" questions. Covers code, n8n workflows, Shopify theme and store setup, and scripts. Explains the parts, the runtime flow, and where things live. Use why for the reasons behind a decision."
disable-model-invocation: true
---

# How

Adapted from cursor/plugins pstack (MIT, Lauren Tan). See LICENSE.

Answer "how does X work?" for me. I am a solo founder who builds and maintains this software. Give me enough to change the thing safely, not an annotated copy of the source.

X can be code in a repo, an n8n workflow, a Shopify theme or app setting, or a script. Read the real thing. For n8n, read the workflow JSON or use its REST API. For Shopify, read the theme files or query the Admin API. Do not explain from memory.

All helpers are read-only. They do not edit files, run writes against an API, or change a workflow.

## 1. Size the question

If the scope is unclear, state your reading in one line and continue. I can redirect you.

- **Small.** One module, one workflow, one function, or a narrow question. Do it yourself in one pass with `references/explainer-prompt.md`, without the explorer findings part. Go to step 4.
- **Large.** A flow across several files, workflows, or services, or a full overview. Go to step 2.

When in doubt, take the small path.

## 2. Explore (large only)

Split the question into 2 to 4 angles. Each angle is a separate slice, for example "order webhook to n8n" and "n8n to the Google Sheet". Start one explorer per angle, all at the same time, each with `references/explorer-prompt.md` filled in.

- In Claude Code, use the Agent tool with the `Explore` subagent type. It is read-only.
- In Codex, use subagents if they are available. If not, do the angles one after another yourself.

Explorers use the session model. Do not set other model ids.

## 3. Combine (large only)

When all explorers return, write the explanation yourself with `references/explainer-prompt.md` and all explorer findings. In Claude Code you can give this step to one general-purpose subagent with Opus 5.5 instead, to keep the main context small.

## 4. Present

Give me the explanation. Small edits for clarity are fine. Do not rewrite it.

Follow the active output style for chat replies. If it asks for plain text, show a flow as a picture in a visual tool or an Artifact page when one is available. Otherwise write one step per line, in order.

## Output format

Use the sections in `references/explainer-prompt.md` and drop any that do not apply: Overview, Key parts, How it works, Where things live, Gotchas.
