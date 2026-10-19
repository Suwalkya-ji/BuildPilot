import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { getProjectsApi, createProjectApi, deleteProjectApi } from "../api/project.api";
import { generateWebsiteApi } from "../api/ai.api";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProjectGrid from "../components/dashboard/ProjectGrid";
import CreateProjectModal from "../components/dashboard/CreateProjectModal";
import DeleteProjectDialog from "../components/dashboard/DeleteProjectDialog";
import EmptyState from "../components/common/EmptyState";
import Container from "../components/common/Container";
import { formatRelativeTime } from "../components/dashboard/relativeTime";

const Dashboard = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch Projects using TanStack Query
  const { data: projectsRes, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjectsApi,
  });

  const projects = projectsRes?.data || projectsRes || [];

  // Most recent updatedAt across projects, for the "Last updated" stat
  const latestUpdate = projects.reduce((latest, p) => {
    const t = new Date(p?.updatedAt).getTime();
    return Number.isFinite(t) && t > latest ? t : latest;
  }, 0);
  const lastUpdated = latestUpdate ? formatRelativeTime(latestUpdate) : "—";

  // Create Project & Trigger AI Generation Mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const newProjRes = await createProjectApi(data);
      const newProj = newProjRes?.data || newProjRes;
      if (newProj && newProj._id && data.prompt) {
        await generateWebsiteApi({ projectId: newProj._id, prompt: data.prompt });
      }
      return newProj;
    },
    onSuccess: (newProj) => {
      queryClient.invalidateQueries(["projects"]);
      setIsCreateOpen(false);
      toast.success("Project created! AI is generating your code...");
      if (newProj && newProj._id) {
        navigate(`/project/${newProj._id}`);
      }
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create project. Please try again.");
    },
  });

  // Delete Project Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setDeletingProject(null);
      toast.success("Project deleted successfully.");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete project.");
    },
  });

  return (
    <Container size="large">
      <DashboardHeader
        onCreateClick={() => setIsCreateOpen(true)}
        projectCount={projects.length}
        lastUpdated={lastUpdated}
      />

      {isLoading ? (
        <ProjectGrid isLoading={true} />
      ) : isError ? (
        <div className="alert-error p-6 text-center" role="alert">
          Failed to load projects: {error?.response?.data?.message || error?.message || "Server Error"}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects created yet"
          description="Click the button below to generate your first React website with AI."
          action={
            <button type="button" onClick={() => setIsCreateOpen(true)} className="btn btn-primary h-12 px-[22px] text-[15px]">
              <Plus className="btn-spin h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
              Create first project
            </button>
          }
        />
      ) : (
        <ProjectGrid projects={projects} onDelete={(proj) => setDeletingProject(proj)} />
      )}

      {/* Create Modal */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        isSubmitting={createMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteProjectDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => deleteMutation.mutate(deletingProject._id)}
        projectTitle={deletingProject?.title}
        isDeleting={deleteMutation.isPending}
      />
    </Container>
  );
};

export default Dashboard;