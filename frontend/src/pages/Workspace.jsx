
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import IncidentHeader from "../components/IncidentHeader";
import ChatMessage from "../components/ChatMessage";
import InvestigationCard from "../components/InvestigationCard";
import MemoryCard from "../components/MemoryCard";
import ChatInput from "../components/ChatInput";
import ContextPanel from "../components/ContextPanel";
import { sendChatMessage, resetDemo } from "../services/api";

export default function Workspace() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [investigation, setInvestigation] = useState({
    transaction: {
      transactionId: "TXN1001",
      status: "SUCCESS",
    },
    order: {
      orderId: "ORD1001",
      status: "PENDING",
    },
    webhook: {
      eventId: "EVT1001",
      status: "FAILED",
    },
    resolution: {
      status: "PENDING",
    },
  });

  const [incidentStatus, setIncidentStatus] = useState("Investigating");
  const [memory, setMemory] = useState(null);

  const conversationId = "CONV1001";
  const userId = "MERCHANT001";

  const handleReset = async () => {
    try {
      const result = await resetDemo("TXN1001");

      setMessages([]);
      setMemory(null);
      setLoading(false);
      setIncidentStatus("Investigating");

      setInvestigation({
        transaction: {
          transactionId: "TXN1001",
          status: result.data?.transactionStatus || "SUCCESS",
        },
        order: {
          orderId: "ORD1001",
          status: result.data?.orderStatus || "PENDING",
        },
        webhook: {
          eventId: "EVT1001",
          status: result.data?.webhookStatus || "FAILED",
        },
        resolution: {
          status: "PENDING",
        },
      });
    } catch (error) {
      console.error("Reset demo failed:", error);
    }
  };

  const handleSend = async (content) => {
    const merchantMessage = {
      id: Date.now(),
      from: "merchant",
      content,
    };

    setMessages((prev) => [...prev, merchantMessage]);
    setLoading(true);

    try {
      const result = await sendChatMessage({
        conversationId,
        userId,
        content,
      });

      setMemory(result?.data?.memory || null);

      if (result?.data?.investigation) {
        setInvestigation(result.data.investigation);
      }

      if (result?.data?.memory?.activeIncident) {
        setIncidentStatus(
          result.data.memory.activeIncident.status === "RESOLVED"
            ? "Resolved"
            : "Investigating"
        );
      }

      const aiResponse = result?.data?.response?.content;

      if (aiResponse) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            from: "agent",
            content: aiResponse,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "agent",
          content:
            error.message ||
            "Sorry, I couldn't process the incident right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          onReset={handleReset}
        />

        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <IncidentHeader
              title="Payment / Order mismatch"
              caseId="INC-10291"
              tone={
                incidentStatus === "Resolved"
                  ? "success"
                  : "investigating"
              }
              statusLabel={incidentStatus}
            />

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 lg:px-8">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  from={message.from}
                >
                  {message.content}
                </ChatMessage>
              ))}

              <InvestigationCard
                investigation={investigation}
              />

              <MemoryCard memory={memory} />

              {loading && (
                <ChatMessage from="agent">
                  <div className="space-y-1">
                    <p>Investigating the incident...</p>
                    <p className="font-mono text-xs text-ink-soft">
                      Checking transaction → order → webhook
                    </p>
                  </div>
                </ChatMessage>
              )}
            </div>

            <ChatInput
              onSend={handleSend}
              disabled={loading}
            />
          </div>

          <ContextPanel memory={memory} />
        </div>
      </div>
    </div>
  );
}
