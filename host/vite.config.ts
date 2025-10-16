import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import packageJson from "./package.json";

const moduleFederationConfig = {
  name: "moduleFederationHost",
  filename: "remoteEntry.js",
  remotes: {
    moduleFederationTypescript: {
      type: "module",
      name: "moduleFederationTypescript",
      entry: "http://localhost:3000/remoteEntry.js",
      entryGlobalName: "moduleFederationTypescript",
      shareScope: "default",
    },
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
    federation(moduleFederationConfig),
    // NativeFederationTypeScriptHost({ moduleFederationConfig }),
    // NativeFederationTestsHost({ moduleFederationConfig }),
    react(),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
  },
  server: {
    port: 3001,
  },
  test: {
    environment: "jsdom",
  },
});
