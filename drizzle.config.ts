import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./app/model"],
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

// # 根据 schema.ts 生成迁移 SQL 文件
// npx drizzle-kit generate

// # 执行迁移（把 SQL 跑进数据库）
// npx drizzle-kit migrate

// # 直接把 schema 推进数据库（开发时跳过迁移文件，快速同步）
// npx drizzle-kit push

// # 打开可视化管理界面
// npx drizzle-kit studio