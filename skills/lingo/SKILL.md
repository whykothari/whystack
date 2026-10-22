---
name: lingo
description: "Rewrite my prompt in the words that people in the task's industry use, show the rewrite, then do the task with it. Use for /lingo, when I ask for industry terms or jargon, and on your own when a task clearly belongs to one industry or function (software, data, product, design, marketing, sales, customer success, finance, accounting, legal, operations, HR, e-commerce) and my prompt uses generic words. Builds a new industry dictionary from textbooks, standards, and docs on /lingo or when I ask. Skip quick questions and tasks with no industry."
---

# Lingo

I write prompts in generic words. Practitioners use exact terms. An exact term tells an agent which method, metric, standard, or deliverable shape to use, so the output reads like work from a senior person in that field.

This skill turns my prompt into the trade's words, with a dictionary for each industry as the source of truth.

## When to use it

- I type `/lingo`, or I ask you to use industry terms.
- On your own, when the task makes a deliverable for one field, such as a sales sequence, a financial model, a PRD (product requirements document), a campaign brief, or a contract review, and my prompt uses generic words.

Do not use it for a quick question, a one-line edit, or a task that has no industry. Do not use it when my prompt already uses the right terms.

## 1. Find the industry

Read `references/dictionaries/index.md`. Match the task to one primary industry by the nature of the task, not by one trigger word. When two rows fit, pick the one whose dictionary has the deliverable in its "Deliverable shapes". Add one secondary industry only when the task needs terms from a second field, for example "pricing page copy" is marketing plus e-commerce.

A match is weak when the dictionary has no shape for the deliverable and few of its terms fit. Then state your reading in one line and continue.

## 2. Load the dictionary

Read `references/dictionaries/<slug>.md`. For a long file, read the sections that fit the task.

- **A term is missing.** Use the term that a practitioner would use and mark it `(not in dictionary)`. Do not research it now. At the end, list the missing terms as a proposed gap fill. When I say yes, add them with the quick mode in `references/build-dictionary.md`.
- **No dictionary fits.** Do the rewrite from what practitioners in that field say, and mark it `(no dictionary)`. At the end, offer to build the dictionary.
- **Build.** Build a new dictionary only on `/lingo` or when I ask. Follow `references/build-dictionary.md`, save the file, and add its row to `index.md`.

A new or changed dictionary is an uncommitted change in `~/.agents`, which is the public `whykothari/whystack` repo. Tell me about it in the final reply. Ask me before you commit it.

## 3. Rewrite

Follow `references/rewrite-guide.md`.

## 4. Show, then do

Show me the rewrite before you start the work:

- My prompt and the rewrite. Put them side by side only in a visual tool. In plain text, put my prompt first, then the rewrite.
- Each trade term that the rewrite added, with its plain meaning in eight words or fewer.
- Each industry default that you added, marked as a default that I can change.
- Any placeholder that I must fill.

Follow the active output style for this reply. If it asks for pictures, show the before and after in a visual tool when one is available.

Then do the task with the rewrite as the working prompt. Do not wait for my approval, except in these cases:

- The content or the audience of the deliverable depends on a fact that I did not give. For example, "investors" can mean current investors or new ones, and care home rules differ between the US and the UK. Ask first.
- The rewrite needs a business decision, such as a discount, a refund rule, a price, or a concession. Ask first.

A value that the work can carry as a blank, such as a target number, is a placeholder, not a question.

If I ask for the rewrite only, stop after you show it.

## Rules

- Keep my intent, scope, names, numbers, and links. Terms change the words, not the task.
- Use a term only when it is more exact than the plain word. Do not add jargon for show.
- The deliverable uses the language of its reader. Customer-facing copy stays plain, even when the prompt behind it uses trade terms.
- I am not an industry reader. Replies to me and work that I read, such as an internal plan or model notes, follow the active output style. Keep a trade term there only when I need it to act, and give its meaning at first use.
- The trade terms belong in the rewrite and in work for industry readers, such as a spec for a developer or a brief for an agency.
- The dictionaries hold terms and short definitions in our own words. Do not copy passages from books or articles.
- The repo is public. Put no private business data in a dictionary.
