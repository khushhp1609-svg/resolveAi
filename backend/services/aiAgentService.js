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

    /*
      IMPORTANT:

      The incident's transactionId is authoritative.

      We do not allow old conversation history to change
      the transaction being investigated.
    */

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
      investigation tools are always required.

      Gemini is still used later for reasoning and response
      generation, but critical investigation is deterministic.
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
          needTransaction: parsedDecision.needTransaction === true,
          needOrder: parsedDecision.needOrder === true,
          needWebhook: parsedDecision.needWebhook === true,
        };
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

    /*
      Gemini should NOT be trusted as the final safety gate.

      The backend verifies the actual database results before
      allowing replayWebhook() to execute.
    */

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
    // STEP 5 — Generate final merchant response
    // =========================================================

    const finalPrompt = `
You are ResolveAI, an AI-powered merchant incident
resolution agent.

Explain the verified result to the merchant.

IMPORTANT RULES:

1. Use ONLY the verified data provided below.
2. Never invent transaction, order, webhook, or incident data.
3. Never claim an action happened unless ACTION RESULT
   contains success=true.
4. If replayWebhook succeeded:
   - say the failed webhook was replayed
   - say the order was synchronized to PAID
   - say the incident was resolved
5. If replayWebhook failed:
   - clearly say the action could not be completed
6. If no action was performed:
   - do not claim that an action was performed
7. Keep the response concise and professional.
8. Do not mention Gemini, prompts, internal tools, or JSON.

ACTIVE INCIDENT:
${JSON.stringify(incident, null, 2)}

TRANSACTION RESULT:
${JSON.stringify(transactionResult, null, 2)}

ORDER RESULT:
${JSON.stringify(orderResult, null, 2)}

WEBHOOK RESULT:
${JSON.stringify(webhookResult, null, 2)}

SAFE REPLAY CHECK:
${JSON.stringify(canReplayWebhook, null, 2)}

ACTION RESULT:
${JSON.stringify(actionResult, null, 2)}

MERCHANT MESSAGE:
${userMessage}
`;

    const finalResult = await callGemini(
      finalPrompt,
      "You are ResolveAI, a reliable merchant payment incident resolution agent."
    );

    const finalResponse = extractText(finalResult);

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