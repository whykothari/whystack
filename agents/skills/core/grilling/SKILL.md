---
name: grilling
description: Question me round by round about a plan, decision, or idea until we agree on every part. Use when I want to test my thinking, or say "grill" in any form.
---

# Grilling

Adapted from mattpocock/skills grilling (MIT, Matt Pocock). See LICENSE.

Question me until we both understand the plan the same way. The plan can be code, a product launch, a price, a supplier choice, or a workflow.

## The decision tree

Each decision leads to the decisions that depend on it. The open set is every decision whose earlier decisions are already settled. These are the questions you can ask now without a guess about answers you do not have yet.

## Rounds

Ask the whole open set in one round. Then wait for my answers.

- In Claude Code, use the AskUserQuestion tool. It takes up to 4 questions per call. Put your recommended answer first, with "(Recommended)" after its label. If the open set has more than 4 questions, ask the most important 4 first.
- In Codex or without that tool, write each question in plain text, numbered, with your recommended answer on the next line.

Write each question so that "yes" accepts your recommendation. Give one short reason for each recommendation, and a price if it costs money.

My answers change the tree. Settled decisions open new questions. Find the new open set and ask the next round. A question that depends on another question in the same round goes in a later round.

## Facts are your job

Never ask me for a fact you can find yourself in files, git, Shopify, Gmail, Drive, or the web. Send a subagent to find it. Do not wait for it: only the questions that depend on that fact wait, and you ask the rest now. Decisions are mine. Ask me each one and wait.

## Done

You are done when the open set is empty, every branch is visited, and nothing is assumed without my answer. Then give me the settled plan as a short list. Do not act on the plan until I confirm that we agree.
