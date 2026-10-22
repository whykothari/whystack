---
name: lingo
description: "Rewrite my prompt in the words that people in the task's industry use, show the rewrite, then do the task with it. Use for /lingo, when I ask for industry terms or jargon, and on your own when a task clearly belongs to one industry or function (software, data, product, design, marketing, sales, customer success, finance, accounting, legal, operations, HR, e-commerce) and my prompt uses generic words. Builds a new industry dictionary from textbooks, standards, and docs on /lingo or when I ask. Do not trigger on your own for quick questions, one-line or mechanical edits, or tasks with no industry."
---

# Lingo

I write prompts in generic words. Practitioners use exact terms. An exact term tells an agent which method, metric, standard, or deliverable to use, so the output reads like work from a senior person in that field.

This skill turns my prompt into the trade's words, with a dictionary for each industry as the source of truth. The rewrite says what to make and how to judge it. It leaves the how to the practitioner.

## When to use it

- **When I ask.** I type `/lingo`, or I ask you to use industry terms. Always run it then. If I ask a question and give no task, answer with the trade terms and stop.
- **On your own.** The task makes a deliverable for one field, such as a sales sequence, a financial model, a PRD (product requirements document), a campaign brief, or a contract review, and my prompt uses generic words. Run it only when the rewrite would change the work, not only the words.

Do not use it on your own for a quick question, a one-line or mechanical edit, a request to explain something, or a task that has no industry.

**Check mode.** Check mode runs on every task in one of these fields, also on a quick question or a request to explain something. It runs when the skill does not rewrite, for example because my prompt already uses the right terms. Load the dictionary and check my prompt against it. If a term is used wrongly, a metric has no basis, or a claim is false in the field, correct it in one line. If you find no error, say nothing about the check. Then do the task.

## 1. Find the industry

Read `references/dictionaries/index.md`. Find three facts in the prompt or the project: the business model (for example a physical-goods store or a SaaS product), the country, and the size of the company. When a fact is missing, assume the likely value and state it in one line. Ask only when step 4 says to ask.

Match the task to one primary industry by the nature of the task, not by one trigger word. When two rows fit, pick the one whose dictionary has the deliverable in its "Deliverable shapes". Add one secondary industry when the task needs terms from a second field, for example pricing page copy for an online store is marketing plus e-commerce. When the task has parts in different fields, such as a budget, a hire, and an ad campaign, pick a field for each part.

Each dictionary has a `regions` field, and some terms carry a country tag such as "(US)". When a term, or a part of a deliverable shape, does not apply in my country, do not use it. Use the local equivalent, marked `(not in dictionary)`, and say so in one line.

## 2. Load the dictionary

Read `references/dictionaries/<slug>.md`. For a long file, read the sections that fit the task.

- **A term is missing.** Use the term that a practitioner would use and mark it `(not in dictionary)`. Do not research it now. In the final reply after the work, list the missing terms as a proposed gap fill. When I say yes, add them with the quick mode in `references/build-dictionary.md`.
- **No dictionary fits.** A dictionary fits when it has a shape for the deliverable or five or more of its terms apply. If none fits, do the rewrite from what practitioners in that field say, and mark it `(no dictionary)`. At the end, offer to build the dictionary.
- **Build.** Build a new dictionary only on `/lingo` or when I ask. Follow `references/build-dictionary.md`, save the file, and add its row to `index.md`. A page that I name is one source. The build still needs the other sources that the guide asks for.

A new or changed dictionary is an uncommitted change in `~/.agents`, which is the public `whykothari/whystack` repo. Tell me about it in the final reply. Ask me before you commit it.

## 3. Rewrite

Follow `references/rewrite-guide.md`.

## 4. Show, then do

Show me the rewrite before you start the work:

- My prompt and the rewrite. Put them side by side only in a visual tool. In plain text, put my prompt first, then the rewrite.
- Each trade term that the rewrite added, with a short plain meaning that stays true.
- Each industry default that you added, marked as a default that I can change.
- Any placeholder that I must fill.
- Your one-line notes, such as an assumed country or a weak match. Keep them outside the rewrite.

Follow the active output style for this reply. If it asks for pictures, show the before and after in a visual tool when one is available. Write the reply in the language of my prompt.

Then do the task with the rewrite as the working prompt. Do not wait for my approval.

Ask a question before the work only in these cases:

- A wrong guess would change the type of deliverable, its audience, or most of its content. For example, "investors" can mean current investors or new ones, and a dashboard with no clue to the business model has no right set of metrics.
- A wrong guess would change the law that the deliverable's content must follow. For example, an offer letter differs by country.
- The deliverable exists to carry a decision that only I can make, such as a reply that grants or refuses a refund. Ask even when the decision would fit in a blank.

Rules about how I send or use the deliverable, such as consent rules for email, get a one-line note, not a question. Ask at most two questions. Do the parts of the work that do not depend on the answers.

Everything else is not a question. If the rewrite can hold an item as a placeholder or a marked assumption, do not also ask about it. A business decision that my prompt does not mention gets the safe default, such as no discount, marked `(default)`.

If I ask for the rewrite only, show it, list any questions, and stop. If I also ask a question, answer it in one line.

## Rules

- Keep my intent, scope, names, numbers, channels, and limits. Terms change the words, not the task.
- Use a term only when it is more exact than the plain word. Do not add jargon for show. If I ask for jargon in copy for customers, do it, and say in one line that it can make the copy less clear.
- The deliverable uses the language of its reader. Customer-facing copy stays plain, even when the prompt behind it uses trade terms.
- Fit the work to the size of the company. A solo founder needs steps that one person can do, not a process for a team.
- I am not an industry reader. Replies to me and work that I read, such as an internal plan or model notes, follow the active output style. Keep a trade term there only when I need it to act, and give its meaning at first use.
- The trade terms belong in the rewrite and in work for industry readers, such as a spec for a developer or a brief for an agency.
- Do not add send, publish, post, delete, or deploy unless my prompt asks for it. Read "handle" or "deal with" as draft and prepare.
- The dictionaries hold terms and short definitions in our own words. Do not copy passages from books or articles.
- The repo is public. Put no private business data in a dictionary.
