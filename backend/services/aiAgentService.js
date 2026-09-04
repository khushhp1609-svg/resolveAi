
require("dotenv").config();

const https = require("https");

const { getTransaction } = require("../tools/transactionTool");
const { getOrder } = require("../tools/orderTool");
const { getWebhookLogs } = require("../tools/webhookTool");
const { replayWebhook } = require("../tools/replayWebhookTool");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.5-flash-lite";

function callGemini(input, systemInstruction = "") {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      model: GEMINI_MODEL,
      input,
      ...(systemInstruction
        ? { system_instruction: systemInstruction }
        : {}),
    });

    const options = {
      hostname: "generativelanguage.googleapis.com",
      path: `/v1beta/interactions?key=${encodeURIComponent(
        GEMINI_API_KEY
      )}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);

          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(
              new Error(
                parsed.error?.message ||
                  `Gemini API returned status ${res.statusCode}`
              )
            );
          }

          resolve(parsed);
        } catch (error) {
          reject(new Error(`Invalid Gemini response: ${data}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(requestBody);
    req.end();
  });
}

function extractText(interaction) {
  if (!interaction?.steps) {
    return "";
  }

  for (const step of interaction.steps) {
    if (step.type === "model_output" && step.content) {
      for (const content of step.content) {
        if (content.type === "text") {
          return content.text;
        }
      }
    }
  }

  return "";
}

function parseJson(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    return null;
  }
}

