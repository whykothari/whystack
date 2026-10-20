# Slack conversations

## How to search it

Slack MCP tools vary. Read the server's tool list and schema first. The server may need authentication. If authentication fails, stop and report the gap.

1. **Search by person and date.** Messages from the freelancer or the founder around the change date. This narrows the search and often finds the reason fast.
2. **Search by link.** People paste PR links, doc links, and order numbers into chat. Search for the PR number (`/pull/<number>`), the doc title, or the order number.
3. **Search by error string or symptom.** If the code handles an error or a rule reacts to a problem, search for the error text or the customer-facing symptom. Problem threads often show up.
4. **Read the full thread** for every hit.

## Common pitfalls

- **Retention limits.** On a free Slack plan, old messages may be hidden. If nothing appears before a certain date, note the cutoff as a gap.
- **Direct messages.** Many decisions happen in direct messages that may not be searchable. Record this as a known limit.
- **Jokes are not decisions.** "lol just ship it" is not a decision, even if it came before the commit. Look for considered discussion.
- **A single message out of context** can mean something different inside its thread. Always read the thread.
- **Auth failure.** If the server is not authenticated, stop. Do not invent findings. Report that Slack was not searchable.

## What to return

For each relevant thread: channel, date, author, permalink if the tool returns one, and the lines that bear on the question quoted verbatim. Do not copy unrelated messages.
