import mongoose from "mongoose";

// ==============================
// Message Schema
// ==============================
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["system", "user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

// ==============================
// Generated File Schema
// ==============================
const generatedFileSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["file", "folder"],
      default: "file",
    },

    language: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// ==============================
// Project Schema
// ==============================
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    prompt: {
      type: String,
      default: "",
    },

    framework: {
      type: String,
      enum: ["react", "next"],
      default: "react",
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    generatedFiles: {
      type: [generatedFileSchema],
      default: [],
    },

    thumbnail: {
      type: String,
      default: "",
    },

    deploymentUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "draft",
        "queued",
        "generating",
        "completed",
        "failed",
      ],
      default: "draft",
    },

    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// Model
// ==============================
const Project =
  mongoose.models.Project ||
  mongoose.model("Project", projectSchema);

export default Project;