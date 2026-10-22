# Source playbooks

The why skill spawns one investigator per relevant category. Each investigator reads one playbook below. Tool names in the playbooks come from the MCP servers connected in this setup. If a tool name has changed, read the server's tool list and use the closest match.

| Category | Playbook | Tools it covers |
|---|---|---|
| Source control | [`code-archaeology.md`](./sources/code-archaeology.md) | git, `gh`, code comments, tests, n8n workflow exports in the repo |
| Long-form documents | [`google-drive.md`](./sources/google-drive.md) | Google Drive, Docs, Slides, Claude Docs |
| Team chat | [`slack.md`](./sources/slack.md) | Slack |
| Email | [`gmail.md`](./sources/gmail.md) | Gmail |
| Meeting notes | [`granola.md`](./sources/granola.md) | Granola, Google Calendar for dates |
| Store and business data | [`shopify.md`](./sources/shopify.md) | Shopify, Google Sheets |

Cross-cutting:

- [`incident-postmortem.md`](./sources/incident-postmortem.md). Add it when the target looks defensive or reactive: retries, timeouts, null checks, rate limits, manual overrides, an n8n branch that skips a case, or a business rule added after something went wrong.

To add a category for a new tool (for example an issue tracker), write `sources/<tool>.md` with the same sections as the others (what it holds, how to search it, good evidence, pitfalls, what to return), add a row here, and add the category to the table in `SKILL.md`.
