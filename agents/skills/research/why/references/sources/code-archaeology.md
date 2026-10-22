# Code archaeology (git and in-repo)

## What this source holds

- Commit history: messages, dates, authors, diffs
- PR descriptions, review comments, and discussion (through `gh`)
- Inline comments, TODOs, FIXMEs, deprecation notes
- Decision records or notes in the repo (`docs/`, `AGENTS.md`, README files)
- Tests, whose names and assertions often record the edge case that forced a change
- Files changed in the same commits (co-change signal)
- CHANGELOG entries and release notes
- n8n workflow JSON exports, Shopify theme files, and scripts kept in the repo

This source is tied directly to the code, so it is the most trustworthy. In a solo repo, commit messages are often short. An empty PR body is common and is a gap, not a reason.

## How to search it

Expand the seed commit list:

```bash
# History through renames
git log --follow --oneline -- <file>

# Pickaxe: commits that added or removed this exact text
git log -S '<exact_string_from_code>' -- <file>

# Or for patterns
git log -G '<regex>' -- <file>

# Who wrote each line and when
git blame -L <start>,<end> <file>

# One commit's full diff
git show <hash>

# Commits between two points that touch this file
git log <old>..<new> -p -- <file>
```

Look for notes outside the code:

```bash
# Decision notes in markdown
rg -l -i '(decision|decided|because|why)' --glob '*.md'

# TODOs and FIXMEs near the target
rg -n -C2 '(TODO|FIXME|HACK|XXX|NOTE)' <target_file>

# Related tests
rg -l '<symbol>' --glob '*test*'
```

For an n8n workflow export, search node names and the `notes` field of each node. The founder or a freelancer may have left a reason there. Use `git log -p` on the JSON file to see when a node or condition first appeared.

## Common pitfalls

- **Squash merges.** A squashed commit may hide the step-by-step history. Check the PR for the original commits.
- **Bulk commits.** "Update files" or "wip" commits change many things at once. Do not assume every change in them had the same reason.
- **Freelancer handoffs.** Code a freelancer delivered may arrive in one commit with no history. Record the author and date, and add a lead for the email or chat investigator to look for the brief.
