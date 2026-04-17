import { watchDir } from "@/app/utils/watch";
import autoRoutes from "./routes";

const args = process.argv.slice(2);

generateRoutes();

if (args[0] === "watch") {
  console.log("\x1b[32m 👀 watch router \x1b[0m");
  watchDir({
    dir: "app/controller",
    suffix: ["ctrl.ts"],
    onChange() {
      generateRoutes();
    },
  });
}

function generateRoutes() {
  autoRoutes({
    fromDir: "app/controller",
    target: "./support/generated/routes/index.ts",
  });
}
