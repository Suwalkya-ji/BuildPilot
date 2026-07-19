import { Worker } from "bullmq";
import bullmqConnection from "../config/bullmq.js";

const generationWorker = new Worker(
  "website-generation",
  async (job) => {
    console.log("Job Received");
    console.log(job.data);

    return {
      success: true,
    };
  },
  {
    connection: bullmqConnection,
  }
);

generationWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

generationWorker.on("failed", (job, error) => {
  console.log(`❌ Job ${job?.id} failed`);
  console.log(error.message);
});

export default generationWorker;