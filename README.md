# ResolveAI — AI-Powered Merchant Incident Resolution Agent

ResolveAI is an AI-powered merchant support and incident resolution system designed to investigate payment issues, identify probable root causes, safely perform verified recovery actions, and remember previous incidents.

Instead of acting as a simple chatbot that only answers support questions, ResolveAI connects conversational support with real payment, order, webhook, incident, and memory data to investigate an issue and resolve it through controlled backend actions.

---

## 🎯 Problem Statement

Payment failures are not always caused by the payment itself.

A merchant may see a situation such as:

* Customer successfully completed a payment
* Payment gateway shows the transaction as successful
* Merchant's order still appears unpaid
* A payment webhook failed to reach the merchant system
* Support teams have to manually inspect multiple systems
* The same merchant may contact support again about a related incident

Traditional support systems often require an engineer or support executive to manually correlate transaction data, order state, webhook events, and previous incidents.

**ResolveAI automates this investigation and resolution workflow.**

---

## 💡 What ResolveAI Does

A merchant can describe a payment problem in natural language.

For example:

> "Customer paid Rs 5000 but the order is still showing unpaid. Please investigate and resolve it."

ResolveAI then:

1. Understands the merchant's problem
2. Identifies the relevant incident
3. Retrieves transaction information
4. Retrieves the corresponding order
5. Investigates webhook events
6. Compares the states across systems
7. Determines the probable root cause
8. Performs a safe recovery action when appropriate
9. Verifies the resulting state
10. Updates the incident
11. Stores the resolution in conversation memory
12. Explains the resolution to the merchant

This creates an end-to-end **investigate → reason → act → verify → remember** workflow.

---

# ⭐ Core Demo Scenario

ResolveAI currently demonstrates a payment/order mismatch scenario.

### Initial state

A customer pays **₹5,000** using UPI.

The backend contains:

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

The merchant contacts ResolveAI:

> "Customer paid Rs 5000 but the order is still showing unpaid. Please investigate and resolve it."

### Investigation

ResolveAI checks:

```text
Transaction
      ↓
Order
      ↓
Webhook Events
      ↓
Root Cause
```

It determines that:

```text
Transaction = SUCCESS
Order       = PENDING
Webhook     = FAILED
```

The mismatch indicates that the payment succeeded but the merchant system did not receive the successful payment event.

### Resolution

ResolveAI safely invokes the webhook replay action.

After replay:

```text
Transaction = SUCCESS
Webhook     = SUCCESS
Order       = PAID
Incident    = RESOLVED
```

The merchant receives an explanation of what happened and what action was performed.

---

# 🤖 AI Agent

The AI layer is designed around tool-assisted investigation rather than relying only on generated text.

The agent can reason over information returned by backend tools and use those tools to investigate the incident.

### Investigation tools

#### `getTransaction()`

Retrieves transaction information such as:

* Transaction ID
* Merchant ID
* Customer ID
* Amount
* Payment method
* Payment status
* Creation time

#### `getOrder()`

Retrieves the order associated with a transaction and checks:

* Order ID
* Transaction ID
* Amount
* Order status
* Merchant ID

#### Webhook investigation

The backend retrieves webhook/event information for the transaction, allowing ResolveAI to identify failed payment events and their metadata.

#### `replayWebhook()`

A controlled recovery tool that can replay a failed `PAYMENT_SUCCESS` webhook.

The action also synchronizes the corresponding order and updates the active incident after successful recovery.

---

# 🛡️ Safety-First Actions

ResolveAI is designed so that an AI agent does not blindly modify payment state.

Before replaying a webhook, the backend performs validation checks.

The replay action verifies that:

1. The transaction exists
2. The transaction status is `SUCCESS`
3. The corresponding order exists
4. The order is not already `PAID`
5. A failed `PAYMENT_SUCCESS` webhook exists
6. The action can be safely performed

Only after these checks does the system perform the recovery action.

For example:

```text
Transaction SUCCESS
        +
Order PENDING
        +
PAYMENT_SUCCESS webhook FAILED
        ↓
Safe to investigate recovery
        ↓
Replay webhook
        ↓
Webhook SUCCESS
        ↓
Order PAID
        ↓
Incident RESOLVED
```

This separation between **AI reasoning** and **backend-enforced safety rules** is an important part of the architecture.

---

# 🧠 Conversation Memory

ResolveAI maintains conversation and incident context instead of treating every message as a completely new support request.

The system stores:

* Conversations
* Messages
* Active incidents
* Incident status
* Root cause
* Resolution
* Related transaction information

After an incident is resolved, the resolution becomes available through the memory layer.

For example, the interface can show:

```text
Memory

Previous related incident found

INC-10291
Resolved

Payment/order mismatch

Failed PAYMENT_SUCCESS webhook was replayed
successfully and the order was synchronized to PAID.
```

