import { useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

const ChatPanel = ({ messages = [], onSendMessage, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Filter out consecutive duplicate messages
  const cleanMessages = messages.filter((msg, idx) => {
    if (idx === 0) return true;
    const prev = messages[idx - 1];
    return !(prev.role === msg.role && prev.content === msg.content);
  });

  return (
    <section className="flex h-full flex-col bg-surface" aria-label="AI builder">
      <div className="flex h-11 shrink-0 items-center border-b border-line px-3.5">
        <span className="eyebrow">AI builder</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3.5 py-4" aria-live="polite">
        {cleanMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-icon-tile text-icon-ink">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="font-display text-xl leading-snug text-fg">How can I help with your build?</p>
            <p className="mt-1 text-[13px] text-muted">Ask to add components, pages, charts or state.</p>
          </div>
        ) : (
          cleanMessages.map((msg, idx) => <MessageBubble key={idx} message={msg} />)
        )}

        {isLoading && (
          <div
            className="anim-msg inline-flex items-center gap-2.5 self-start rounded-full bg-warn-bg px-3.5 py-2.5 text-[12.5px] font-medium text-warn-fg"
            role="status"
          >
            <span className="inline-flex gap-1" aria-hidden="true">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </span>
            Updating your code…
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </section>
  );
};

export default ChatPanel;
