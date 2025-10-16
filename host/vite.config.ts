import { NativeFederationTypeScriptHost } from "@module-federation/native-federation-typescript/vite";
import { federation } from "@module-federation/vite";
import { ModuleFederationOptions } from "@module-federation/vite/lib/utils/normalizeModuleFederationOptions";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import packageJson from "./package.json";

const WITH_TYPES = false;

const moduleFederationConfig = {
  name: "host",
  filename: "remoteEntry.js",
  remotes: {
    "@remote": WITH_TYPES
      ? { "@remote": "http://localhost:3000/remoteEntry.js" }
      : {
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
      requiredVersion: packageJson.dependencies.react,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: packageJson.dependencies["react-dom"],
    },
  },
} as ModuleFederationOptions;

export default defineConfig({
  plugins: [
    react(),
    federation(moduleFederationConfig),
    WITH_TYPES
      ? NativeFederationTypeScriptHost({ moduleFederationConfig })
      : null,
  ],
  server: { port: 3001 },
});
