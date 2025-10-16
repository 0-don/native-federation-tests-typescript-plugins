import { NativeFederationTypeScriptRemote } from "@module-federation/native-federation-typescript/vite";
import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";

const moduleFederationConfig = {
  name: "moduleFederationTypescript",
  filename: "remoteEntry.js",
  exposes: {
    "./button": "./src/components/button",
    "./anotherButton": "./src/components/anotherButton",
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: packageJson.dependencies.react,
    },
    "react-dom": {
      singleton: true,
      eager: true,
      requiredVersion: packageJson.dependencies["react-dom"],
    },
  },
};

export default defineConfig({
  plugins: [
    {
      name: "serve-federation-assets",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || "";

          // Handle remoteEntry.js
          if (url === "/remoteEntry.js") {
            const filePath = path.join(process.cwd(), "dist", "remoteEntry.js");
            if (fs.existsSync(filePath)) {
              res.setHeader("Content-Type", "application/javascript");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Cache-Control", "no-cache");
              const content = fs.readFileSync(filePath, "utf-8");
              res.end(content);
              return;
            }
          }

          // Handle assets folder
          if (url.startsWith("/assets/")) {
            const filePath = path.join(process.cwd(), "dist", url);
            if (fs.existsSync(filePath)) {
              const ext = path.extname(filePath);
              const contentType =
                ext === ".js" ? "application/javascript" : "text/plain";
              res.setHeader("Content-Type", contentType);
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Cache-Control", "no-cache");
              const content = fs.readFileSync(filePath, "utf-8");
              res.end(content);
              return;
            }
          }

          // Handle @mf-types.zip
          if (url === "/@mf-types.zip") {
            const filePath = path.join(process.cwd(), "dist", "@mf-types.zip");
            if (fs.existsSync(filePath)) {
              res.setHeader("Content-Type", "application/zip");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Cache-Control", "no-cache");
              const content = fs.readFileSync(filePath);
              res.end(content);
              return;
            }
          }

          next();
        });
      },
    },
    react(),
    federation(moduleFederationConfig),
    NativeFederationTypeScriptRemote({ moduleFederationConfig }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
  },
  server: {
    port: 3000,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    fs: {
      allow: ["./dist", "./src", ".", "../"],
    },
  },
});
