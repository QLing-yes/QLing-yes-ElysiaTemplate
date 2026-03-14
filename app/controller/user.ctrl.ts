import Elysia from "elysia";

export default new Elysia({ name: __filename, prefix: "" })
	.get("/1_c", () => "1_c")
