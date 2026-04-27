import { watchDir } from "@/app/utils/watch";
import batchExport from "./batchExport";
import autoRoutes from "./routes";

const args = process.argv.slice(2);
const routes_config = {
  fromDir: "app/controller",
  target: "./support/generated/routes.ts",
};
const batch_export_config = {
  root: "app/model",
  suffix: [".ts"],
  out: "./support/generated/model.ts",
  template: `export * from "{{path}}";`,
};

autoRoutes(routes_config);
batchExport(batch_export_config);

if (args[0] === "watch") {
  console.log("\x1b[32m 👀 watch router \x1b[0m");
  watchDir({
    dir: "app/controller",
    suffix: ["ctrl.ts"],
    onChange() {
      autoRoutes(routes_config);
    },
  });
}
