import { eq } from "drizzle-orm";
import { t } from "elysia";
import { post, user } from "@/app/model";
import { controller } from "@/app/plugins/index.plug";

export default $g.ctrl((app) =>
  app
    .post(
      "routers",
      () => {
        const list: string[] = controller.routes.map(
          (item) => `[${item.method}]${item.path}`,
        );
        return $g.success(list);
      },
      {
        res: t.Array(t.Any()),
      },
    )
    .post(
      "test",
      ({ body }) => {
        if (body.a > 2) {
          return $g.error("no > 2");
        }
        return $g.success(body.a + 1);
      },
      {
        body: t.Object({ a: t.Number() }),
        // res: t.Union([t.Number(), t.Null()]),
        res: t.Number(),
      },
    )
    .post(
      "success",
      () => {
        return $g.success("succData");
      },
      { res: t.String() },
    )
    .post(
      "err",
      () => {
        return $g.error("errData", 0);
      },
      { res: t.String() },
    )
    .post(
      "err2",
      () => {
        return $g.success({ a: { b: 1 } });
      },
      {
        res: t.Object({ a: t.Object({ b: t.String() }) }),
      },
    )
    .post("throwErr", () => {
      throw new Error("throwErr");
    })
    .post("throwData", () => {
      throw "throwData";
    })
    .get(
      "/redis",
      async () => {
        await $g.redis.set("test", "hello world");
        const result = await $g.redis.get("test");
        return $g.success(result);
      },
      { res: t.String() },
    )

    // ===== 增删改查 测试 =====

    /** 新增用户 */
    .post(
      "user/create",
      async ({ body }) => {
        const row = await $g.db.insert(user).values(body).$returningId();
        return $g.success(row);
      },
      {
        body: t.Object({
          email: t.String({ format: "email" }),
          name: t.Optional(t.String()),
        }),
        res: t.Any(),
      },
    )

    /** 查询所有用户 */
    .get(
      "user/list",
      async () => {
        const rows = await $g.db.query.user.findMany();
        return $g.success(rows);
      },
      { res: t.Any() },
    )

    /** 按ID查询用户 */
    .get(
      "user/detail/:id",
      async ({ params }) => {
        const row = await $g.db.query.user.findFirst({
          where: { id: +params.id },
        });
        if (!row) {
          return $g.error("用户不存在", 404);
        }
        return $g.success(row);
      },
      { res: t.Any() },
    )

    /** 更新用户 */
    .put(
      "user/update/:id",
      async ({ params, body }) => {
        const [{ affectedRows }] = await $g.db
          .update(user)
          .set(body)
          .where(eq(user.id, +params.id));
        if (affectedRows === 0) {
          return $g.error("用户不存在", 404);
        }
        return $g.success(null, "更新成功");
      },
      {
        body: t.Object({
          email: t.Optional(t.String({ format: "email" })),
          name: t.Optional(t.String()),
        }),
        res: t.Any(),
      },
    )

    /** 删除用户 */
    .delete(
      "user/delete/:id",
      async ({ params }) => {
        const [{ affectedRows }] = await $g.db
          .delete(user)
          .where(eq(user.id, +params.id));
        if (affectedRows === 0) {
          return $g.error("用户不存在", 404);
        }
        return $g.success(null, "删除成功");
      },
      { res: t.Any() },
    )

    /** 新增文章 */
    .post(
      "post/create",
      async ({ body }) => {
        const row = await $g.db.insert(post).values(body).$returningId();
        return $g.success(row);
      },
      {
        body: t.Object({
          title: t.String(),
          content: t.Optional(t.String()),
          published: t.Optional(t.Boolean()),
          authorId: t.Number(),
        }),
        res: t.Any(),
      },
    )

    /** 查询所有文章（含作者信息） */
    .get(
      "post/list",
      async () => {
        const rows = await $g.db.query.post.findMany({
          with: { author: true },
        });
        return $g.success(rows);
      },
      { res: t.Any() },
    ),
);
