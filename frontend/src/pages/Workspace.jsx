import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import IncidentHeader from "../components/IncidentHeader";
import ChatMessage from "../components/ChatMessage";
import InvestigationCard from "../components/InvestigationCard";
import MemoryCard from "../components/MemoryCard";
import ChatInput from "../components/ChatInput";
import ContextPanel from "../components/ContextPanel";

export default function Workspace() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Local-only messages typed by the demo user. No backend call — the AI
  // agent isn't connected until a later phase.
  const [extraMessages, setExtraMessages] = useState([]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <IncidentHeader
              title="Payment / Order mismatch"
              caseId="INC-10291"
              tone="investigating"
              statusLabel="Investigating"
            />

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 lg:px-8">
              <ChatMessage from="merchant">
                ₹5,000 was deducted but my order still says unpaid.
              </ChatMessage>

              <ChatMessage from="agent">
                I'll investigate this payment incident by checking the transaction, order
                state, and payment events.
              </ChatMessage>

              <InvestigationCard />

              <MemoryCard />

              {extraMessages.map((msg, i) => (
                <ChatMessage key={i} from="merchant">
                  {msg}
                </ChatMessage>
              ))}
            </div>

            <ChatInput onSend={(msg) => setExtraMessages((prev) => [...prev, msg])} />
          </div>

          <ContextPanel />
        </div>
      </div>
    </div>
  );
}
