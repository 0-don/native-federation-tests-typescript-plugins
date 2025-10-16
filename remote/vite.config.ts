import { NativeFederationTypeScriptRemote } from "@module-federation/native-federation-typescript/vite";
import { federation } from "@module-federation/vite";
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from "vite";
import packageJson from "./package.json";
import { ModuleFederationOptions } from "@module-federation/vite/lib/utils/normalizeModuleFederationOptions";

const moduleFederationConfig = {
  name: "remote",
  filename: "remoteEntry.js",
  exposes: {
    "./button": "./src/components/button",
    "./another-button": "./src/components/another-button",
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
} as ModuleFederationOptions;

export default defineConfig({
  plugins: [
    react(),
    federation(moduleFederationConfig),
    NativeFederationTypeScriptRemote({ moduleFederationConfig }),
  ],
  server: {
    port: 3000,
    proxy: {
      "/@mf-types.zip": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: () => `/@fs/${process.cwd()}/dist/@mf-types.zip`,
      },
    },
    fs: {
      allow: ["./dist", "./src"],
    },
  },
});
