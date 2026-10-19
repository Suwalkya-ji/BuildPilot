import { useState } from "react";
import { Loader2 } from "lucide-react";

const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-3 flex shrink-0 flex-col gap-2 rounded-2xl border-[1.5px] border-accent bg-bg p-2.5"
      style={{ boxShadow: "0 0 0 4px var(--accent-soft)" }}
    >
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
        aria-label="Message the AI"
        placeholder="Ask AI to change something…"
        className="w-full resize-none bg-transparent px-1 text-[13.5px] text-fg outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="btn btn-primary h-[34px] self-end px-4 text-[13px]"
      >
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {isLoading ? "Generating…" : "Send"}
      </button>
    </form>
  );
};

export default ChatInput;
