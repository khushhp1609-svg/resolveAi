# ResolveAI — AI-Powered Merchant Incident Resolution Agent

ResolveAI is an AI-powered merchant support and incident resolution system designed to investigate payment issues, remember previous conversations, identify probable root causes, and safely resolve incidents.

## 🚀 Current Progress

### Backend Foundation

* ✅ React + Vite frontend setup
* ✅ Node.js + Express backend
* ✅ MongoDB Atlas integration
* ✅ Transaction model
* ✅ Order model
* ✅ Event model
* ✅ Mock payment data
* ✅ Transaction API
* ✅ Order API
* ✅ Webhook API
* ✅ Webhook replay action

### Incident & Memory System

* ✅ Incident system
* ✅ Conversation system
* ✅ Message memory
* ✅ Active incident tracking
* ✅ Conversation memory retrieval
* ✅ Incident-to-conversation linking

## 🧠 Current Architecture

```text
Merchant
   ↓
Chat Interface
   ↓
Conversation API
   ↓
Memory Service
   ↓
Incident
   ↓
Transaction / Order / Webhook Data
   ↓
AI Agent
   ↓
Investigation + Resolution
```

## 🎯 Main Use Case

### Scenario 1 — Payment / Order Mismatch

Example:

A customer successfully pays ₹5,000, but the merchant's order still shows as unpaid.

ResolveAI can:

1. Identify the incident.
2. Retrieve the relevant conversation history.
3. Identify the associated transaction.
4. Check payment status.
5. Check order status.
6. Check webhook events.
7. Identify the probable root cause.
8. Perform a safe resolution such as webhook replay.
9. Record the resolution in the incident timeline.

## 💾 Conversation Memory

ResolveAI maintains persistent conversation memory using MongoDB.

Each conversation can contain:

* Conversation ID
* Merchant/User ID
* Active incident
* Message history
* Incident association

Example:

```text
CONV1001
   ↓
INC10291
   ↓
TXN1001
```

This allows a merchant to continue a conversation without repeatedly explaining the same problem.

## 🔧 Technology Stack

### Frontend

* React
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Development

* Git
* GitHub
* VS Code

## 📂 Backend Structure

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── healthController.js
│
├── models/
│   ├── Transaction.js
│   ├── Order.js
│   ├── Event.js
│   ├── Incident.js
│   ├── Conversation.js
│   └── Message.js
│
├── routes/
│   ├── health.js
│   ├── transactions.js
│   ├── orders.js
│   ├── webhooks.js
│   ├── incidents.js
│   ├── conversations.js
│   └── chat.js
│
├── services/
│   └── memoryService.js
│
├── seed.js
├── server.js
└── package.json
```

## 🛠️ Planned Features

* ⬜ AI Agent
* ⬜ AI tool calling
* ⬜ Investigation tools
* ⬜ Safety and approval system
* ⬜ Incident timeline
* ⬜ ChatGPT-like frontend integration
* ⬜ Scenario 2 — Payment deducted but merchant doesn't see it
* ⬜ Scenario 3 — Settlement/KYC issue
* ⬜ Evaluation framework

## 🔐 Security

Environment variables and API keys are stored in `.env` and should never be committed to GitHub.

## 📌 Project Status

**Currently in active development.**

Backend incident management and persistent conversation memory are implemented. The next major milestone is connecting the AI agent to the investigation and resolution tools.

## 👩‍💻 Author

Khushboo