This allows ResolveAI to maintain continuity across support conversations.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      Merchant        │
                    │   Chat Interface     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      React UI        │
                    │  ResolveAI Frontend  │
                    └──────────┬───────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌────────────┐ ┌────────────┐ ┌────────────┐
        │ AI Agent   │ │   Memory   │ │   Tools    │
        │  Service   │ │   Service  │ │            │
        └─────┬──────┘ └─────┬──────┘ │ Transaction│
              │              │         │ Order      │
              │              │         │ Webhook    │
              │              │         │ Replay     │
              │              │         └─────┬──────┘
              │              │               │
              └──────────────┼───────────────┘
                             │
                             ▼
                    ┌──────────────────────┐
                    │    MongoDB Atlas     │
                    │                      │
                    │ Transactions         │
                    │ Orders               │
                    │ Events               │
                    │ Incidents            │
                    │ Conversations        │
                    │ Messages             │
                    └──────────────────────┘
```

---

# 🔄 End-to-End Flow

```text
Merchant reports payment issue
              ↓
      ResolveAI receives message
              ↓
       Conversation memory
              ↓
       Incident identification
              ↓
     ┌────────┴────────┐
     ↓                 ↓
Transaction          Order
Investigation       Investigation
     └────────┬────────┘
              ↓
      Webhook investigation
              ↓
       Evidence correlation
              ↓
       Root cause identified
              ↓
     Safety checks performed
              ↓
       Recovery action
              ↓
      Result verified
              ↓
       Incident resolved
              ↓
      Resolution remembered
              ↓
      Explanation to merchant
```

---

# 🖥️ Frontend

The frontend provides a ChatGPT-style merchant support workspace.

### Current interface includes

* Merchant chat interface
* Incident header
* Incident status
* Investigation card
* Transaction status
* Order status
* Webhook status
* Resolution status
* Conversation memory card
* Incident context panel
* System health indicators
* Investigation loading state
* Responsive sidebar/navigation

### Investigation card

The interface visually communicates the investigation:

```text
Investigation

Transaction    ● TXN1001
Payment        ✓ SUCCESS
Order          ✓ PAID
Webhook        ✓ SUCCESS
Resolution     ✓ RESOLVED
```

This makes the agent's reasoning and outcome easier to understand during a demonstration.

---

# 🗄️ Data Model

ResolveAI uses MongoDB Atlas for persistent application data.

The project contains models for major parts of the incident-resolution workflow.

### Transactions

Stores payment information.

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

Stores merchant order state.

```text
orderId
transactionId
merchantId
amount
status
createdAt
```

### Events

Stores webhook/event information associated with transactions.

```text
eventId
transactionId
eventType
status
metadata
timestamp
```

### Incidents

Stores the support incident and its resolution state.

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

Stores merchant support conversations.

### Messages

Stores individual merchant and AI messages.

---

# 🔌 Backend API

The Express backend exposes REST endpoints for the application.

### Health

```http
GET /api/health
```

Checks whether the backend is operational.

### Transactions

```http
GET /api/transactions/:id
```

Retrieves a transaction.

### Orders

```http
GET /api/orders/:id
```

Retrieves an order.

### Incidents

```http
/api/incidents
```

Provides incident-related operations.

### Conversations

```http
/api/conversations
```

Handles conversation-related operations.

### AI Chat

```http
POST /api/chat
```

Receives a merchant message and sends it through the ResolveAI agent.

Example request:

```json
{
  "conversationId": "CONV1001",
  "userId": "MERCHANT001",
  "content": "Customer paid Rs 5000 but the order is still showing unpaid. Please investigate and resolve it."
}
```

### Webhook investigation

```http
GET /api/webhooks/:transactionId
```

Retrieves webhook events for a transaction.

### Webhook replay

```http
POST /api/webhooks/replay
```

Replays a failed payment-success webhook.

### Demo reset

```http
POST /api/webhooks/reset-demo
```

Resets the demo environment to the original unresolved state.

---

# 🧰 Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* JavaScript

## Backend

* Node.js
* Express.js
* REST APIs

## Database

* MongoDB
* MongoDB Atlas
* Mongoose

## AI

* Gemini Interactions API
* Gemini Flash model

## Development Tools

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
│   │
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
│   │   └── replayWebhookTool.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
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

# 🚀 Running the Project Locally

## 1. Clone the repository

```bash
git clone https://github.com/khushhp1609-svg/resolveAi.git
cd resolveAi
```

## 2. Install backend dependencies

```bash
cd backend
npm install
```

## 3. Configure environment variables

Create a `.env` file inside `backend`.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit the `.env` file.

It is excluded through `.gitignore`.

## 4. Start the backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

## 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

# 🧪 Demo Instructions

To demonstrate the main ResolveAI workflow:

### Step 1

Start both frontend and backend servers.

### Step 2

Open the frontend.

### Step 3

The initial investigation should show:

```text
Payment     SUCCESS
Order       PENDING
Webhook     FAILED
Resolution  PENDING
```

### Step 4

Send:

```text
Customer paid Rs 5000 but the order is still showing unpaid. Please investigate and resolve it.
```

### Step 5

ResolveAI investigates the transaction, order, and webhook.

### Step 6

The agent identifies the failed webhook as the probable cause.

### Step 7

The safe replay action is performed.

### Step 8

The final state becomes:

```text
Payment     SUCCESS
Order       PAID
Webhook     SUCCESS
Resolution  RESOLVED
```

### Step 9

The memory section records the resolved incident.

This demonstrates the complete **AI-assisted incident resolution lifecycle**.

---

# 🔐 Security Considerations

The project follows several basic security principles:

* API keys are stored in environment variables
* `.env` files are excluded from Git
* Backend actions validate their inputs
* Payment state is not directly trusted from the AI response
* Recovery actions perform backend-side safety checks
* Webhook replay requires a successful transaction
* Already-paid orders cannot be replayed
* Database state is used as the source of truth for critical actions

The AI agent decides **what should be investigated or attempted**, while backend tools enforce whether an action is actually allowed.

---

# 📊 Current Implementation Status

| Feature                   | Status        |
| ------------------------- | ------------- |
| React frontend            | ✅ Implemented |
| Chat interface            | ✅ Implemented |
| Node/Express backend      | ✅ Implemented |
| MongoDB Atlas             | ✅ Implemented |
| Transaction investigation | ✅ Implemented |
| Order investigation       | ✅ Implemented |
| Webhook investigation     | ✅ Implemented |
| AI agent                  | ✅ Implemented |
| Gemini integration        | ✅ Implemented |
| Conversation memory       | ✅ Implemented |
| Incident tracking         | ✅ Implemented |
| Safe webhook replay       | ✅ Implemented |
| Order synchronization     | ✅ Implemented |
| Incident resolution       | ✅ Implemented |
| Demo reset                | ✅ Implemented |
| GitHub repository         | ✅ Implemented |

---

# 🔮 Future Improvements

The current implementation focuses on a working end-to-end incident-resolution MVP.

Possible future extensions include:

### More incident types

* Payment deducted but transaction missing
* Duplicate payment
* Failed payment
* Settlement delays
* Refund mismatch
* KYC-related issues
* Merchant webhook configuration problems

### Better agent orchestration

Introduce a more explicit planning and tool-selection layer where the agent:

```text
Understand
    ↓
