🚀 ResolveAI

AI-Powered Merchant Incident Resolution Agent

«Don't just answer merchant problems. Investigate them, resolve them, and remember what happened.»

ResolveAI is an AI-powered merchant support agent designed to investigate and resolve payment-related incidents.

Instead of simply responding to a merchant's question, ResolveAI investigates the underlying payment systems, identifies the probable root cause, performs safe actions when possible, verifies the result, and stores the resolution as incident memory for future conversations.

---

🎯 The Problem

Payment issues often require merchants or support teams to manually check multiple systems:

Merchant reports an issue

↓

Check Transaction

↓

Check Order

↓

Check Webhook Logs

↓

Identify Root Cause

↓

Take Action

↓

Verify Resolution

This process is time-consuming and requires switching between multiple systems.

ResolveAI turns this into:

Merchant → AI Agent → Investigation → Root Cause → Safe Action → Verification → Memory

---

💡 What ResolveAI Does

ResolveAI can:

- 🔍 Investigate payment incidents
- 💳 Retrieve and analyze transaction information
- 📦 Compare payment and order states
- 🪝 Inspect webhook events and failures
- 🧠 Identify probable root causes
- ⚡ Execute safe recovery actions
- ✅ Verify whether the issue was resolved
- 🧠 Remember previous incidents and resolutions
- 🚨 Escalate when an issue cannot be safely resolved

---

⭐ Core Demo Scenario

Payment Successful — Order Still Unpaid

A merchant says:

«"The customer paid ₹5,000, but the order is still showing unpaid."»

ResolveAI investigates the incident instead of immediately giving a generic response.

Step 1 — Investigate Transaction

Transaction
Status: SUCCESS
Amount: ₹5,000

Step 2 — Check Order

Order
Status: UNPAID

Step 3 — Check Webhook

Webhook
Status: FAILED
Event: payment.captured

Step 4 — Identify Root Cause

⚠ Root Cause Detected

Payment succeeded, but the payment webhook
failed to update the merchant order.

Step 5 — Take Safe Action

⚡ Action

Replay failed webhook

Step 6 — Verify

✓ Webhook delivered
✓ Order synchronized
✓ Incident resolved

Step 7 — Remember

The resolution is stored as structured incident memory so that ResolveAI can use it in future conversations.

---

🧠 Why Memory Matters

Traditional chatbots primarily rely on conversation history.

ResolveAI introduces an incident-based memory layer.

Instead of storing only:

Merchant: What happened to my payment?
AI: ...

ResolveAI stores meaningful resolution information:

Incident:
Payment/Order mismatch

Root Cause:
Failed payment webhook

Action:
Webhook replayed

Result:
Order synchronized successfully

This allows the system to retrieve relevant past incidents without sending the entire conversation history to the model every time.

---

🤖 AI Agent Architecture

                    ┌──────────────────┐
                    │     Merchant     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   ResolveAI      │
                    │    AI Agent      │
                    └────────┬─────────┘
                             │
             ┌───────────────┼────────────────┐
             ▼               ▼                ▼
      Transaction Tool   Order Tool     Webhook Tool
             │               │                │
             └───────────────┼────────────────┘
                             ▼
                    ┌──────────────────┐
                    │ Incident Engine  │
                    │ & Root Cause     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Safety Checks   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Safe Action /    │
                    │ Human Escalation │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Verification  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Incident Memory │
                    └──────────────────┘

---

🛡️ Safety First

Payment-related actions should never be executed blindly.

ResolveAI separates investigation from action.

Before an action such as webhook replay is performed, the backend validates the relevant state.

Example

Transaction = SUCCESS
Order = UNPAID
Webhook = FAILED
        ↓
Action permitted
        ↓
Replay webhook
        ↓
Verify result

If the required conditions are not satisfied, the system does not blindly execute the action.

Instead, it can escalate the incident for human intervention.

---

🔥 Supported Incident Scenarios

1. Payment / Order Mismatch ⭐

Payment = SUCCESS
Order = UNPAID
Webhook = FAILED

ResolveAI identifies the failed webhook and can simulate a webhook replay.

2. Payment Deducted but Merchant Doesn't See It

The agent investigates the transaction state and related events to determine the probable cause.

3. Settlement / KYC Issue

The system can investigate settlement or verification-related incidents and determine whether further action or escalation is required.

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

Database

- MongoDB Atlas

AI

- Google Gemini

Other

- REST APIs
- Git / GitHub
- Vercel
- Render

---

📁 Project Structure

resolveAi/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── ...
│
├── backend/
│   ├── services/
│   │   ├── aiAgentService.js
│   │   ├── memoryService.js
│   │   └── ...
│   │
│   ├── tools/
│   │   ├── transactionTool.js
│   │   ├── orderTool.js
│   │   ├── webhookTool.js
│   │   └── replayWebhookTool.js
│   │
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md

---

🔄 Example Agent Flow

Merchant:
"Customer paid but my order is still unpaid."

                ↓

        ResolveAI receives request

                ↓

       Identify payment incident

                ↓

        Get transaction details

                ↓

          Get order details

                ↓

         Inspect webhook logs

                ↓

         Correlate the evidence

                ↓

         Identify root cause

                ↓

       Validate action safety

                ↓

          Replay webhook

                ↓

          Verify new state

                ↓

         Mark incident resolved

                ↓

       Store incident memory

---

🧪 Running Locally

1. Clone the repository

git clone https://github.com/khushhp1609-svg/resolveAi.git

cd resolveAi

2. Install dependencies

Backend

cd backend
npm install

Frontend

cd ../frontend
npm install

3. Configure environment variables

Create the required ".env" files for the backend and frontend.

Example:

MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000

Never commit API keys or environment files to GitHub.

4. Start the backend

cd backend
npm run dev

5. Start the frontend

cd frontend
npm run dev

---

🌐 Deployment

ResolveAI is deployed as an MVP using:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

«The payment infrastructure in this project is simulated for demonstration purposes.»

---

📊 What Makes ResolveAI Different?

Traditional Support

Merchant
   ↓
Support Ticket
   ↓
Human Investigation
   ↓
Multiple Systems
   ↓
Engineering / Operations
   ↓
Resolution

ResolveAI

Merchant
   ↓
ResolveAI
   ↓
Investigates Multiple Systems
   ↓
Finds Root Cause
   ↓
Safe Automated Action
   ↓
Verification
   ↓
Incident Memory

The goal isn't to replace human support.

The goal is to automate investigation and resolution of repetitive, well-understood incidents while escalating uncertain or risky cases to humans.

---

🚀 Future Scope

ResolveAI can be extended with:

- Real payment gateway integrations
- More incident types
- Advanced root-cause detection
- Merchant-specific memory
- Confidence scoring
- Human-in-the-loop approvals
- Detailed audit trails
- Role-based permissions
- Automated incident prioritization
- Analytics for recurring merchant issues

---

🎥 Demo

Demo Video:
Add your pitch/demo video link here

Live Application:
Add your deployed application URL here

---

👨‍💻 Built For

Razorpay AI Buildathon 2026

Project

ResolveAI — AI-Powered Merchant Incident Resolution Agent

One-line summary

«ResolveAI turns merchant payment support from a ticket-based process into an intelligent investigation and resolution workflow.»

---

📜 Disclaimer

ResolveAI is a hackathon MVP created for demonstration purposes.

Payment transactions, webhook events, and recovery actions are simulated and should not be treated as real financial operations.
