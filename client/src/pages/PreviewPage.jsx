import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectApi } from "../api/project.api";
import { normalizeSandpackFiles } from "../utils/previewBuilder";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";
import Loader from "../components/common/Loader";
import Logo from "../components/common/Logo";

const PreviewPage = () => {
  const { projectId } = useParams();

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
      <div className="flex h-screen items-center justify-center bg-[#0b0d13]">
        <Loader text="Preparing Live Web Preview..." />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0d13] text-rose-400 text-xs">
        Failed to load project preview.
      </div>
    );
  }

  const files = project.generatedFiles || [];
  const sandpackFiles = normalizeSandpackFiles(files);

  return (
    <div className="flex h-screen w-screen flex-col bg-[#0b0d13] text-slate-100 overflow-hidden">
      {/* Top Banner */}
      <header className="flex h-12 items-center justify-between border-b border-white/10 bg-[#131722] px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-white/30">|</span>
          <span className="text-xs font-bold text-white font-mono">
            {project.title} — Fullscreen Preview
          </span>
        </div>
        <div className="text-[11px] text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-400/30 px-3 py-1 rounded-full">
          Live Sandbox
        </div>
      </header>

      {/* Sandpack Fullscreen Preview */}
      <div className="flex-1 overflow-hidden">
        {files.length > 0 ? (
          <SandpackProvider
            template="react"
            theme="dark"
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
          <div className="flex h-full items-center justify-center flex-col gap-3 text-slate-500 text-xs font-mono">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <span>AI is generating your website...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
