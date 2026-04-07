import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/**
 * @param {{ projectDir: string, templateName: string }} ctx
 */
export default function ({ projectDir }) {
  try {
    const pkgPath = path.join(projectDir, 'package.json');
    /** @type {{ dependencies?: Record<string, string>, devDependencies?: Record<string, string> }} */
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

    pkg.dependencies = {
      ...pkg.dependencies,
      'prismabox': '1.1.26',
      '@prisma/adapter-mariadb': '7.6.0',
      '@prisma/client': '7.6.0',
    };

    pkg.devDependencies = {
      ...pkg.devDependencies,
      'prisma': '7.6.0',
    };

    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
  } catch (err) {
    console.warn(`_config.js 执行失败: ${/** @type {Error} */(err).message}`);
  }
}