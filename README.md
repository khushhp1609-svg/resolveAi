# ResolveAI — AI-Powered Merchant Incident Resolution Agent

ResolveAI is an AI-powered merchant support and incident resolution system that investigates payment issues, identifies probable root causes, performs safe recovery actions, verifies the result, and remembers previous incidents.

Unlike a traditional chatbot that only generates answers, ResolveAI connects an AI agent with real application data and controlled backend tools to perform an end-to-end incident resolution workflow.

> **Investigate → Reason → Act → Verify → Remember**

---

## 🚀 What Problem Does ResolveAI Solve?

Payment problems are not always payment failures.

For example:

* A customer successfully pays ₹5,000.
* The payment transaction shows `SUCCESS`.
* The merchant's order still shows `PENDING`.
* A `PAYMENT_SUCCESS` webhook failed to reach the merchant system.
* Support teams have to manually inspect transactions, orders, webhook logs, and previous incidents.

ResolveAI automates this investigation and recovery workflow.

---

## 🤖 How ResolveAI Works

A merchant can simply describe the problem:

> "Customer paid ₹5,000 but the order is still showing unpaid. Please investigate and resolve it."

ResolveAI then:

1. Understands the merchant's request
2. Identifies the relevant incident
3. Retrieves transaction information
4. Retrieves order information
5. Investigates webhook events
6. Correlates evidence across systems
7. Identifies the probable root cause
8. Checks whether recovery is safe
9. Performs the appropriate recovery action
10. Verifies the resulting state
11. Updates the incident
12. Stores the resolution in memory
13. Explains the result to the merchant

---

# ⭐ Core Demo Scenario

ResolveAI currently demonstrates a payment/order mismatch.

### Initial State

```text
Transaction
TXN1001
Status: SUCCESS

Order
ORD1001
Status: PENDING

PAYMENT_SUCCESS Webhook
Status: FAILED
Reason: Merchant endpoint timeout
```

The merchant reports:

```text
Customer paid ₹5,000 but the order is still showing unpaid.
Please investigate and resolve it.
```

### Investigation

ResolveAI compares the state of multiple systems:

```text
Transaction → SUCCESS
Order       → PENDING
Webhook     → FAILED
```

The evidence indicates that the payment succeeded, but the successful payment webhook did not reach the merchant system.

### Recovery

ResolveAI performs a controlled webhook replay.

After successful recovery:

```text
Transaction → SUCCESS
Webhook     → SUCCESS
Order       → PAID
Incident    → RESOLVED
```

---

# 🧠 AI Agent

The AI layer is designed around **tool-assisted investigation** rather than simply generating text.

The agent can reason over backend data and use controlled tools to investigate an incident.

### Investigation Tools

#### Transaction Tool

Retrieves information such as:

* Transaction ID
* Merchant ID
* Customer ID
* Amount
* Payment method
* Payment status
* Creation time

#### Order Tool

Retrieves and verifies:

* Order ID
* Transaction ID
* Amount
* Merchant ID
* Order status

#### Webhook Tool

Retrieves webhook/event information associated with a transaction.

This allows the agent to identify failed payment events and inspect their metadata.

#### Webhook Replay Tool

Performs a controlled recovery action by replaying a failed `PAYMENT_SUCCESS` webhook.

The backend then synchronizes the order and updates the incident after successful recovery.

---

# 🛡️ Safety-First Architecture

A key design principle of ResolveAI is that the AI agent **does not directly control critical payment state**.

The AI can determine that a recovery action may be appropriate, but backend tools enforce the actual safety rules.

Before replaying a webhook, the backend verifies:

1. The transaction exists
2. The transaction status is `SUCCESS`
3. The corresponding order exists
4. The order is not already `PAID`
5. A failed `PAYMENT_SUCCESS` webhook exists
6. The recovery action is valid

Only after these checks can the replay action execute.

```text
Transaction SUCCESS
        ↓
Order PENDING
        ↓
PAYMENT_SUCCESS Webhook FAILED
        ↓
Backend Safety Checks
        ↓
Replay Webhook
        ↓
Webhook SUCCESS
        ↓
Order PAID
        ↓
Incident RESOLVED
```

This creates a separation between:

**AI reasoning**

and

**backend-enforced business rules.**

---

# 🧩 Conversation & Incident Memory

ResolveAI maintains context across conversations instead of treating every merchant message as completely independent.

The system stores information including:

* Conversations
* Messages
* Incidents
* Incident status
* Root cause
* Resolution
* Related transaction information

After an incident is resolved, its resolution can be retrieved as part of the merchant's historical context.

Example:

```text
Memory

Previous related incident found

INC-10291
Resolved

Payment/order mismatch

Failed PAYMENT_SUCCESS webhook was replayed
successfully and the order was synchronized to PAID.
```

