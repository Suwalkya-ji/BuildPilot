/**
 * Bundles AI-generated React files into a self-contained HTML string
 * using Babel Standalone + In-Browser Virtual Module Engine.
 */
export const buildPreviewHtml = (files = []) => {
  if (!files || files.length === 0) {
    return null;
  }

  // Build Virtual File Map (normalized path -> content)
  const virtualFiles = {};
  files.forEach((f) => {
    let p = (f.path || f.filePath || "").trim().replace(/^\//, "");
    if (!p) return;
    if (!p.startsWith("src/")) p = "src/" + p;
    virtualFiles["/" + p] = f.content || "";
  });

  const filesJson = JSON.stringify(virtualFiles);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BuildPilot Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #090b10; font-family: system-ui, -apple-system, sans-serif; color: #f8fafc; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="application/json" id="buildpilot-virtual-files">
${filesJson}
  </script>

  <script>
    (function() {

      var ICON_SVGS = {
        user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
        phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
        briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
        mappin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
        github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
        linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
        twitter: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
        globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/><path d="M2 12h20"/>',
        calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
        externallink: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
        star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
        check: '<path d="M20 6 9 17l-5-5"/>',
        x: '<path d="M18 6 6 18M6 6l12 12"/>'
      };

      function LucideFallback(props) {
        var name = (props && props.name) || "";
        var size = (props && props.size) || 20;
        var className = (props && props.className) || "";
        var color = (props && props.color) || "currentColor";
        var strokeWidth = (props && props.strokeWidth) || 2;
        var key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
        var svgPath = ICON_SVGS[key] || '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>';
        return React.createElement('svg', {
          width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", className: className,
          dangerouslySetInnerHTML: { __html: svgPath }
        });
      }

      var LucideProxy = new Proxy({}, {
        get: function(target, prop) {
          if (prop === "__esModule") return true;
          return function(props) {
            return React.createElement(LucideFallback, Object.assign({ name: prop }, props));
          };
        }
      });

      class ErrorBoundary extends React.Component {
        constructor(props) { super(props); this.state = { hasError: false, error: null }; }
        static getDerivedStateFromError(error) { return { hasError: true, error: error }; }
        componentDidCatch(error, info) { console.error("[Iframe ErrorBoundary] Render Error:", error, info); }
        render() {
          if (this.state.hasError) {
            return React.createElement('div', {
              style: { padding: 24, color: '#f87171', fontFamily: 'monospace', fontSize: 13, background: '#090b10', height: '100vh', boxSizing: 'border-box' }
            },
              React.createElement('strong', { style: { fontSize: 15 } }, 'Runtime Preview Error:'),
              React.createElement('pre', { style: { whiteSpace: 'pre-wrap', marginTop: 12, background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8 } },
                String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)
              )
            );
          }
          return this.props.children;
        }
      }

      try {
        var virtualFilesRaw = document.getElementById("buildpilot-virtual-files").textContent;
        var virtualFiles = JSON.parse(virtualFilesRaw);
        var moduleCache = {};
        var compiledCache = {};

        function normalizePath(p) {
          var parts = p.split("/").filter(Boolean);
          var res = [];
          for (var i = 0; i < parts.length; i++) {
            if (parts[i] === "..") res.pop();
            else if (parts[i] !== ".") res.push(parts[i]);
          }
          return "/" + res.join("/");
        }

        function resolveModulePath(specifier, currentDir) {
          var target = specifier;
          if (target.startsWith(".")) {
            target = normalizePath(currentDir + "/" + target);
          } else if (!target.startsWith("/")) {
            target = "/src/" + target;
          }

          var extensions = ["", ".jsx", ".js", ".tsx", ".ts", "/index.jsx", "/index.js", "/index.tsx", "/index.ts"];
          for (var i = 0; i < extensions.length; i++) {
            var candidate = target + extensions[i];
            if (virtualFiles[candidate]) return candidate;
          }

          // Fuzzy fallback: match filename basename across subdirectories (e.g. "./VisitingCard" -> "/src/components/VisitingCard.jsx")
          var baseName = specifier.split("/").pop().replace(/\.(jsx|js|tsx|ts)$/, "");
          if (baseName) {
            var keys = Object.keys(virtualFiles);
            var fuzzyMatch = keys.find(function(k) {
              var kBase = k.split("/").pop().replace(/\.(jsx|js|tsx|ts)$/, "");
              return kBase.toLowerCase() === baseName.toLowerCase();
            });
            if (fuzzyMatch) return fuzzyMatch;
          }

          return target;
        }

        function virtualRequire(specifier, currentDir) {
          if (!currentDir) currentDir = "/src";

          if (specifier === "react") return React;
          if (specifier === "react-dom" || specifier === "react-dom/client") return ReactDOM;
          if (specifier === "react/jsx-runtime" || specifier === "react/jsx-dev-runtime") {
            return {
              jsx: function(type, props, key) { return React.createElement(type, key ? Object.assign({ key: key }, props) : props); },
              jsxs: function(type, props, key) { return React.createElement(type, key ? Object.assign({ key: key }, props) : props); },
              Fragment: React.Fragment
            };
          }
          if (specifier === "lucide-react") return LucideProxy;

          if (specifier.endsWith(".css") || specifier.endsWith(".scss") || specifier.endsWith(".sass")) {
            var resolvedCss = resolveModulePath(specifier, currentDir);
            var cssContent = virtualFiles[resolvedCss] || virtualFiles[specifier];
            if (cssContent) {
              var styleEl = document.createElement("style");
              styleEl.textContent = cssContent;
              document.head.appendChild(styleEl);
            }
            return {};
          }

          if (specifier.endsWith(".json")) {
            var resolvedJson = resolveModulePath(specifier, currentDir);
            try { return JSON.parse(virtualFiles[resolvedJson] || "{}"); } catch (e) { return {}; }
          }

          if (/\\.(png|jpe?g|gif|svg|webp|ico)$/i.test(specifier)) {
            return specifier;
          }

          var resolved = resolveModulePath(specifier, currentDir);
          if (moduleCache[resolved]) {
            return moduleCache[resolved].exports;
          }

          var rawCode = virtualFiles[resolved];
          if (!rawCode) {
            console.warn("[VirtualRequire] Module not found:", specifier, "resolved to:", resolved);
            return LucideProxy;
          }

          if (!compiledCache[resolved]) {
            try {
              compiledCache[resolved] = Babel.transform(rawCode, {
                presets: [["env", { modules: "commonjs" }], ["react", { runtime: "classic" }]]
              }).code;
            } catch (bErr) {
              console.error("[VirtualRequire] Babel compilation failed for:", resolved, bErr);
              throw new Error("Babel Compilation Error in " + resolved + ": " + bErr.message);
            }
          }

          var module = { exports: {} };
          moduleCache[resolved] = module;

          var dir = resolved.substring(0, resolved.lastIndexOf("/"));
          var localRequire = function(reqSpec) { return virtualRequire(reqSpec, dir); };

          try {
            var fn = new Function("require", "module", "exports", "React", compiledCache[resolved]);
            fn(localRequire, module, module.exports, React);
          } catch (fnErr) {
            console.error("[VirtualRequire] Module execution failed for:", resolved, fnErr);
            throw new Error("Module Execution Error in " + resolved + ": " + fnErr.message);
          }

          return module.exports;
        }

        var entryPaths = Object.keys(virtualFiles);
        var entryFile = entryPaths.find(function(p) { return /\\/src\\/App\\.(jsx|js|tsx|ts)$/.test(p); }) ||
                        entryPaths.find(function(p) { return /\\/App\\.(jsx|js|tsx|ts)$/.test(p); }) ||
                        entryPaths.find(function(p) { return !p.includes("index"); });

        if (!entryFile && entryPaths.length > 0) entryFile = entryPaths[0];

        if (!entryFile) {
          throw new Error("No React components found in project files.");
        }

        var entryExports = virtualRequire(entryFile, "/src");

        var TargetApp = entryExports.default || entryExports.App || (typeof entryExports === "function" ? entryExports : Object.values(entryExports).find(function(v) { return typeof v === "function"; }));

        var rootEl = document.getElementById("root");
        var root = ReactDOM.createRoot(rootEl);

        if (TargetApp) {
          root.render(React.createElement(ErrorBoundary, null, React.createElement(TargetApp)));
        } else {
          console.error("[Iframe Script] TargetApp is null! Cannot mount component.");
          root.render(React.createElement("div", { style: { padding: 20, color: "#f87171" } }, "App component not found in " + entryFile));
        }
      } catch (err) {
        console.error("[Iframe Script Fatal Error]:", err);
        document.getElementById("root").innerHTML =
          '<div style="padding:24px;color:#f87171;font-family:monospace;font-size:13px;background:#090b10;height:100vh;box-sizing:border-box">' +
          '<strong style="font-size:15px">Compilation / Preview Error:</strong><br/><br/>' +
          '<div style="background:rgba(255,255,255,0.05);padding:12px;border-radius:8px;white-space:pre-wrap">' +
          String(err && err.message ? err.message : err) +
          '</div></div>';
      }
    })();
  </script>
</body>
</html>`;

  return html;
};

export const normalizeSandpackFiles = (rawFiles = []) => {
  const normalized = {};

  rawFiles.forEach((file) => {
    let p = file.path || file.filePath || "";
    if (!p) return;
    p = p.replace(/^\//, "");

    if (p.endsWith(".css") || p.endsWith(".scss") || p.endsWith(".sass")) return;

    if (p.startsWith("src/")) p = "/" + p;
    else if (p.startsWith("public/")) p = "/" + p;
    else if (p === "package.json") p = "/package.json";
    else p = "/src/" + p;

    let code = file.content || "";
    code = code
      .split("\n")
      .filter((line) => !line.trim().match(/^import\s+['"].*\.css['"]/))
      .join("\n");

    normalized[p] = { code };
  });

  if (!normalized["/public/index.html"]) {
    normalized["/public/index.html"] = {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BuildPilot Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body style="margin:0;padding:0">
    <div id="root"></div>
  </body>
</html>`,
    };
  }

  if (!normalized["/package.json"]) {
    normalized["/package.json"] = {
      code: JSON.stringify({
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          "lucide-react": "^0.263.1",
        },
      }, null, 2),
    };
  }

  if (!normalized["/src/index.js"] && !normalized["/src/index.jsx"]) {
    const appKey =
      Object.keys(normalized).find((k) => /\/src\/App\.(jsx|js)$/.test(k)) ||
      Object.keys(normalized).find((k) => k.startsWith("/src/") && !k.includes("index")) ||
      "/src/App.jsx";

    const appImport = appKey.replace("/src/", "./").replace(/\.(jsx|js)$/, "");
    normalized["/src/index.js"] = {
      code: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "${appImport}";
createRoot(document.getElementById("root")).render(<App />);`,
    };
  }

  return normalized;
};
