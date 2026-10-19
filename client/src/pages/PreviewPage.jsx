import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectApi } from "../api/project.api";
import { normalizeSandpackFiles } from "../utils/previewBuilder";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import Loader from "../components/common/Loader";
import Logo from "../components/common/Logo";
import { useTheme } from "../context/ThemeContext";

const PreviewPage = () => {
  const { projectId } = useParams();
  const { theme } = useTheme();

  const { data: projectRes, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectApi(projectId),
    enabled: !!projectId,
    refetchInterval: (query) => {
      const proj = query.state.data?.data || query.state.data;
      return proj?.status === "queued" || proj?.status === "generating" ? 2000 : false;
    },
  });

  const project = projectRes?.data || projectRes;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <Loader text="Preparing live preview…" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg p-4">
        <div className="alert-error" role="alert">Failed to load project preview.</div>
      </div>
    );
  }

  const files = project.generatedFiles || [];
  const sandpackFiles = normalizeSandpackFiles(files);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-bg text-fg">
      <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Logo className="shrink-0" />
          <span className="hidden h-5 w-px shrink-0 bg-line sm:block" aria-hidden="true" />
          <h1 className="hidden min-w-0 truncate font-mono text-xs text-muted sm:block">
            <span className="text-fg">{project.title}</span> — Fullscreen preview
          </h1>
        </div>
        <span className="badge badge-ready shrink-0">
          <span className="badge-dot anim-pulse" />
          Live sandbox
        </span>
      </header>

      <div className="flex-1 overflow-hidden">
        {files.length > 0 ? (
          <SandpackProvider
            template="react"
            theme={theme === "dark" ? "dark" : "light"}
            files={sandpackFiles}
            options={{
              externalResources: ["https://cdn.tailwindcss.com"],
              recompileMode: "delayed",
              recompileDelay: 300,
            }}
          >
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={true}
              showRestartButton={true}
              style={{ height: "100%", width: "100%" }}
            />
          </SandpackProvider>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-muted" role="status">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span>AI is generating your website…</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
