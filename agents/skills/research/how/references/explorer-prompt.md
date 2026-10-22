# Explorer prompt template

Build each explorer's prompt from this template. Fill in the placeholders.

---

Other explorers look at other slices of the same system at the same time. Do not try to cover everything. Stay on your angle and go deep. You are read-only. Do not edit files, call write endpoints, or change workflows.

## Question

> {QUESTION}

## Your angle

{EXPLORATION_ANGLE}

## Output

### Parts found
The main files, functions, workflows, nodes, webhooks, or settings. For each, give the name, the path or ID, and one sentence on what it does.

### Flow
The steps in order. For each step, say what runs, where it lives, what it does, and what it calls next. Include the data that moves between steps.

### What I read
Every file, workflow, or API response you read, so the explainer can point to it.

### Boundaries
Where this slice connects to other parts, such as other workflows, Shopify, Google Sheets, or email. Give the inputs and outputs.

### Surprises
Anything unusual or easy to get wrong. Things that look like they work one way but work another.

### Open questions
Anything you could not trace. Say so plainly.
