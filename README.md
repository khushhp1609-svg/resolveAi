ResolveAI — AI-Powered Merchant Incident Resolution Agent

«ResolveAI is an AI-powered merchant support agent that investigates payment incidents, identifies probable root causes, performs safe recovery actions, and remembers previous resolutions.»

🚀 Try ResolveAI

Live Project: https://resolve-ai-three-brown.vercel.app/

Backend Health: https://resolveai-1-lrp2.onrender.com/api/health

GitHub Repository: https://github.com/khushhp1609-svg/resolveAi

---

💡 Problem

Payment failures and mismatches create significant support overhead for merchants.

A merchant may know that:

- A customer paid successfully
- The order still shows as unpaid
- A webhook failed
- The payment status and order status don't match

Normally, resolving this requires checking multiple systems manually.

ResolveAI brings investigation, diagnosis, recovery, and incident memory into one AI-powered workflow.

---

🤖 What ResolveAI Does

A merchant can simply describe the problem in natural language.

For example:

«"Customer paid ₹5,000 but the order is still showing unpaid."»

ResolveAI can:

1. Understand the merchant's issue
2. Identify the relevant transaction
3. Check the payment status
4. Check the order status
5. Investigate webhook events
6. Identify the probable root cause
7. Perform a safe recovery action when allowed
8. Verify the result
9. Mark the incident as resolved
10. Store the incident in memory for future context

---

⭐ Core Demo Scenario

Payment Successful → Order Still Unpaid

Initial state:

Customer Payment
      ↓
₹5,000
      ↓
Payment: SUCCESS
      ↓
Order: UNPAID
      ↓
PAYMENT_SUCCESS Webhook: FAILED

ResolveAI Investigation

Merchant reports issue
        ↓
AI understands incident
        ↓
Get Transaction
        ↓
Get Order
        ↓
Check Webhook Logs
        ↓
Identify Root Cause
        ↓
Replay Failed Webhook
        ↓
Verify Webhook Success
        ↓
Verify Order = PAID
        ↓
Incident RESOLVED

Root Cause

The payment was successful, but the "PAYMENT_SUCCESS" webhook failed because the merchant endpoint timed out.

ResolveAI identifies the mismatch and safely replays the failed webhook.

---

🧠 AI Agent

ResolveAI uses Gemini Flash as its reasoning layer.

The AI agent can work with backend investigation and action tools such as:

- "getTransaction()"
- "getOrder()"
- "getWebhookLogs()"
- "replayWebhook()"

The backend remains responsible for validating whether an action is actually safe to execute.

This separates:

AI reasoning → Tool execution → Business validation → Database state

The AI does not directly modify critical payment state.

---

🛡️ Safety First

Payment-related actions should never depend blindly on an AI response.

Before replaying a webhook, ResolveAI validates conditions such as:

- Transaction exists
- Transaction status is "SUCCESS"
- Order exists
- Order is not already "PAID"
- A failed "PAYMENT_SUCCESS" webhook exists
- The requested recovery action is valid

The database remains the source of truth.

This prevents the AI from arbitrarily changing critical payment states.

---

🧠 Incident Memory

ResolveAI doesn't treat every conversation as completely independent.

It stores structured incident information including:

- Conversation
- Messages
- Incident status
- Root cause
- Resolution
- Related transaction
- Related order
- Resolution history

Instead of repeatedly sending an entire conversation history to the AI, the memory layer can provide relevant structured context.

Example

Previous Incident
      ↓
Payment successful
      ↓
Webhook failed
      ↓
Webhook replayed
      ↓
Order updated
      ↓
Resolved

This creates the foundation for a merchant support agent that can become more context-aware over time.

---

🏗️ Architecture

                    Merchant
                       │
                       ▼
                React Frontend
                       │
                       ▼
                Express Backend
                       │
              ┌────────┴────────┐
              ▼                 ▼
         AI Agent          Memory Layer
        Gemini Flash       Incident Context
              │
              ▼
        Investigation Tools
              │
       ┌──────┼────────┐
       ▼      ▼        ▼
 Transaction Order   Webhooks
       │      │        │
       └──────┼────────┘
              ▼
        Safety Validation
              │
              ▼
        Recovery Action
              │
              ▼
          MongoDB

---

🔄 End-to-End Flow

Merchant Message
       ↓
Understand Incident
       ↓
