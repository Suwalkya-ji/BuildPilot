import { body } from "express-validator";

export const chatValidation = [
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required.")
    .isMongoId()
    .withMessage("Invalid Project ID."),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required."),
];