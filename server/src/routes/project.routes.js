import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createProject);

router.get("/", getProjects);

router.get("/:id", getProject);

router.put("/:id", updateProject);

router.delete("/:id", deleteProject);

export default router;
