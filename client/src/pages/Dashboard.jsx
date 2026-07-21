import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getProjectsApi, createProjectApi, deleteProjectApi } from "../api/project.api";
import { generateWebsiteApi } from "../api/ai.api";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProjectGrid from "../components/dashboard/ProjectGrid";
import CreateProjectModal from "../components/dashboard/CreateProjectModal";
import DeleteProjectDialog from "../components/dashboard/DeleteProjectDialog";
import EmptyState from "../components/common/EmptyState";
import Container from "../components/common/Container";

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
    <Container>
      <DashboardHeader onCreateClick={() => setIsCreateOpen(true)} projectCount={projects.length} />

      {isLoading ? (
        <ProjectGrid isLoading={true} />
      ) : isError ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-xs text-red-400">
          Failed to load projects: {error?.response?.data?.message || error?.message || "Server Error"}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects created yet"
          description="Click the button below to generate your first React website with AI."
          action={
            <button
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition"
            >
              + Create First Project
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