import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 dark:border-white/10 bg-[#0b0d13] dark:bg-[#0b0d13] light-chat-form">
      <div className="text-[11px] font-bold text-slate-300 dark:text-slate-300 mb-1.5 text-left font-mono light-rag-title">RAG prompt</div>
      <div className="relative flex flex-col gap-2 rounded-xl border border-white/15 dark:border-white/15 bg-[#131722] dark:bg-[#131722] p-2.5 shadow-inner light-rag-box focus-within:border-[#B23A48] focus-within:ring-2 focus-within:ring-[#B23A48]/20 transition-all">
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type your instruction or question... Use RAG/Context"
          className="w-full resize-none bg-transparent text-xs text-slate-100 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 font-mono light-rag-textarea !border-none !outline-none !shadow-none !ring-0 focus:!outline-none focus:!ring-0 focus:!border-none"
        />
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B23A48] via-[#C94A46] to-[#E07A5F] dark:from-cyan-400 dark:via-indigo-500 dark:to-fuchsia-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                <span className="text-white font-bold">Generating...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5 text-white" />
                <span className="text-white font-bold">Ask BuildPilot</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
