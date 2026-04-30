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
            // drizzle可视化
            "drizzle_studio": "bun --bun run drizzle-kit studio",
            // 生成迁移并执行
            "generate_drigrate_migrate": "bun --bun run drizzle-kit generate && bun --bun run drizzle-kit migrate",
        };
        pkg.dependencies = {
            ...pkg.dependencies,
            "drizzle-orm": "0.45.2",
            "drizzle-typebox": "0.3.3",
            "mysql2": "3.22.3",
        };
        pkg.devDependencies = {
            ...pkg.devDependencies,
            "drizzle-kit": "0.31.10",
        };

        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');

        // ---------- app/common/index.ts ----------
        const commonFilePath = path.join(projectDir, 'app/common/index.ts');
        const commonContent = readFileSync(commonFilePath, 'utf8');

        const exportLine = 'export { drizzle as db } from "@/app/lib/drizzle";\n';
        writeFileSync(commonFilePath, exportLine + commonContent, 'utf8');
    } catch (err) {
        console.warn(`_config.js 执行失败: ${/** @type {Error} */(err).message}`);
    }
}