async function runResolveAIAgent({ userMessage, memory }) {
  try {
    const incident = memory.activeIncident;

    if (!incident) {
      return {
        success: true,
        response:
          "I couldn't find an active incident for this conversation.",
      };
    }

    // =========================================================
    // STEP 1 — Determine investigation
    // =========================================================

    const transactionId = incident.transactionId;

    if (!transactionId) {
      return {
        success: false,
        response:
          "I couldn't identify the transaction associated with this incident.",
        error: "Incident transactionId is missing",
      };
    }

    let decision = {
      transactionId,
      needTransaction: true,
      needOrder: true,
      needWebhook: true,
    };

    /*
      For PAYMENT_ORDER_MISMATCH incidents, all three
      investigation tools are required.
    */

    if (incident.type !== "PAYMENT_ORDER_MISMATCH") {
      const decisionPrompt = `
You are the investigation decision engine of ResolveAI.

Determine which investigation data is required for the merchant incident.

AVAILABLE INVESTIGATION TOOLS:

1. getTransaction(transactionId)
2. getOrder(transactionId)
3. getWebhookLogs(transactionId)

IMPORTANT RULES:

- The transaction ID below is authoritative.
- Never change or invent the transaction ID.
- Do not perform any action.
- Return ONLY valid JSON.
- Do not use markdown.

Return exactly:

{
  "transactionId": "${transactionId}",
  "needTransaction": true or false,
  "needOrder": true or false,
  "needWebhook": true or false
}

ACTIVE INCIDENT:
${JSON.stringify(incident, null, 2)}

MERCHANT MESSAGE:
${userMessage}
`;

      try {
  const decisionResult = await callGemini(
    decisionPrompt,
    "You are ResolveAI's internal investigation decision engine."
  );

  const decisionText = extractText(decisionResult).trim();

  console.log("Gemini decision:", decisionText);

  const parsedDecision = parseJson(decisionText);

  if (parsedDecision) {
    decision = {
      transactionId,
      needTransaction:
        parsedDecision.needTransaction === true,
      needOrder:
        parsedDecision.needOrder === true,
      needWebhook:
        parsedDecision.needWebhook === true,
    };
  }
} catch (geminiError) {
  console.warn(
    "Gemini unavailable. Using deterministic investigation fallback:",
    geminiError.message
  );
}
    }

    console.log(
      "Final investigation decision:",
      JSON.stringify(decision, null, 2)
    );

    // =========================================================
    // STEP 2 — Execute investigation tools
    // =========================================================

    let transactionResult = null;
    let orderResult = null;
    let webhookResult = null;

    if (decision.needTransaction) {
      console.log(
        "Executing getTransaction:",
        transactionId
      );

      transactionResult = await getTransaction(transactionId);

      console.log(
        "Transaction result:",
        JSON.stringify(transactionResult, null, 2)
      );
    }

    if (decision.needOrder) {
      console.log(
        "Executing getOrder:",
        transactionId
      );

      orderResult = await getOrder(transactionId);

      console.log(
        "Order result:",
        JSON.stringify(orderResult, null, 2)
      );
    }

    if (decision.needWebhook) {
      console.log(
        "Executing getWebhookLogs:",
        transactionId
      );

      webhookResult = await getWebhookLogs(transactionId);

      console.log(
        "Webhook result:",
        JSON.stringify(webhookResult, null, 2)
      );
    }

    // =========================================================
    // STEP 3 — Deterministic SAFE ACTION check
    // =========================================================

    let canReplayWebhook = false;

    if (
      transactionResult?.success &&
      orderResult?.success &&
      webhookResult?.success
    ) {
      const transactionStatus =
        transactionResult.data?.status;

      const orderStatus =
        orderResult.data?.status;

      const webhookEvents =
        webhookResult.data || [];

      const failedPaymentSuccessWebhook =
        webhookEvents.some(
          (event) =>
            event.eventType === "PAYMENT_SUCCESS" &&
            event.status === "FAILED"
        );

      canReplayWebhook =
        transactionStatus === "SUCCESS" &&
        orderStatus !== "PAID" &&
        failedPaymentSuccessWebhook;
    }

    console.log(
      "Safe replay check:",
      canReplayWebhook
    );

    // =========================================================
    // STEP 4 — Execute SAFE action
    // =========================================================

    let actionResult = null;

    if (canReplayWebhook) {
      console.log(
        "Executing replayWebhook:",
        transactionId
      );

      actionResult = await replayWebhook(transactionId);

      console.log(
        "Replay result:",
        JSON.stringify(actionResult, null, 2)
      );
    }

    // =========================================================
    // STEP 5 — Generate merchant response WITHOUT another
    // Gemini API call
    // =========================================================

    let finalResponse;

if (canReplayWebhook && actionResult?.success) {
  finalResponse =
    "The payment was successful, but the order remained pending because the PAYMENT_SUCCESS webhook failed. The webhook was successfully replayed and the order is now synchronized.";
} else if (
  transactionResult?.success &&
  orderResult?.success &&
  webhookResult?.success
) {
  const transactionStatus =
    transactionResult.data?.status;

  const orderStatus =
    orderResult.data?.status;

  const webhookEvents =
    webhookResult.data || [];

  const replayedPaymentSuccessWebhook =
    webhookEvents.find(
      (event) =>
        event.eventType === "PAYMENT_SUCCESS" &&
        event.status === "SUCCESS" &&
        event.replayed === true
    );

  if (
    transactionStatus === "SUCCESS" &&
    orderStatus === "PAID" &&
    replayedPaymentSuccessWebhook
  ) {
    finalResponse =
      "This incident was previously resolved. The payment was successful, the PAYMENT_SUCCESS webhook initially failed, and the webhook was successfully replayed. The order is now synchronized to PAID.";
  } else {
    finalResponse =
      "I investigated the transaction, order, and webhook logs. The verified results do not indicate that a webhook replay is currently required.";
  }
} else {
  finalResponse =
    "I investigated the available payment data, but I could not complete the resolution with the verified information available.";
}

    return {
      success: true,
      response: finalResponse,
      investigation: {
        transaction: transactionResult,
        order: orderResult,
        webhook: webhookResult,
      },
      action: {
        canReplayWebhook,
        result: actionResult,
      },
    };
  } catch (error) {
    console.error(
      "ResolveAI Agent error:",
      error
    );

    return {
      success: false,
      response:
        "I encountered an error while investigating and resolving the incident.",
      error: error.message,
    };
  }
}

module.exports = {
  runResolveAIAgent,
};

