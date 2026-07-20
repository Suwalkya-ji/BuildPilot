import { Worker } from "bullmq";
import bullmqConnection from "../config/bullmq.js";
import { generateWebsiteService } from "../services/ai.service.js";
import { indexProjectFile } from "../services/vector.service.js";
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

    project.messages.push({
      role: "user",
      content: prompt,
    });

    await project.save();

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

      // ===============================
      // Index generated files into Qdrant
      // ===============================
      console.log("📚 Indexing project files into Qdrant...");

      for (const file of project.generatedFiles) {
        try {
          await indexProjectFile(
            project._id.toString(),
            file.path,
            file.content
          );

          console.log(`✅ Indexed: ${file.path}`);
        } catch (error) {
          console.error(
            `❌ Failed to index ${file.path}:`,
            error.message
          );
        }
      }

      console.log("🎉 All possible files indexed.");

      return {
        success: true,
        projectId,
      };
    } catch (error) {
      project.status = "failed";
      await project.save();

      throw error;
    }
  },
  {
    connection: bullmqConnection,
  }
);

generationWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

generationWorker.on("failed", (job, error) => {
  console.log(`❌ Job ${job?.id} failed: ${error.message}`);
});

export default generationWorker;