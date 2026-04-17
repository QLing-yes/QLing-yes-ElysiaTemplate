import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * @param {{ projectDir: string, templateName: string }} ctx
 */
export default function ({ projectDir }) {
  try {
    // ---------- package.json ----------
    const pkgPath = path.join(projectDir, 'package.json');
    /** @type {{ dependencies?: Record<string, string>, devDependencies?: Record<string, string> }} */
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

    pkg.scripts = {
      ...pkg.scripts,
      // 可视化
      "prisma_studio": "bunx --bun prisma studio",
      // 开发：迁移 + 执行 + 生成客户端
      "generate_prisma_migrate_dev": "bunx --bun prisma migrate dev && bunx --bun prisma generate",
      // 生产：执行迁移 + 生成客户端
      "prisma_generate_migrate_deploy": "bunx --bun prisma migrate deploy && bunx --bun prisma generate",
    };
    pkg.dependencies = {
      ...pkg.dependencies,
      "prismabox": "1.1.26",
      "@prisma/adapter-mariadb": "7.7.0",
      "@prisma/client": "7.7.0"
    };
    pkg.devDependencies = {
      ...pkg.devDependencies,
      "prisma": "7.7.0"
    };

    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');

    // ---------- app/common/index.ts ----------
    const commonFilePath = path.join(projectDir, 'app/common/index.ts');
    const commonContent = readFileSync(commonFilePath, 'utf8');

    const exportLine = 'export { prisma as db } from "@/app/lib/prisma";\n';
    writeFileSync(commonFilePath, exportLine + commonContent, 'utf8');
  } catch (err) {
    console.warn(`_config.js 执行失败: ${/** @type {Error} */(err).message}`);
  }
}