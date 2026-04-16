/**
 * 用法：
 *   bun menu.ts                  交互式菜单
 *   bun menu.ts <名称>           直接执行或进入匹配项（模糊匹配，忽略大小写）
 *   bun menu.ts <父级> <子项>    按路径逐级定位
 *   bun menu.ts --list           列出所有可执行项
 */

import {
  entry,
  execCmd,
  type MenuItem,
} from "@/app/utils/menu-ui.ts";

const main = "./app/cluster.ts";
// const outDir = "./dist";
const menuItems: MenuItem[] = [
  {
    name: "dev",
    fun: () => execCmd(`bun --parallel run generate_script dev-watch`),
    remark: "开发模式",
  },
  {
    name: "start",
    remark: "生产模式",
    children: [
      {
        name: "hot",
        fun: () => execCmd(`NODE_ENV=production bun --hot ${main}`),
        remark: "生产模式-热更新",
      },
      {
        name: "hot-bg",
        fun: () =>
          execCmd(`NODE_ENV=production bun --hot --background ${main}`),
        remark: "生产模式-热更新-后台运行",
      },
    ],
  },
  {
    name: "biome-fix",
    fun: () => execCmd(`bunx --bun @biomejs/biome check --write .`),
    remark: "使用biome修复代码",
  },
  {
    name: "generate",
    remark: "生成代码",
    children: [
      {
        name: "all",
        fun: () => execCmd(`bun --parallel 'generate_*'`),
        remark: "生成 路由、prisma客户端、drizzle迁移数据",
      },
      {
        name: "script",
        fun: () => execCmd(`bun ./support/script/index.ts`),
        remark: "生成路由",
      },
    ],
  },
  {
    name: "drizzle",
    remark: "drizzle 相关",
    children: [
      {
        name: "studio",
        fun: () => execCmd(`bun --bun run drizzle-kit studio`),
        remark: "✅ 数据库可视化管理",
      },
      {
        name: "generate",
        fun: () => execCmd(`bun --bun run drizzle-kit generate`),
        remark: "✅ 仅生成迁移文件（不执行）",
      },
      {
        name: "migrate",
        fun: () => execCmd(`bun --bun run drizzle-kit migrate`),
        remark: "✅ 执行已生成的迁移（生产用）",
      },
      {
        name: "generate+migrate",
        fun: () =>
          execCmd(
            `bun --bun run drizzle-kit generate && bun --bun run drizzle-kit migrate`,
          ),
        remark: "✅ 生成+执行迁移（开发/生产通用）",
      },
      {
        name: "push",
        fun: () => execCmd(`bun --bun run drizzle-kit push`),
        remark: "⚠️ 直接同步结构，不生成迁移（快速开发）",
      },
      {
        name: "drop",
        fun: () => execCmd(`bun --bun run drizzle-kit drop`),
        remark: "⚠️ 删除无效/旧迁移文件",
      },
      {
        name: "check",
        fun: () => execCmd(`bun --bun run drizzle-kit check`),
        remark: "✅ 检查迁移是否合法",
      },
      {
        name: "up",
        fun: () => execCmd(`bun --bun run drizzle-kit up`),
        remark: "✅ 应用最新迁移（等价migrate）",
      },
    ],
  },
  {
    name: "prisma",
    remark: "prisma 相关",
    children: [
      {
        name: "studio",
        fun: () => execCmd(`bunx --bun prisma studio`),
        remark: "✅ 数据库可视化管理",
      },
      {
        name: "generate",
        fun: () => execCmd(`bunx --bun prisma generate`),
        remark: "✅ 生成/更新Prisma客户端（必用）",
      },
      {
        name: "migrate-dev",
        fun: () => execCmd(`bunx --bun prisma migrate dev`),
        remark: "✅ 开发：生成迁移+执行",
      },
      {
        name: "migrate-dev+generate",
        fun: () =>
          execCmd(
            `bunx --bun prisma migrate dev && bunx --bun prisma generate`,
          ),
        remark: "✅ 开发：迁移+执行+生成客户端",
      },
      {
        name: "migrate-deploy",
        fun: () => execCmd(`bunx --bun prisma migrate deploy`),
        remark: "✅ 生产：仅执行已有迁移（安全）",
      },
      {
        name: "migrate-deploy+generate",
        fun: () =>
          execCmd(
            `bunx --bun prisma migrate deploy && bunx --bun prisma generate`,
          ),
        remark: "✅ 生产：执行迁移+生成客户端",
      },
      {
        name: "push",
        fun: () => execCmd(`bunx --bun prisma db push`),
        remark: "⚠️ 直接同步结构，不生成迁移（快速开发）",
      },
      {
        name: "seed",
        fun: () => execCmd(`bunx --bun prisma db seed`),
        remark: "✅ 执行种子数据（填充测试数据）",
      },
      {
        name: "migrate-status",
        fun: () => execCmd(`bunx --bun prisma migrate status`),
        remark: "✅ 查看迁移执行状态",
      },
      {
        name: "migrate-reset",
        fun: () => execCmd(`bunx --bun prisma migrate reset`),
        remark: "🆘 重置数据库：清空数据+重新迁移（开发用）",
      },
      {
        name: "db-wipe",
        fun: () => execCmd(`bunx --bun prisma db wipe`),
        remark: "🆘 清空所有表数据（保留结构）",
      },
    ],
  },
];
// ── 入口 ─────────────────────────────────────────────────────
await entry(menuItems);
