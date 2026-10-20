# Epistemics

How to reason about confidence when evidence is old, partial, and sometimes contradictory, and how to tell the user without turning it into false certainty. Code shows what it does, not why it exists. A price shows what you charge, not why. The why lives in commits, PRs, documents, chat, email, and meeting notes. All of these are incomplete and biased, and some are missing. If you pretend otherwise, you produce confident guesses that mislead the user.

## Confidence tiers

Every claim in the output sits in one tier. The tier sets its section and its phrasing.

### 1. Direct

An explicit written statement answers the question. Someone wrote down why. "The code does X, so the author wanted X" does not count. Examples: a PR description "this fixes the bug where orders over 50 items failed to sync", a code comment "// clamp to 250 because the Shopify API rejects larger pages", a supplier email "we can hold this rate only on orders of 500 units or more", a doc "we chose Courier A over Courier B because B does not cover pin codes in the north-east", a Slack message from the freelancer "switching to polling since the webhook dropped events in testing".

Phrasing: confident, present tense, cited. "This exists because X."

### 2. Supported

Several pieces of indirect evidence agree on one conclusion. No single source states it, but the pattern makes it likely. Examples: the price changed the same week a supplier emailed a cost increase, and the price sheet has a new margin column. Or the tests added with a change all use very large orders. Or three emails from the same month all name the same courier problem.

Phrasing: confident but clearly derived, citing each item. "The evidence points strongly to X: [the specific items]."

### 3. Inferred

A reasonable reading of the context that nothing explicitly supports. It is your interpretation, not a fact from the record. Example: the commit gives no reason, but a customer complaint arrived that morning and the fix merged the same day, so it was likely a hotfix. Or the retry count of 3 matches the 3-retry pattern in other n8n flows.

Phrasing: hedged, with the chain explicit. "Given A and B, C seems likely because D."

### 4. Speculative

A plausible hypothesis on thin evidence, where other explanations fit equally well. Present it, because the user may know which is right, but mark it as a guess. Example: "This may be a workaround for a Shopify bug that has since been fixed, but we found no evidence from that time." Or "The price may match a competitor's, but no document mentions a competitor."

Phrasing: "One possibility is X, but we have no direct evidence." Usually goes in Competing hypotheses.

### 5. Unknown

You looked and could not find out. This is a valid, important result. Document it.

Phrasing: "We searched X, Y, and Z and found no evidence of why." Say what you searched. "We could not find out" is less useful than "We searched Gmail for the supplier's domain and 'quote' from January to March 2025, read the 4 commits that touched this file, and searched the price sheet history. None gave a reason."

## Phrasing guide

**Confidence words** claim Direct or Supported evidence and need a citation next to them. Never use them for inferences: "because", "the reason is", "was designed to" (claims intent), "fixes" or "solves" (claims the change worked), "we decided" (claims a decision happened).

**Hedges** signal interpretation. Use them in What we can reasonably infer: "appears to", "seems to", "likely", "suggests", "is consistent with", "one reading is", "may have been", "the evidence points toward".

**Words to avoid:**

- "obviously". If it were obvious, the user would not ask.
- "clearly". It usually comes before a claim that is not clear.
- "of course". Same.
- "just" (as in "it's just for performance"). It dismisses and hides uncertainty.
- "I think" or "I believe". You are reporting evidence, not opinion. Say "the evidence suggests".

## Avoid rationalization

A decision that makes sense today may have been made for reasons that no longer apply, or that were wrong at the time. Do not fit a clean reason onto messy history. Do not assume the author or the founder did the "right" thing and work backward. Do not assume a consistent pattern was intentional when it may be copy-paste. Do not turn an absence of evidence into evidence of absence ("no email mentions quality, so quality was not a concern").

## The sycophancy trap

Users often embed a guess: "Why do we use this supplier, I assume because they were cheapest?" Do not simply confirm it. The guess is a prompt to investigate, not a conclusion to approve. Treat it as one candidate among others and check the evidence on its own. If the evidence supports it, say so with citations. If not, say so, and show what the evidence does support.

## When evidence contradicts

Show both sources with citations. Do not pick the one that makes a tidier story. Example: the supplier email says "price includes freight" and the price sheet adds a freight line. Both may be true at different dates, or one may be wrong. Let the user decide.

## When evidence is missing

An honest "we don't know" is one of the most useful outputs. The user learns the answer is not in the obvious places, that they need to ask someone (a freelancer, a vendor, their own memory), or that the question is not worth more time. If you fill a gap with a confident guess, you harm the user, because they will act on the guess. Name each gap: the question, the sources searched, the search terms used in each, and what you found.

## Before finalizing

The synthesizer checks every claim in What we found and What we can reasonably infer. Each claim has a citation or moves to Inferred or Competing hypotheses. Its phrasing matches its tier. It does not use code or a current value as evidence of its own intent. The output has a What we don't know section. If it lists no gaps, be suspicious. Either the evidence was unusually complete or something is hidden.
