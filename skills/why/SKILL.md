---
name: why
description: "Use for 'why does X work this way', 'why did we pick Y', 'why is this price or threshold N', regressions, postmortems, and the reasons behind code, automations, suppliers, and prices. Finds the connected MCP servers and searches each relevant evidence category (source control, long-form documents, team chat, email, meeting notes, store and business data), then returns a cited answer that separates what the record says from what is inferred."
disable-model-invocation: true
---

# Why

Adapted from cursor/plugins pstack (MIT, Lauren Tan). See LICENSE.

Find the motivation behind a decision. The target can be code (a function, a constant, an n8n flow, a script) or a business decision (a supplier, a price, a shipping rule, a discount policy). `why` answers which forces gave the target its current shape. It does not explain what code does at runtime.

## Operating posture

Work as a careful, precise investigator. Keep what you know apart from what you infer. Read `references/epistemics.md` for the confidence tiers and phrasing rules. The synthesizer must follow them.

Every investigator is read-only. Do not send, draft, label, or archive email. Do not post to chat, edit documents, or change store data. Email and chat hold private data about customers, freelancers, and vendors. Quote only the lines that bear on the question, and never send any content to an external service.

## Step 1. Understand the target and the question

The target is a piece of code, a pattern, an automation, or a named business decision. The question is usually a rationale, a tradeoff, an edge case that forced a change, an external constraint (a platform rule, a vendor term, a tax rule), dead code, or a history sweep.

If the target is vague ("why do we do it this way?"), make your best guess from the conversation: open files, recent edits, what was just discussed. State your reading in one line so the user can correct it, then continue.

## Step 2. Build the anchor

Build the seed context inline before you spawn anyone. Every investigator and the synthesizer gets it.

When the target is code:

- File paths, line ranges, and key symbols (functions, constants, n8n node names).
- `git blame -L <start>,<end> <file>` for last-touch commits.
- `git log --oneline -20 -- <file>` and `git log --follow -p -- <file>` for history through renames.
- PR numbers from commit subjects (pattern `(#1234)`), then `gh pr view <number> --json title,body,author,createdAt,mergedAt,comments,reviews`.

When the target is a business decision:

- The decision in one sentence ("we buy packaging from Supplier A", "the base price of SKU X is 1,499").
- The date range when it likely started or changed. Use what the user says, file dates, or the first order at the new price.
- The people involved: vendors, freelancers, platform support, customers.
- Related files: config, price sheets, product records, the n8n workflow JSON.
- Search terms: names, SKUs, order numbers, invoice numbers, amounts.

Many targets are both. A shipping rule in code points at a decision made in email. Build both halves when they apply.

## Step 3. Pick the categories and spawn investigators

### Discovery

List the MCP tools you can call. In Claude Code, read them from your tool list, including deferred tools that a tool search can load. In Codex, read the MCP servers in your session. Map each server to one category below. Source control is always available through `git` and `gh`.

| # | Category | Typical tools | Best at |
|---|---|---|---|
| 1 | Source control | git, `gh`, code comments, tests | Rationale captured at build time, in commits, PRs, and comments. Always on. |
| 2 | Long-form documents | Google Drive, Docs, Slides, Claude Docs | Plans, briefs, supplier comparisons, and specs written before the decision. |
| 3 | Team chat | Slack | Quick back-and-forth with freelancers that never reached a doc. |
| 4 | Email | Gmail | Vendor quotes, freelancer briefs, customer complaints, platform-support replies. For a solo founder this is often where the decision lives. |
| 5 | Meeting notes | Granola, Google Calendar for dates | What was said on calls with suppliers, freelancers, or advisers. |
| 6 | Store and business data | Shopify (orders, products, `run-analytics-query`), Google Sheets | The numbers behind a price, threshold, stock rule, or discount. |

To add a category, connect the new tool (for example an issue tracker), add a row here, write a playbook under `references/sources/`, and list it in `references/source-playbook.md`.

### Which categories to run

Spawn an investigator for a category only when its MCP is available and it could plausibly hold evidence for this question. Source control always runs when the target touches code. Each skipped category needs a written reason in Sources Consulted. Valid reasons:

- No MCP is connected. This is a gap, not a choice: "Team chat skipped. Slack is not connected, so the chat record was not searchable."
- The source cannot hold the answer, with the reason stated: "Store data skipped. The question is about a CI (continuous integration) config with no store effect."

"Probably not useful" is not a reason. When unsure, run it.

### Small questions

If the anchor already answers the question in one commit, PR, or email thread, answer inline without investigators or a synthesizer. Use the same output structure in short form. List the categories you skipped and why.

### How to spawn

Each investigator owns one category. Do not give one investigator two categories.

- **Claude Code.** Spawn one `general-purpose` subagent per category with the Agent tool, all in one message so they run in parallel. Do not set a model. Investigators inherit the session model.
- **Codex.** If your session can spawn subagents, spawn one per category in parallel. If not, run the categories one after another yourself. Finish each one and write down its findings in the investigator output format before you start the next, so one source does not color how you read another.

Each investigator prompt is `references/investigator-prompt.md` filled in, plus:

- The category playbook from `references/sources/` (index in `references/source-playbook.md`).
- `references/sources/incident-postmortem.md` if the target looks defensive or reactive: retries, timeouts, null checks, rate limits, a manual override, an n8n branch that skips a case, or a business rule added after something went wrong (a refund policy, an order cap, a blocked region).
- The anchor and the user's original question.

## Step 4. Synthesize

Spawn one synthesizer with the strongest model available. In Claude Code, set `model: "opus"` on the Agent tool call, which is Opus 5.5 in this setup. In Codex, use the session model, or the strongest model your subagent settings offer. If you ran the categories yourself, do the synthesis yourself in a separate pass.

The synthesizer gets:

1. All investigator findings, including empty results and skipped categories with reasons.
2. The anchor.
3. The user's original question.
4. `references/epistemics.md`.
5. `references/synthesizer-prompt.md`.

## Step 5. Present

Show the synthesizer's output to the user. You may edit lightly for clarity or add context from the conversation. Do not rewrite the confidence language.

## Output format

Use the structure in `references/synthesizer-prompt.md`: The question, The target, What we found, What we can reasonably infer, Competing hypotheses, What we don't know, Sources consulted, Confidence summary. Keep the confidence tiers apart. Sources consulted has one line per category, including empty and skipped ones, with the reason.

If the user asks "why" because they plan to change the target, end with a constraint set for the change:

- **Preserve.** What the evidence says must stay true.
- **Change.** What the original reason no longer requires.
- **Avoid.** Approaches the record shows were tried or rejected.
- **Risk.** What could break, and who would notice (customers, a vendor, a freelancer, the store's numbers).

## Failure modes to avoid

- **Recency bias.** The newest commit or email is not the whole story. The current shape often comes from many earlier decisions. Trace back.
- **Code as motive.** Code shows mechanics, not motivation. A constant of 1,499 tells you the price, not why it is the price.
- **Confirming the user's guess.** "I assume we picked them because they were cheapest?" is one hypothesis. Check it against the record like any other.
