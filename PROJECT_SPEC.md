# ResolveAI — Project Specification

## Problem

Merchant payment incidents often require checking multiple systems —
payment gateway, order state, webhooks, settlements, KYC — before a support
agent can even identify the cause. That investigation is slow, repetitive,
and easy to get wrong.

## Solution

ResolveAI is an AI-powered incident-resolution agent that investigates
merchant payment issues using controlled tools and structured incident
memory, then explains what it found and recommends (or safely takes) an
action.

## MVP Scenarios

1. **Payment/order mismatch** — payment succeeded, order still shows unpaid.
2. **Payment deducted but merchant doesn't see it** — merchant reports a
   deduction; the agent checks transaction, payment, customer history, and
   webhook events.
3. **Settlement/KYC issue** — the agent checks settlement status, KYC
   status, required documents, and prior support interactions.

Every resolution follows the same explanation structure:

> **Reason → Evidence → Required action → Escalation if necessary**

## Signature Feature: persistent incident memory

Example:

Merchant: *"My payment TXN123 isn't showing."*

...later, in a new conversation...

Merchant: *"Any update?"*

ResolveAI retrieves the relevant previous incident instead of asking the
merchant to repeat themselves.

## Safety

High-risk or low-confidence actions require human approval before
execution. The agent never silently takes an irreversible action.

## Current Phase

**Phase 1 — Project infrastructure and UI only.**

- React + Vite + Tailwind frontend with a static demo of the incident
  workspace, investigation card, and memory card.
- Express backend with a single health-check endpoint.
- MongoDB Atlas connection foundation (no collections populated yet).
- No AI/LLM integration, no tool-calling, no real payment data.

## Roadmap

| Phase | Scope |
|---|---|
| 1 | Repository, frontend, backend, MongoDB Atlas foundation *(this phase)* |
| 2 | Simulated payment backend |
| 3 | Conversation + incident memory |
| 4 | AI integration |
| 5 | Controlled tool calling |
| 6 | Investigation agent |
| 7 | Safety / approval system |
| 8 | Incident timeline |
| 9 | Case memory |
| 10 | Evaluation |
