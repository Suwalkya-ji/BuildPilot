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
    <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-[#0b0d13]">
      <div className="text-[11px] font-bold text-slate-300 mb-1.5 text-left font-mono">RAG prompt</div>
      <div className="relative flex flex-col gap-2 rounded-xl border border-white/15 bg-[#131722] p-2.5 shadow-inner">
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
          className="w-full resize-none bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
        />
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="nav-glow-btn active:scale-95 transition-transform disabled:opacity-40"
          >
            <span className="nav-glow-btn-inner bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 py-1.5 px-4 text-xs text-white font-bold flex items-center gap-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Send className="h-3 w-3" /> Ask BuildPilot
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
