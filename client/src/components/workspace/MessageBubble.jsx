const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  const getDisplayContent = () => {
    if (isUser) return message.content;
    const contentStr = message.content || "";
    if (contentStr.trim().startsWith("{") && contentStr.includes("files")) {
      return "Generated modular React application. Updated code files are ready in the editor and live preview.";
    }
    return contentStr;
  };

  if (isUser) {
    return (
      <div className="anim-msg max-w-[85%] self-end rounded-[16px_16px_4px_16px] bg-user-bubble px-3.5 py-2.5 text-[13.5px] leading-normal text-user-fg">
        <p className="whitespace-pre-wrap break-words">{getDisplayContent()}</p>
      </div>
    );
  }

  return (
    <div className="anim-msg max-w-[85%] self-start rounded-[16px_16px_16px_4px] border border-line bg-ai-bubble px-3.5 py-2.5 text-[13.5px] leading-normal text-fg">
      <div className="mb-1 text-[11px] font-semibold text-ai-label">BuildPilot AI</div>
      <p className="whitespace-pre-wrap break-words">{getDisplayContent()}</p>
    </div>
  );
};

export default MessageBubble;
