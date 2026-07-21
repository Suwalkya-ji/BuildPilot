const PageHeader = ({ title, description, action }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6 mb-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