ResolveAI also recognizes when an incident has already been resolved and avoids unnecessarily repeating the recovery action.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Merchant       │
                    │    Chat Interface   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     React + Vite    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                            REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Node.js + Express  │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │ AI Agent   │   │   Memory   │   │   Tools    │
       │  Service   │   │  Service   │   │            │
       └────────────┘   └────────────┘   └─────┬──────┘
                                                │
                              ┌─────────────────┼─────────────────┐
                              │                 │                 │
                              ▼                 ▼                 ▼
                       Transactions         Orders          Webhooks
                              │                 │                 │
                              └─────────────────┼─────────────────┘
                                                │
                                                ▼
                                      ┌─────────────────┐
                                      │  MongoDB Atlas  │
                                      │                 │
                                      │ Transactions    │
                                      │ Orders          │
                                      │ Events          │
                                      │ Incidents       │
                                      │ Conversations   │
                                      │ Messages        │
                                      └─────────────────┘
```

---

# 🔄 End-to-End Flow

```text
Merchant reports payment issue
            ↓
      ResolveAI receives message
            ↓
    Conversation / Memory
            ↓
     Incident identification
            ↓
    ┌───────┴────────┐
    ↓                ↓
Transaction         Order
Investigation       Investigation
    └───────┬────────┘
            ↓
    Webhook Investigation
            ↓
      Evidence Correlation
            ↓
      Root Cause Analysis
            ↓
      Safety Validation
            ↓
       Recovery Action
            ↓
       Result Verification
            ↓
      Incident Resolution
            ↓
      Resolution Memory
            ↓
      Merchant Explanation
```

---

# 💻 Frontend

The frontend provides a ChatGPT-style merchant support workspace.

### Current Interface

* Merchant chat interface
* Incident header
* Incident status
* Investigation panel
* Transaction status
* Order status
* Webhook status
* Resolution status
* Conversation memory
* Incident context
* System health indicators
* Investigation loading state
* Responsive navigation

Example investigation state:

```text
Investigation

Transaction    TXN1001
Payment        ✓ SUCCESS
Order          ✓ PAID
Webhook        ✓ SUCCESS
Resolution     ✓ RESOLVED
```

The interface makes the agent's investigation and final outcome easy to understand during a demonstration.

---

# 🗄️ Data Model

ResolveAI uses **MongoDB Atlas** for persistent application data.

### Transactions

```text
transactionId
merchantId
customerId
amount
paymentMethod
status
createdAt
```

### Orders

```text
orderId
transactionId
merchantId
amount
status
createdAt
```

### Events

```text
eventId
transactionId
eventType
status
metadata
timestamp
```

### Incidents

```text
incidentId
transactionId
type
priority
status
description
rootCause
resolution
```

### Conversations

Stores merchant conversation context.

### Messages

Stores individual merchant and AI messages.

---

# 🔌 Backend API

| Method     | Endpoint                       | Purpose                           |
| ---------- | ------------------------------ | --------------------------------- |
| `GET`      | `/api/health`                  | Backend health check              |
| `GET`      | `/api/transactions/:id`        | Retrieve transaction              |
| `GET`      | `/api/orders/:id`              | Retrieve order                    |
| `GET`      | `/api/webhooks/:transactionId` | Retrieve webhook events           |
| `POST`     | `/api/webhooks/replay`         | Replay failed payment webhook     |
| `POST`     | `/api/webhooks/reset-demo`     | Reset demo state                  |
| `POST`     | `/api/chat`                    | Send merchant message to AI agent |
| `GET`      | `/api/incidents`               | Incident operations               |
| `GET/POST` | `/api/conversations`           | Conversation operations           |

---

# 🛠️ Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### AI

* Google Gemini
* Gemini Flash model

### Development

* Git
* GitHub
* VS Code
* Nodemon

---

# 📁 Project Structure

```text
resolve-ai-phase1/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── Transaction.js
│   │   ├── Order.js
│   │   ├── Event.js
│   │   ├── Incident.js
│   │   ├── Conversation.js
│   │   └── Message.js
│   │
│   ├── routes/
│   │   ├── health.js
│   │   ├── transactions.js
│   │   ├── orders.js
│   │   ├── webhooks.js
│   │   ├── incidents.js
│   │   ├── conversations.js
│   │   └── chat.js
│   │
│   ├── services/
│   │   ├── aiAgentService.js
│   │   └── memoryService.js
│   │
│   ├── tools/
│   │   ├── transactionTool.js
│   │   ├── orderTool.js
│   │   ├── webhookTool.js
│   │   └── replayWebhookTool.js
│   │
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🚀 Running Locally

