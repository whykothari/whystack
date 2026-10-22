# helper-desk

A Claude Code mod that shows how far Claude is with its to-do list and what each subagent does.

- **Task bar**: above the prompt, a bar fills as Claude marks items done on its to-do list. It shows the count, such as `3/5`, and the item in progress. When all items are done, the bar goes away at the end of the turn.
- **Helpers pane**: one card per subagent, with its task, type, model, time, tool calls and its last tool. When the subagent keeps its own to-do list, the card shows a progress bar for it. The pane opens when the first subagent starts. `/helpers` shows or hides it. After you close it, it stays closed until you run `/helpers`.

The **Helpers** button on the task bar opens the pane while subagents run.

## Notes

- The band above the prompt holds one mod at a time. crabwatch, cache-tax and replay-theater also draw there, so only one of them shows.
- crabwatch has a fuller agents panel, with context, cost and savvy-flow progress. helper-desk is the light version for any to-do list.

## Install

In a Claude Code terminal session:

```text
/plugin install helper-desk --marketplace whykothari/whystack
```

To run a local copy instead, see the [mods README](../README.md#install).

## Credits

Inspired by a mod idea from [Ben AI](https://www.youtube.com/@benai92) on YouTube. The code is new and written for whystack.
