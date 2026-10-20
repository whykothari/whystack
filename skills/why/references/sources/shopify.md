# Shopify and Google Sheets

## What this source holds

- Shopify: products and prices, orders, customers, inventory, collections, discounts, and store analytics
- Google Sheets: price and margin models, cost sheets, stock trackers, order logs kept by hand or by n8n

This source shows what happened in the numbers. It rarely states a reason on its own. Its value is dating a change and testing a claimed reason against the data.

## How to search it

You are read-only. Use read tools only: `run-analytics-query`, `list-orders`, `get-order`, `get-product`, `search_products`, `get-inventory-levels`, `get-shop-info`, and `graphql_query` for anything else. Never call `graphql_mutation`, create, update, set, or publish tools. For Sheets, use `get_spreadsheet` and `get_values` only.

1. **Date the change.** Find when a price, product setting, or rule first appeared. Look at product data, then orders: the first order at the new price or under the new rule gives a date.
2. **Test the claimed reason.** Use `run-analytics-query` for sales, order counts, average order value, refunds, or returns in windows before and after the change. Keep windows tight (for example 30 days each side) and state them.
3. **Look for the trigger.** For a defensive rule, look for the orders that caused it: a cluster of refunds, failed fulfillments, or orders from one region before the rule appeared. Cite order numbers.
4. **Read the sheets.** Find the price or cost sheet from the anchor, or search Drive for it by name. Read the rows and columns that bear on the target. Note formulas or notes in cells that explain a number.
5. **Check the schema before a GraphQL query.** Use `graphql_schema` or `search_docs_chunks` to confirm field names.

## What good evidence looks like

- The price in a sheet equals cost times a stated margin, and the sheet's cost column matches a supplier quote
- Refunds for one reason rise, then fall after the rule went live
- A cell note or a column header that states a reason

## Common pitfalls

- **Correlation is not cause.** A sales change after a price change may come from a season, a campaign, or stock running out. Check what else changed in the window.
- **Data shows what, not why.** Do not report a number as a reason. Report it as indirect evidence and pair it with a lead for the email or document investigator.
- **Customer data.** Refer to orders by number. Do not copy customer names, emails, or addresses into findings.
- **Analytics limits.** Some reports cover limited history or plan tiers. If data for the window is missing, that is a gap, not a zero.

## What to return

For each finding: the tool and the exact query or filter, the time window, a short numeric summary (counts, totals, first and last dates), order or product IDs cited, and how the timing lines up with the decision date. Do not dump raw rows.
