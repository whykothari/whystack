# Rewrite a prompt in trade words

The rewrite is a prompt for an agent. Its reader is a senior practitioner in the field, so trade terms are correct here. The rules in the active output style apply to replies to me, not to this text.

## Steps

1. **Take the prompt apart.** Find the goal, the deliverable, the audience, the inputs, the constraints, and the check for "done". Copy names, numbers, and links exactly.
2. **Swap the words.** Use the phrasebook first, then the terms table. Replace a generic phrase only when a term says the same thing more exactly.
3. **Name the deliverable.**
   - For a document, use the name from "Deliverable shapes". List the parts that my prompt needs. Add another standard part only when a practitioner would call the deliverable incomplete without it, and mark it `(default)`.
   - For a change to a system, such as code, a live store, or an ad account, the deliverable is the change. Name the change and its check for "done" in trade terms. Do not turn the task into a document.
4. **State the success check in trade metrics.** If I gave a goal, write it as the metric that the field uses, for example "more sales from the product page" becomes "lift PDP (product detail page) conversion rate". If I gave no goal, write `Goal: [confirm]`. Do not invent a target number. Write `[target]`.
5. **Add industry defaults with care.**
   - You may add a step, a structure, or a timing that practitioners use by default, for example the usual send times for an abandoned-cart flow. Mark each one `(default)` so I can change it.
   - A default can hold a number only when it is a common convention in the field. A target for my business is never a default.
   - A business decision is never a default. Discounts, refunds, prices, credits, and concessions are questions for me.
   - Do not add work that I did not ask for.
6. **Check the result.**
   - The scope is the same as my prompt.
   - Each term means exactly what the task needs.
   - No term is there for show.
   - Each acronym has its full name at first use.
   - The rewrite has 15 lines or fewer. Use a nested list when the deliverable has parts.

## Placeholders and questions

- Use a `[placeholder]` for a value that the work can carry as a blank, such as a target, a date, or an amount that I will fill in.
- Ask me before the work when the content or the audience of the deliverable depends on a missing fact. For example, a reply to an angry customer needs the complaints.

## Example

My prompt:

> write something to get people who left stuff in their cart to come back and buy, for my shopify store

Rewrite:

> Write an abandoned-cart email flow for our Shopify store.
>
> - Trigger: checkout started, no order placed.
> - Email 1 at 1 hour (default): reminder with a dynamic cart block (line items, images, prices) and one CTA (call to action) back to checkout.
> - Email 2 at 24 hours (default): social proof, top product reviews, and answers to the most common objections.
> - Email 3 at 48 hours (default): incentive [ask: offer one, and how much?].
> - For each email: subject line, preview text, body copy, and CTA.
> - Success metrics: cart recovery rate and recovered revenue. Target: [target].
> - Exit condition: the customer places an order.
> - Tone: plain, customer-facing, no jargon in the copy.

Terms added: abandoned-cart flow (emails after a left cart), dynamic cart block (shows that buyer's cart items), CTA (the one button to click), social proof (reviews that build trust), cart recovery rate (share of left carts that convert), exit condition (event that stops the flow).
