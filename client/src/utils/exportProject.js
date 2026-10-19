/**
 * Turns AI-generated files into a project that runs with `npm install && npm run dev`.
 * Adds what the generator never writes: index.html, Vite config, Tailwind setup,
 * a complete package.json (scripts + every imported package) and a README.
 * Pure function (no DOM), so it can be tested outside the browser.
 */

// Versions for packages the generated code commonly imports
const KNOWN_VERSIONS = {
  react: "^18.3.1",
  "react-dom": "^18.3.1",
  "lucide-react": "^0.468.0",
  "react-router-dom": "^6.28.0",
  "framer-motion": "^11.15.0",
  recharts: "^2.15.0",
  axios: "^1.7.9",
  clsx: "^2.1.1",
  "date-fns": "^4.1.0",
  uuid: "^11.0.3",
};

// Build tooling is owned by the export, never taken from the generated package.json
const TOOLING = {
  vite: "^5.4.11",
  "@vitejs/plugin-react": "^4.3.4",
  tailwindcss: "^3.4.17",
  postcss: "^8.4.49",
  autoprefixer: "^10.4.20",
};

const ENTRY_CANDIDATES = ["src/main.jsx", "src/main.js", "src/index.jsx", "src/index.js", "src/main.tsx", "src/index.tsx"];

const normalizePath = (p) => (p || "").trim().replace(/^\.?\//, "");

const slugify = (title) =>
  (title || "buildpilot-project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "buildpilot-project";

// Bare package names imported anywhere in the source ("@scope/pkg/sub" -> "@scope/pkg")
const findImportedPackages = (files) => {
  const found = new Set();
  const importRe = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(?\s*['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)/g;

  files.forEach(({ path, content }) => {
    if (!/\.(jsx?|tsx?)$/.test(path)) return;
    for (const match of content.matchAll(importRe)) {
      const spec = match[1] || match[2] || match[3];
      if (!spec || spec.startsWith(".") || spec.startsWith("/") || /\.css$/.test(spec)) continue;
      const parts = spec.split("/");
      found.add(spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]);
    }
  });

  return found;
};

const readGeneratedPackageJson = (files) => {
  const pkgFile = files.find((f) => f.path === "package.json");
  if (!pkgFile) return {};
  try {
    return JSON.parse(pkgFile.content) || {};
  } catch {
    return {};
  }
};

const buildPackageJson = (files, title) => {
  const generated = readGeneratedPackageJson(files);
  const declared = { ...(generated.dependencies || {}), ...(generated.devDependencies || {}) };

  const dependencies = { react: KNOWN_VERSIONS.react, "react-dom": KNOWN_VERSIONS["react-dom"] };
  findImportedPackages(files).forEach((name) => {
    if (TOOLING[name]) return;
    dependencies[name] = declared[name] || KNOWN_VERSIONS[name] || "latest";
  });

  return {
    name: slugify(generated.name || title),
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies,
    devDependencies: { ...TOOLING },
  };
};

const indexHtml = (title, entry) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${(title || "BuildPilot Project").replace(/</g, "&lt;")}</title>
    <link rel="stylesheet" href="/src/tailwind.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/${entry}"></script>
  </body>
</html>
`;

// Generated code often puts JSX in .js files; let Vite/esbuild parse them as JSX
const VITE_CONFIG = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\\/.*\\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { ".js": "jsx" },
    },
  },
});
`;

const TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

const POSTCSS_CONFIG = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

const TAILWIND_CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

const DEFAULT_ENTRY = `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

const README = (title) => `# ${title || "BuildPilot Project"}

Generated with BuildPilot AI — a React + Tailwind CSS app powered by Vite.

## Run it

Requires Node.js 18 or newer.

\`\`\`bash
npm install
npm run dev
\`\`\`

Then open the URL shown in the terminal (usually http://localhost:5173).

## Build for production

\`\`\`bash
npm run build
npm run preview
\`\`\`

The production files are written to \`dist/\` and can be deployed to any static host
(Netlify, Vercel, GitHub Pages, …).
`;

const GITIGNORE = `node_modules
dist
.DS_Store
`;

/**
 * @param {Array<{path?: string, filePath?: string, content?: string}>} rawFiles
 * @param {string} title
 * @returns {Array<{path: string, content: string}>} files to put in the ZIP
 */
export const buildExportFiles = (rawFiles = [], title = "") => {
  const files = rawFiles
    .map((f) => ({ path: normalizePath(f.path || f.filePath), content: f.content || "" }))
    .filter((f) => f.path);

  const has = (p) => files.some((f) => f.path === p);
  const out = files.filter((f) => f.path !== "package.json");
  const add = (path, content) => {
    if (!has(path)) out.push({ path, content });
  };

  let entry = ENTRY_CANDIDATES.find(has);
  if (!entry) {
    entry = "src/main.jsx";
    out.push({ path: entry, content: DEFAULT_ENTRY });
  }

  out.push({ path: "package.json", content: JSON.stringify(buildPackageJson(files, title), null, 2) + "\n" });
  add("index.html", indexHtml(title, entry));
  add("vite.config.js", VITE_CONFIG);
  add("tailwind.config.js", TAILWIND_CONFIG);
  add("postcss.config.js", POSTCSS_CONFIG);
  add("src/tailwind.css", TAILWIND_CSS);
  add("README.md", README(title));
  add(".gitignore", GITIGNORE);

  return out;
};

export const exportFileName = (title) => `${slugify(title)}.zip`;
