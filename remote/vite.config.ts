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
      name: "serve-federation-files",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/remoteEntry.js") {
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

          if (req.url === "/@mf-types.zip") {
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