Identify Relevant Data
       ↓
Investigate Transaction
       ↓
Investigate Order
       ↓
Inspect Webhooks
       ↓
Determine Root Cause
       ↓
Validate Recovery Action
       ↓
Execute Safe Action
       ↓
Verify Result
       ↓
Update Incident
       ↓
Store Memory

---

🎯 Supported / Planned Incident Types

Current MVP

Payment / Order Mismatch

Example:

«Payment is successful but order is unpaid.»

Planned Extensions

- Payment deducted but merchant doesn't see it
- Settlement issues
- KYC-related issues
- Additional webhook failures
- Automated incident escalation
- More merchant support workflows

---

🖥️ Frontend

The frontend provides a ChatGPT-style merchant support interface where users can:

- Describe payment issues
- Interact with ResolveAI
- Receive investigation results
- View resolution status
- Continue conversations
- Maintain incident context

Built using:

- React
- Vite
- Tailwind CSS
- JavaScript

---

🗄️ Data Model

ResolveAI uses MongoDB with collections/models including:

Users
Conversations
Messages
Incidents
Transactions
Orders
Events

This structure separates conversational data from payment and incident data.

---

🛠️ Tech Stack

Frontend

- React
- Vite
- Tailwind CSS
- JavaScript

Backend

- Node.js
- Express.js
- REST APIs

AI

- Google Gemini / Gemini Flash

Database

- MongoDB Atlas
- Mongoose

Deployment

- Vercel
- Render
- MongoDB Atlas

---

📁 Project Structure

resolveAi/
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── aiAgentService.js
│   │   └── memoryService.js
│   ├── tools/
│   │   ├── transactionTool.js
│   │   ├── orderTool.js
│   │   ├── webhookTool.js
│   │   └── replayWebhookTool.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── ...
│
└── README.md

---

🚀 Run Locally

1. Clone the repository

git clone https://github.com/khushhp1609-svg/resolveAi.git
cd resolveAi

2. Start Backend

cd backend
npm install
npm run dev

3. Start Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Then open the local frontend URL shown by Vite.

---

🧪 Demo

To test the main workflow:

1. Open the live ResolveAI application
2. Enter:

Customer paid ₹5000 but the order is still unpaid.

3. Let ResolveAI investigate the incident
4. Review the transaction and order information
5. Review the webhook failure
6. Observe the identified root cause
7. Trigger the safe webhook replay
8. Verify the updated order status
9. Observe the incident being resolved
10. Continue the conversation to demonstrate retained context

---

🔐 Security & Reliability Principles

ResolveAI follows a few important principles:

- AI does not directly control critical payment state
- Backend validates recovery actions
- Database is the source of truth
- Recovery actions require verified conditions
- Investigation and execution are separated
- Incidents are recorded for traceability

---

📌 Implementation Status

Feature| Status
Merchant Chat Interface| ✅
AI Reasoning| ✅
Transaction Investigation| ✅
Order Investigation| ✅
Webhook Investigation| ✅
Safe Webhook Replay| ✅
Incident Memory| ✅
Root Cause Detection| ✅
End-to-End Demo| ✅
Live MVP Deployment| ✅

---

🌱 Future Scope

ResolveAI can be extended into a broader merchant operations agent with:

- More payment incident types
- Automated incident prioritization
- Merchant-specific memory
- Multi-step autonomous investigations
- Human escalation
- Advanced observability
- Real payment gateway integrations
- Analytics and incident dashboards
- Proactive detection of recurring payment issues

---

🎯 Why ResolveAI?

Traditional payment support often requires merchants or support teams to manually:

Find → Check → Investigate → Diagnose → Fix → Verify

ResolveAI aims to turn that into:

Ask → Investigate → Diagnose → Safely Resolve → Remember

The goal is not simply to build another chatbot.

It is to build an AI-powered incident resolution agent that can reason over payment data, use investigation tools, perform controlled recovery actions, verify the outcome, and maintain incident memory.

---

⚠️ Disclaimer

This project is an MVP / hackathon prototype demonstrating an AI-assisted merchant incident resolution workflow using simulated payment infrastructure. It is not intended to process real customer payments or production financial data.

---

👩‍💻 Author

Khushboo

B.Tech Computer Science Engineering

ResolveAI — AI-Powered Merchant Incident Resolution Agent

«From payment problem to verified resolution.»
