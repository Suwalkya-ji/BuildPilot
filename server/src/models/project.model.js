import mongoose from "mongoose";

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

    generatedCode: {
      type: String,
      default: "",
    },

    generatedFiles: [
      {
        fileName: String,
        content: String,
      },
    ],

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

const Project =
  mongoose.models.Project ||
  mongoose.model("Project", projectSchema);

export default Project;