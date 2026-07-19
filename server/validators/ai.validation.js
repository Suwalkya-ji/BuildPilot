import { body } from "express-validator";

export const generateWebsiteValidation = [
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required"),

  body("prompt")
    .trim()
    .notEmpty()
    .withMessage("Prompt is required")
    .isLength({ min: 10 })
    .withMessage("Prompt must be at least 10 characters"),
];