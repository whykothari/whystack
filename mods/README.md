# Mods

My mods for Claude Code. Each folder is one plugin. The file `.claude-plugin/marketplace.json` at the root of whystack lists them, so whystack is also a plugin marketplace.

| Mod | What it does |
| --- | --- |
| [blast-radius](blast-radius) | Holds risky shell commands such as `rm -rf`, `git reset --hard` and force pushes. It shows what they would change and waits for Proceed or Cancel. |
| [brain-dump](brain-dump) | Offers to turn a long prompt into a brief in four parts, after up to three questions on what it leaves open. |
| [cache-tax](cache-tax) | `/keepwarm` pings the prompt cache during breaks so it stays warm. It also stops a send to a cold cache once and shows the rewrite cost. The pings cost tokens. |
| [crabwatch](crabwatch) | A progress bar above the prompt and a live panel of subagents with model, context, cost and time. |
| [decision-tree](decision-tree) | When Claude asks you to choose, a side pane explains the choice, recommendation first, and lets you try each option in a forked session. |
| [diagram-pane](diagram-pane) | A side pane that keeps every diagram Claude draws and a live map of the work. |
| [filetree](filetree) | A file tree pane with git status and lines changed. Files Claude reads, writes or commits shimmer. |
| [helper-desk](helper-desk) | A task bar that fills as Claude's to-do list is done, and a Helpers pane with one card per subagent. |
| [replay-theater](replay-theater) | `/replay` steps through the file edits Claude made in the last turn, one diff at a time. |

## Install

In a Claude Code terminal session:

```
/plugin install <mod> --marketplace whykothari/whystack
```

Replace `<mod>` with a name from the table. Answer `y` to add the marketplace, then pick the user scope.

On my own machines, `chezmoi apply` adds the local whystack folder as the marketplace and installs the mods. To do the same by hand, add the folder as a marketplace. Claude Code then reads the mod from that folder, and `/reload-plugins` picks up edits.

```bash
claude plugin marketplace add ~/workspace/whykothari/whystack
claude plugin install <mod>@whystack --scope user
```
