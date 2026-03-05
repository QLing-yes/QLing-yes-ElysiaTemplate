import fs from "node:fs";
import path from "node:path";

/** 获取目录下所有文件路径
 * @param rootDir 指定目录路径
 * @param reg 正则过滤
 */
export function filterFile(rootDir: string, reg?: RegExp) {
	let files: string[] = [];
	fs.readdirSync(rootDir).forEach((str) => {
		const dir = path.join(rootDir, str);
		if (fs.statSync(dir).isDirectory())
			files = files.concat(filterFile(dir, reg));
		else if (!reg) files.push(dir);
		else if (reg?.test(dir)) files.push(dir);
	});
	return files;
}
/** 流式写入
 *  @param filePath 路径
 *  @param flags https://nodejs.cn/api/fs/file_system_flags.html
 */
export function write(filePath: string, flags = "w") {
	// 确保目录存在
	const dirPath = path.dirname(filePath);
	if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
	// 创建写入流
	return fs.createWriteStream(filePath, {
		flags,
		mode: 0o200,
		encoding: "utf8",
	});
}
/** 创建符号链接
 * @param sourceDir 源文件夹路径
 * @param symlinkDir 符号链接的路径
 */
export async function mklink_junction(sourceDir: string, symlinkDir: string) {
	return new Promise<boolean>((resolve, reject) => {
		const sourceFolder = createDir(path.join(__dirname, sourceDir));
		const symlinkPath = createDir(path.join(__dirname, symlinkDir), true);

		fs.access(symlinkPath, fs.constants.F_OK, (err) => {
			if (!err) return resolve(true);
			fs.symlink(sourceFolder, symlinkPath, "junction", (err) => {
				if (err) reject(err);
				else resolve(true);
			});
		});
	});
}

/** 不存在则创建目录
 * @param pathStr 目录路径
 * @param dirOnly 仅目录
 */
export function createDir(pathStr: string, dirOnly?: boolean) {
	const str = dirOnly ? path.dirname(pathStr) : pathStr;
	if (!fs.existsSync(str)) fs.mkdirSync(str, { recursive: true });
	return pathStr;
}
