import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "li.yeast",
  appName: "yeastly",
  webDir: "build",
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {},
  },
};

export default config;
