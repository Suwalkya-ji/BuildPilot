import { Router } from "express";
import {
  generateWebsite,
  chatWithProjectController,
} from "../controllers/ai.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { generateWebsiteValidation } from "../validations/ai.validation.js";
import { chatValidation } from "../validations/chat.validation.js";

const router = Router();

router.post(
  "/generate",
  authMiddleware,
  generateWebsiteValidation,
  validate,
  generateWebsite
);

router.post(
  "/chat",
  authMiddleware,
  chatValidation,
  validate,
  chatWithProjectController
);

export default router;