## 1. Clone the Repository

```bash
git clone https://github.com/khushhp1609-svg/resolveAi.git
cd resolveAi
```

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

## 3. Configure Environment Variables

Create a `.env` file inside `backend`.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env` to GitHub.

## 4. Start the Backend

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

## 5. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🎬 Demo

To demonstrate the primary workflow:

### 1. Reset the Demo

Reset the environment to the unresolved state.

```text
Payment     SUCCESS
Order       PENDING
Webhook     FAILED
Resolution  PENDING
```

### 2. Send the Merchant Request

```text
Customer paid ₹5,000 but the order is still showing unpaid.
Please investigate and resolve it.
```

### 3. ResolveAI Investigates

The agent checks:

```text
Transaction
      ↓
Order
      ↓
Webhook
      ↓
Incident History
```

### 4. Root Cause

```text
Merchant endpoint timeout
caused the PAYMENT_SUCCESS webhook to fail.
```

### 5. Recovery

ResolveAI performs the validated webhook replay.

### 6. Final State

```text
Payment     SUCCESS
Order       PAID
Webhook     SUCCESS
Resolution  RESOLVED
```

### 7. Memory

The resolved incident is stored and can be referenced by the system later.

---

# 🔐 Security & Reliability Principles

ResolveAI follows several basic safety principles:

* API keys are stored in environment variables
* `.env` files are excluded from Git
* Backend tools validate inputs
* Critical payment state is not blindly trusted from AI output
* Recovery actions use backend-side validation
* Webhook replay requires a successful transaction
* Already-paid orders are protected from unnecessary replay
* Database state acts as the source of truth for critical operations
* AI reasoning is separated from backend business rules

---

# 📊 Implementation Status

| Feature                    | Status     |
| -------------------------- | ---------- |
| React frontend             | ✅ Complete |
| Chat interface             | ✅ Complete |
| Node.js / Express backend  | ✅ Complete |
| MongoDB Atlas              | ✅ Complete |
| Transaction investigation  | ✅ Complete |
| Order investigation        | ✅ Complete |
| Webhook investigation      | ✅ Complete |
| AI agent                   | ✅ Complete |
| Gemini integration         | ✅ Complete |
| Conversation memory        | ✅ Complete |
| Incident tracking          | ✅ Complete |
| Safe webhook replay        | ✅ Complete |
| Order synchronization      | ✅ Complete |
| Incident resolution        | ✅ Complete |
| Already-resolved detection | ✅ Complete |
| Demo reset                 | ✅ Complete |
| Production deployment      | ✅ Complete |

---

# 🌐 Deployment

ResolveAI is deployed using:

```text
Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas
```

### Live Application

**Frontend**

https://resolve-ai-three-brown.vercel.app/

**Backend Health Check**

https://resolveai-1-lrp2.onrender.com/api/health

---

# 🔮 Future Improvements

The current implementation focuses on a working end-to-end payment incident resolution MVP.

Future versions could support:

### Additional Incident Types

* Payment deducted but transaction missing
* Duplicate payments
* Failed payments
* Settlement delays
* Refund mismatches
* KYC issues
* Merchant webhook configuration problems

### Advanced Agent Orchestration

```text
Understand
    ↓
Plan
    ↓
Investigate
    ↓
Evaluate Evidence
    ↓
Choose Action
    ↓
Execute
    ↓
Verify
```

### Advanced Memory

* Merchant-specific preferences
* Recurring incident patterns
* Historical resolutions
* Similar incident detection
* Frequently occurring root causes

### Production Integrations

The simulated payment environment could eventually integrate with:

* Payment gateway APIs
* Merchant systems
* Webhook monitoring
* Observability platforms
* Ticketing systems

---

# 💡 Why ResolveAI?

Many AI projects follow:

```text
User → Question → AI → Answer
```

ResolveAI demonstrates a different pattern:

```text
Merchant
   ↓
Problem
   ↓
AI Agent
   ↓
System Investigation
   ↓
Evidence Correlation
   ↓
Root Cause
   ↓
Safe Action
   ↓
Verification
   ↓
Resolution
   ↓
Memory
```

The project combines:

* Full-stack development
* REST APIs
* MongoDB data modeling
* AI agents
* Tool-assisted reasoning
* Backend automation
* Safety controls
* State verification
* Incident management
* Conversation memory

The goal is not simply to build an AI chatbot.

The goal is to build an **AI system that can investigate and safely help resolve operational problems.**

---

# 👩‍💻 Author

**Khushboo**

B.Tech Computer Science Engineering

GitHub:
https://github.com/khushhp1609-svg

---

## 🎯 Project Vision

> **An AI support agent should not only explain a problem — it should investigate, safely resolve, verify, and remember it.**
