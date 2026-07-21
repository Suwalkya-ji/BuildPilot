import { useRef, useEffect } from "react";
import { Sparkles, Bot, MessageSquare, MoreHorizontal } from "lucide-react";
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
    <div className="flex h-full flex-col bg-[#11141f] border-t border-white/10 select-none">
      {/* Header BUILDER AI matching Image 2 */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 text-cyan-400" /> BUILDER AI
        </div>
        <MoreHorizontal className="h-4 w-4 text-slate-400 cursor-pointer hover:text-white" />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono">
        {cleanMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md mb-3">
              <Bot className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-white">How do I assist your MERN build?</p>
            <p className="mt-1 text-[11px] text-slate-400">Ask to add components, charts, or backend state.</p>
          </div>
        ) : (
          cleanMessages.map((msg, idx) => <MessageBubble key={idx} message={msg} />)
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono bg-cyan-500/10 border border-cyan-400/30 rounded-xl p-3">
            <Sparkles className="h-3.5 w-3.5 animate-spin text-cyan-400" /> Generating code update via Qdrant RAG...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* RAG Prompt Input Box matching Image 2 */}
      <ChatInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatPanel;
