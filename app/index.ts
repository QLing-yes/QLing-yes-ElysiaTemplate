import { openapi } from "@elysiajs/openapi";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import routes from "@/support/generated/routes";

const app = new Elysia()
	.use(openapi())
	.use(staticPlugin())
	.use(routes)
	.listen(3000);

export type APP = typeof app;

const service = `${app.server?.hostname}:${app.server?.port}`;

console.log(`service http://${service}`);
console.log(`openapi http://${service}/openapi`);
