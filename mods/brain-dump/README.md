# brain-dump

A Claude Code mod that turns a long, loose prompt into a clear brief before you send it.

When you send a prompt of 150 words or more, brain-dump asks: "This prompt is long. Make a brief from it first?"

- **Send it now** sends the prompt as you typed it.
- **Make a brief** reads the prompt and asks you up to three questions about what it leaves open or where it contradicts itself. Then it puts a brief in the prompt box, in four parts: Goal, Context, Limits and Done when. Read it, change it if you want, and press Enter.

Nothing goes to Claude until you press Enter on the brief. If brain-dump can't make a brief, it puts your prompt back in the box.

It asks only for prompts that you type or send from the Remote Control app. Slash commands, prompts sent while Claude works, and prompts from other mods pass as they are. A brief that brain-dump made is not asked about again.

## Cost

Each brief uses two Sonnet calls on your account: one for the questions and one for the brief.

## Install

In a Claude Code terminal session:

```text
/plugin install brain-dump --marketplace whykothari/whystack
```

To run a local copy instead, see the [mods README](../README.md#install).

## Credits

Inspired by a mod idea from [Ben AI](https://www.youtube.com/@benai92) on YouTube. The code is new and written for whystack.
