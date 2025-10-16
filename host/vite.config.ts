// import { NativeFederationTypeScriptHost } from "@module-federation/native-federation-typescript/vite";
// import { NativeFederationTypeScriptHost } from "@module-federation/native-federation-typescript/vite";
import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import packageJson from "./package.json";

const moduleFederationConfig = {
  name: "host",
  filename: "remoteEntry.js",
  // remotes: {
  //   "@remote": "http://localhost:3000/remoteEntry.js",
  // },
  remotes: {
    "@remote": {
      type: "module",
      name: "@remote",
      entry: "http://localhost:3000/remoteEntry.js",
      entryGlobalName: "@remote",
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
    react(),
    federation(moduleFederationConfig),
    // NativeFederationTypeScriptHost({ moduleFederationConfig }),
  ],
  server: { port: 3001 },
});