Plan
    ↓
Investigate
    ↓
Evaluate evidence
    ↓
Choose action
    ↓
Execute
    ↓
Verify
```

### Stronger memory

Future versions can maintain:

* Merchant-specific preferences
* Recurring incident patterns
* Historical resolutions
* Frequently occurring root causes
* Similar previous incidents

### Production integrations

The simulated payment environment can eventually be replaced or supplemented with real integrations such as:

* Payment gateway APIs
* Merchant systems
* Webhook monitoring
* Observability platforms
* Ticketing systems

---

# 💼 Why ResolveAI?

Most chatbot projects stop at:

```text
User → Question → AI → Answer
```

ResolveAI aims to demonstrate a more useful pattern:

```text
Merchant
   ↓
Problem
   ↓
AI Agent
   ↓
Real system investigation
   ↓
Evidence correlation
   ↓
Root-cause analysis
   ↓
Safe action
   ↓
Verification
   ↓
Resolution
   ↓
Memory
```

The project therefore combines several engineering concepts in one system:

* Full-stack development
* REST APIs
* MongoDB data modeling
* AI agent workflows
* Tool calling
* Backend automation
* State verification
* Safety controls
* Conversation memory
* Incident management

The goal is not simply to build an AI chatbot, but to build an **AI system capable of helping resolve operational problems**.

---

# 📌 Project Status

**ResolveAI is currently an end-to-end working MVP demonstrating AI-assisted merchant payment incident investigation and resolution.**

The primary demonstrated workflow is:

```text
Payment SUCCESS
       ↓
Order PENDING
       ↓
Webhook FAILED
       ↓
Root Cause Identified
       ↓
Webhook Replayed
       ↓
Order PAID
       ↓
Incident RESOLVED
       ↓
Resolution Remembered
```

---

# 👩‍💻 Author

**Khushboo**

B.Tech Computer Science Engineering

GitHub:
https://github.com/khushhp1609-svg

---

## ⭐ Project Vision

ResolveAI is built around a simple idea:

> **An AI support agent should not only explain a problem — it should help investigate, safely resolve, verify, and remember it.**
