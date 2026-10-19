const Loader = ({ text = "Loading...", fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-accent border-t-transparent" />
      {text && <p className="text-sm text-muted">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
