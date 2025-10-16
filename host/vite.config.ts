import { NativeFederationTypeScriptHost } from "@module-federation/native-federation-typescript/vite";
import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import packageJson from "./package.json";

const moduleFederationConfig = {
  name: "moduleFederationHost",
  filename: "remoteEntry.js",
  remotes: {
    moduleFederationTypescript: "http://localhost:3000/remoteEntry.js",
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
    react(),
    federation(moduleFederationConfig),
    NativeFederationTypeScriptHost({ moduleFederationConfig }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
  },
  server: {
    port: 3001,
  },
});
