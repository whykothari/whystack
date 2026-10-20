# Google Drive, Docs, Slides, and Claude Docs

## What this source holds

- Plans, briefs, and specs written before work started
- Supplier and courier comparisons, quotes saved as PDFs
- Freelancer briefs and statements of work
- Pricing and margin models. The store and business data investigator reads Google Sheets values. This investigator reads the docs around them.
- Slide decks for pitches, launches, or reviews
- Claude Docs written in earlier sessions, such as decision notes or reports

A significant decision often has a doc, even if it is a short one.

## How to search it

1. **Search Drive** with `search_files`. Try:
   - The decision or feature name, the supplier or vendor name, the SKU or product name
   - Words like "quote", "comparison", "brief", "plan", "pricing"
   - A date range around the decision, using modified-time filters if the tool supports them
2. **Read candidates in full.** Use `read_doc` for Google Docs, `read_presentation` for Slides, and `read_file_content` or `download_file_content` for other files. The reason is often in the middle of a doc.
3. **Check metadata** with `get_file_metadata`: owner, created and modified dates. Compare these with the decision date.
4. **Search Claude Docs** with its `query` tool and read matches with `read`.
5. **Follow links inside documents** to other Drive files. Record links to email or chat as leads.

## What good evidence looks like

- A comparison doc with a "chosen" row and a reason
- A brief that states the problem the code or rule solves
- A note that says "we decided X because Y", dated near the change
- A rejected-options section

## Common pitfalls

- **Outdated plans.** A doc may describe a plan that changed. Compare it with what was built or what the store shows.
- **Many drafts.** Find the final or most recently edited version. Check dates.
- **Shared-with-me files.** A freelancer's file may not appear in the founder's own Drive search. If access fails, record it as a gap.

## What to return

For each relevant doc: title, URL or file ID, owner, created and modified dates, the reason quoted verbatim with its section, and whether it reads as a draft or final.
