# ResolveAI — AI-Powered Merchant Incident Resolution Agent

ResolveAI is an AI-powered merchant support and incident resolution system that investigates payment issues, identifies probable root causes, safely performs verified recovery actions, and remembers previous incidents.

The goal is to move beyond a simple support chatbot by giving the AI access to real incident data and controlled resolution tools.

---

## 🚀 What ResolveAI Does

A merchant can describe a payment problem in natural language.

ResolveAI can then:

1. Understand the reported incident.
2. Retrieve relevant conversation memory.
3. Identify the associated transaction.
4. Investigate payment status.
5. Investigate order status.
6. Inspect webhook events.
7. Determine the probable root cause.
8. Perform a safety-checked resolution action.
9. Synchronize the affected system state.
10. Record the resolution in incident memory.
11. Explain the result to the merchant.

---

## ⭐ Demo Scenario

### Payment / Order Mismatch

Example:

> Customer paid ₹5,000, but the merchant's order is still showing as unpaid.

Initial system state:

```text
Transaction     SUCCESS
Order           PENDING
Webhook         FAILED
Incident        OPEN