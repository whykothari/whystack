# Rewrite a prompt in trade words

The rewrite is a prompt for an agent. Its reader is a senior practitioner in the field, so trade terms are correct here. The rules in the active output style apply to replies to me, not to this text.

A good rewrite is short. It names the deliverable, the goal, the reader, the limits, and the success check in exact terms. It does not tell a senior practitioner how to do the job, unless my prompt does.

## Steps

1. **Take the prompt apart.** Find the goal, the deliverable, the audience, the inputs, the limits, and the check for "done". Copy names, numbers, links, channels, and limits exactly. Note any urgency, such as "we keep running out".
2. **Swap the words.** Use the phrasebook first, then the terms table. Replace a generic phrase only when a term says the same thing more exactly. A phrasebook row that names a method, model, or framework is a suggestion. Leave the method open, or mark it `(default)`.
3. **Name the deliverable.**
   - For a document, use the name from "Deliverable shapes". Name only the parts that my prompt needs or that a practitioner would call missing without them.
   - For a change to a system, such as code, a live store, or an ad account, the deliverable is the change. Name the change and its check for "done". Do not turn the task into a document.
   - For a live problem, put the actions for this week first, then the fix that stops the problem from coming back.
4. **State the success check in trade metrics.** If I gave a goal, write it as the metric that the field uses, for example "more sales from the product page" becomes "lift PDP (product detail page) conversion rate". If I gave no goal, name the likely goal and mark it `(default)`. Do not invent a target number.
5. **Add industry defaults with care.**
   - A default sets a part of the deliverable that I asked for, such as the usual send times for an abandoned-cart flow. Mark each one `(default)`.
   - A default never adds a second deliverable, such as a memo, an analysis, or a plan. Do not take parts from the shape of a different deliverable.
   - A default never sets a policy or a negotiating position, such as fraud limits, refund rules, reward rules, or a liability cap. Write it as `[cap]` or name it as open.
   - A default can hold a number only when it is a common convention in the field, such as a send time or a probation length. A number that says how good my result must be, such as a service level or a runway goal, is a target, and a target is never a default.
   - A business decision that my prompt does not mention gets the safe default, such as no discount, no refund change, or my current policy. Mark it `(default)`.
6. **Check the result.**
   - The scope is the same as my prompt.
   - Each term means exactly what the task needs, and each short meaning stays true.
   - No term is there for show.
   - Each acronym has its full name at first use.
   - The rewrite adds no fact that my prompt or project does not give, such as B2B or a team size.
   - The rewrite has 10 lines or fewer, each under about 120 characters. For a task with two or more parts, write one short block per part, with up to 10 lines per block.

## Placeholders

Use a `[placeholder]` only for a fact that I must give and that an agent cannot reasonably assume, such as a price, a name, or a date. For anything else, let the working agent make a reasonable assumption and mark it `[assumed: ...]` in the deliverable. A rewrite full of blanks gives a deliverable full of blanks.

## Words, not decisions

A trade term must keep my meaning. It must not make a choice for me.

- **Options are not synonyms.** Some terms name one option out of several, such as an entity type, a financing instrument, a formal HR process, or a legal clause. Use such a term only when my prompt makes that choice. Otherwise name the choice as open.
- **Symptoms are not diagnoses.** "The site feels slow" is a symptom. Write "investigate whether p95 latency is above target", not "fix the latency breach". State a cause only when the data in my prompt shows it.
- **No new outward actions.** Do not add send, publish, post, contact, delete, or deploy when my prompt only asks to draft or edit.
- **Metrics need a basis.** When a metric has variants, such as gross margin in dollars or percent, or LTV (lifetime value) on revenue or on gross profit, state the basis.
- **Correct a false premise.** If my prompt states something that is wrong in the field, do not carry it into the rewrite. Write the correct claim and tell me about the change.
- **Keep my language.** If I write in another language, write the rewrite, the notes, and the deliverable in that language. Keep trade terms in the form that practitioners in that language use.

## Example

My prompt:

> write something to get people who left stuff in their cart to come back and buy, for my shopify store

Rewrite:

> Write an abandoned-cart flow for our Shopify store: email (default), 3 messages at 1 h, 24 h, 48 h (default).
> - Trigger: added to cart, no checkout started (default). Checkout abandonment is a separate flow.
> - Each message: subject line, preview text, plain body copy, one CTA (call to action) back to the cart.
> - Message 1 shows the cart items. Message 2 adds reviews (social proof). Message 3 is a last reminder.
> - Incentive: none (default).
> - Exit condition: the customer places an order.
> - Success metrics: recovery rate (recovered orders divided by flow recipients) and recovered revenue.

Terms added: abandoned-cart flow (messages after a left cart), CTA (the one button to click), social proof (reviews that build trust), recovery rate (share of recipients who then order), exit condition (event that stops the flow).
