//自动生成的文件
import Elysia from "elysia";
import _0 from "@/app/controller/admin/test.ctrl";

const app = new Elysia({ name: __filename, prefix:"" })

export default app
 .group("admin/user",app=>app.use(_0))