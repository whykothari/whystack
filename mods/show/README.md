# show

A Claude Code mod. `/show` redraws Claude's last reply as big cards in the transcript.

| Card | Colour | Means |
| --- | --- | --- |
| ✓ DONE | green | finished |
| ○ OPEN | yellow | not done |
| → NEXT | magenta | what you must do or decide |
| ! WARN | red | a risk or an error |
| • INFO | cyan | a fact |

A small model (Haiku by default) sorts the reply into 2 to 6 cards, with at most 3 short lines each. The cards stay in the transcript, and Claude reads them as plain lines.

## Install

```text
/plugin install show --marketplace whykothari/whystack
```

## Settings

| Option | Default | What it does |
| --- | --- | --- |
| `model` | `haiku` | The model that sorts a reply into cards |

## License

[MIT](LICENSE)
