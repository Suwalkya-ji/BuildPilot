import { Bot, User, CheckCircle2 } from "lucide-react";

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  // Clean up any legacy raw JSON assistant responses into friendly text summaries
  const getDisplayContent = () => {
    if (isUser) return message.content;
    const contentStr = message.content || "";
    if (contentStr.trim().startsWith("{") && contentStr.includes("files")) {
      return "✅ Generated modular React application. Updated code files are ready in Monaco Editor and Live Preview.";
    }
    return contentStr;
  };

  return (
    <div className={`flex gap-3 text-xs leading-relaxed ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-left ${
          isUser
            ? "bg-indigo-600 text-white rounded-tr-none font-medium"
            : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none font-mono text-[11px]"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> AI Assistant
          </div>
        )}
        <p className="whitespace-pre-wrap">{getDisplayContent()}</p>
      </div>

      {isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
