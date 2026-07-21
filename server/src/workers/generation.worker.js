import { Worker } from "bullmq";
import bullmqConnection from "../config/bullmq.js";
import { generateWebsiteService } from "../services/ai.service.js";
import { indexProjectFile } from "../services/vector.service.js";
import { getIO } from "../config/socket.js";
import Project from "../models/project.model.js";

const generationWorker = new Worker(
  "website-generation",
  async (job) => {
    const { projectId, prompt, userId } = job.data;

    const project = await Project.findOne({
      _id: projectId,
      owner: userId,
    });

    if (!project) {
      throw new Error(`Project ${projectId} not found for user ${userId}`);
    }

    project.status = "generating";

    // Deduplicate prompt message in messages history
    const lastMsg = project.messages[project.messages.length - 1];
    if (!lastMsg || lastMsg.role !== "user" || lastMsg.content !== prompt) {
      project.messages.push({
        role: "user",
        content: prompt,
      });
    }

    await project.save();

    // Notify room of generating status
    try {
      const io = getIO();
      io.to(`project:${projectId}`).emit("generation-status", { status: "generating", projectId });
    } catch (err) {
      console.warn("Socket notification warning:", err.message);
    }

    try {
      // Generate website using AI
      const { files, rawResponse } = await generateWebsiteService(prompt);

      // Save generated files to MongoDB
      project.prompt = prompt;
      project.generatedFiles = files;

      project.messages.push({
        role: "assistant",
        content: rawResponse,
      });

      project.status = "completed";
      await project.save();

      // Notify room of completion and updated files
      try {
        const io = getIO();
        io.to(`project:${projectId}`).emit("project-updated", project);
        io.to(`project:${projectId}`).emit("generation-status", { status: "completed", projectId, files });
      } catch (err) {
        console.warn("Socket notification warning:", err.message);
      }

      // Index generated files into Qdrant asynchronously
      for (const file of project.generatedFiles) {
        try {
          await indexProjectFile(
            project._id.toString(),
            file.path,
            file.content
          );
        } catch (error) {
          console.error(`[Worker] Failed to index ${file.path}:`, error.message);
        }
      }

      return {
        success: true,
        projectId,
      };
    } catch (error) {
      project.status = "failed";
      await project.save();

      try {
        const io = getIO();
        io.to(`project:${projectId}`).emit("generation-status", { status: "failed", projectId, error: error.message });
      } catch {}

      throw error;
    }
  },
  {
    connection: bullmqConnection,
  }
);

generationWorker.on("completed", (job) => {
  console.info(`[Worker] Generation job ${job.id} completed successfully`);
});

generationWorker.on("failed", (job, error) => {
  console.error(`[Worker] Generation job ${job?.id} failed: ${error.message}`);
});

export default generationWorker;