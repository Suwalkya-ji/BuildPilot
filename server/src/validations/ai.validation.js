import { body } from "express-validator";

export const generateWebsiteValidation = [
  body("projectId")
    .isMongoId()
    .withMessage("Invalid Project ID"),

  body("prompt")
    .trim()
    .notEmpty()
    .withMessage("Prompt is required")
    .isLength({ min: 10 })
    .withMessage("Prompt must be at least 10 characters"),
];