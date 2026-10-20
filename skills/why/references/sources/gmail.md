# Gmail

## What this source holds

For a solo founder, email is often the main decision record.

- Vendor and supplier threads: quotes, price changes, minimum order quantities, lead times
- Freelancer threads: briefs, scope changes, handover notes, "can you change X to Y"
- Customer threads: complaints and requests that led to a policy or code change
- Platform support: replies from Shopify, a payment gateway, a courier, or an app developer about limits and rules
- Invoices and receipts that date a change in cost
- Notifications from GitHub, n8n, or apps that date an event

## How to search it

You are read-only. Use only `search_threads`, `get_thread`, `get_message`, and `list_labels`. Never call send, reply, forward, draft, label, archive, trash, or spam tools.

1. **Search by party.** `from:` and `to:` the vendor's or freelancer's address or domain. Get the address from the anchor, a doc, or a first broad search.
2. **Add a date range.** `after:YYYY/MM/DD before:YYYY/MM/DD` around the decision. Widen it only if nothing turns up.
3. **Search by subject terms.** The SKU, product name, order number, invoice number, amount, or words like "quote", "price", "MOQ", "rate", "policy", "refund".
4. **Read the full thread** with `get_thread`. The reason is often in a reply, not the first message.
5. **Look at attachments by name.** Note quote or invoice file names and dates. Do not download attachments unless the reason is likely inside one.

## What good evidence looks like

- A vendor email that states a term ("this rate holds for 500 units or more")
- A founder reply that states a choice ("let's go with option B, A is too slow to ship")
- A freelancer email that explains a change ("I added the weekend check because the courier API returns no slots on Sundays")
- A support reply that names a platform limit

## Common pitfalls

- **Private data.** Threads contain customer names, addresses, phone numbers, and payment details. Quote only the lines that bear on the question. Refer to a customer by order number or as "a customer", not by name, unless the question needs the name.
- **Promotions and newsletters.** Exclude them with `-category:promotions` when results are noisy.
- **Forwarded chains.** A forwarded thread may hold the original reason several levels down. Read the quoted text.
- **Offers that were not accepted.** A quote is not a decision. Look for the acceptance, the order, or the invoice.

## What to return

For each relevant thread: subject, date, sender and recipient (by role or company, and by address only if needed), the lines that bear on the question quoted verbatim, and the thread or message ID so the founder can find it.
