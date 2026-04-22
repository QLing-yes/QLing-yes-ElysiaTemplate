import { filePathTree, write } from "@/app/utils/file";

const confing = {
    /** 根目录 */
    root: "",
    /** 加载路径列表 */
    paths: [] as string[],
    /** 自动加载路径后缀 */
    suffix: [] as string[],
    /** 输出文件 */
    out: "",
    /** 模板字符串 {{path}} 为路径占位符(默认: export * from "{{path}}";) */
    template: `export * from "{{path}}";`,
};

export default function generate(conf: typeof confing) {
    conf = { ...confing, ...conf };
    const filePaths = filePathTree(conf.suffix, conf.suffix.map((k) => `${conf.root}/**/*${k}`));
    const list = [
        ...filePaths.list.map((path) => `${conf.root}/${path}`),
        ...conf.paths
    ];
    const content = list.map((path) => conf.template.replace(/{{path}}/g, path)).join("\n");
    const file = write(conf.out);
    file.write(content);
    file.close();
}