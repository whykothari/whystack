# whystack

This repository is my dev setup. The README shows how the parts fit.

## Rules

- The repository is public. Put no secrets, tokens, private emails, device paths, or private business data in it. Secrets go in the macOS Keychain.
- Edit agent files in `agents/`. Each Mac links to them, so an edit is live at once.
- Put a new skill in the pack that fits: `core`, `improve`, `research`, or `design`. Ask me before you add a pack.
- Put only keys that I chose in `agents/claude/settings.json` and `agents/codex/config.toml`. Never add machine state such as permissions, project paths, or env.
- Change zsh, git, and the merge rules in `home/`. This is the chezmoi source. Show me a diff before you change a shell file.
- Keep `bin/whystack` compatible with the bash 3.2 that macOS ships.
- After a change, test it in a temporary `HOME`: `HOME=$(mktemp -d) chezmoi init --source "$PWD"`, then `chezmoi apply`.
