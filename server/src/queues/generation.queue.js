import { Queue } from "bullmq";
import bullmqConnection from "../config/bullmq.js";

const generationQueue = new Queue(
  "website-generation",
  {
    connection: bullmqConnection,
    defaultJobOptions: {
      removeOnComplete: 50,
      removeOnFail: 20,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
    },
  }
);

export default generationQueue;