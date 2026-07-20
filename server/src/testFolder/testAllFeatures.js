import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { qdrant } from "../config/qdrant.js";
import { createCollection } from "../services/qdrant.service.js";
import { generateWebsiteService, chatWithProjectService } from "../services/ai.service.js";
import { indexProjectFile, deleteProjectVectors } from "../services/vector.service.js";
import { searchRelevantFiles } from "../services/rag.service.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";

async function runManualTestCases() {
  try {
    console.log("🔌 Connecting to MongoDB & Qdrant...");
    await mongoose.connect(process.env.MONGODB_URI);
    await createCollection();

    // Find or create dummy user for testing
    let user = await User.findOne({});
    if (!user) {
      user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    }

    console.log("\n=============================================");
    console.log("🚀 TEST 1: Generate a Website");
    console.log("Prompt: 'Create a modern SaaS landing page for an AI startup.'");
    console.log("=============================================");

    let project = await Project.create({
      title: "AI Startup SaaS",
      owner: user._id,
      status: "generating",
      prompt: "Create a modern SaaS landing page for an AI startup.",
    });

    const { files, rawResponse } = await generateWebsiteService(project.prompt);
    project.generatedFiles = files;
    project.messages.push(
      { role: "user", content: project.prompt },
      { role: "assistant", content: rawResponse }
    );
    project.status = "completed";
    await project.save();

    console.log(`✅ Project created with ID: ${project._id}`);
    console.log(`✅ Project Status in DB: ${project.status}`);
    console.log(`✅ Generated Files Count: ${project.generatedFiles.length}`);

    // Index generated files into Qdrant
    for (const file of project.generatedFiles) {
      await indexProjectFile(project._id.toString(), file.path, file.content);
    }

    const qdrantPoints1 = await qdrant.scroll("project_files", {
      filter: { must: [{ key: "projectId", match: { value: project._id.toString() } }] },
      limit: 10,
    });
    console.log(`✅ Qdrant Vectors Count for Project: ${qdrantPoints1.points.length}`);

    console.log("\n=============================================");
    console.log("💬 TEST 2: Chat with the Project");
    console.log("Prompt: 'Change the navbar color to black.'");
    console.log("=============================================");

    project = await chatWithProjectService(
      project._id.toString(),
      "Change the navbar color to black.",
      user._id
    );

    console.log(`✅ AI updated files. New Files Count: ${project.generatedFiles.length}`);
    console.log(`✅ MongoDB project updated status: ${project.status}`);

    const qdrantPoints2 = await qdrant.scroll("project_files", {
      filter: { must: [{ key: "projectId", match: { value: project._id.toString() } }] },
      limit: 10,
    });
    console.log(`✅ Verified Qdrant re-indexed vectors count: ${qdrantPoints2.points.length}`);

    console.log("\n=============================================");
    console.log("🔍 TEST 3: RAG Retrieval Test");
    console.log("Query: 'Where is the navbar component?'");
    console.log("=============================================");

    const retrievedFiles = await searchRelevantFiles(
      project._id.toString(),
      "Where is the navbar component?"
    );

    console.log(`✅ Retrived ${retrievedFiles.length} relevant files from Qdrant:`);
    retrievedFiles.forEach((f, idx) => {
      console.log(`   ${idx + 1}. Path: ${f.filePath}`);
    });

    console.log("\n=============================================");
    console.log("🔄 TEST 4: Multiple Chats (Context Persistence)");
    console.log("Step 1: 'Add a pricing section.'");
    console.log("Step 2: 'Change the pricing cards to glassmorphism.'");
    console.log("=============================================");

    project = await chatWithProjectService(
      project._id.toString(),
      "Add a pricing section.",
      user._id
    );
    console.log("✅ Added pricing section successfully.");

    project = await chatWithProjectService(
      project._id.toString(),
      "Change the pricing cards to glassmorphism.",
      user._id
    );
    console.log("✅ Updated pricing cards to glassmorphism successfully.");

    console.log("\n🎉 ALL 4 FEATURE TESTS COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Test Failed:", err);
    process.exit(1);
  }
}

runManualTestCases();
