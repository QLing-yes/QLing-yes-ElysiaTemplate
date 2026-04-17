/**
 * 通用交互式菜单引擎（Node.js）
 * ↑↓ / Home / End 选择，Enter 进入/执行，ESC / ← 返回，Ctrl+C 退出
 */

import { spawn } from "node:child_process";

// ── 类型 ─────────────────────────────────────────────────────

/** 菜单项结构 */
export type MenuItem = {
  /** 显示名称（必填） */
  name: string;
  /** 描述说明 */
  remark?: string;
  /** 执行函数（叶子项） */
  fun?: () => any;
  /** 子菜单（分组项） */
  children?: MenuItem[];
};

// ── 常量 ─────────────────────────────────────────────────────

const HIDE = "\x1b[?25l";
const SHOW = "\x1b[?25h";
const SEP  = "─".repeat(40);
const WIN  = process.platform === "win32";

// ── 终端工具 ─────────────────────────────────────────────────

/**
 * 橙色 ANSI 着色
 * @param s 原始字符串
 * @returns 着色后字符串
 */
export function orange(s: string): string {
  return `\x1b[38;5;208m${s}\x1b[0m`;
}

/**
 * 挂起 stdin 并等待任意按键
 * @returns 按键后 resolve 的 Promise
 */
function waitKey(): Promise<void> {
  return new Promise((resolve) => {
    process.stdin.setRawMode(true).resume().setEncoding("utf8");
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false).pause();
      resolve();
    });
  });
}

/**
 * 将带 `KEY=val` 前缀的命令转为 Windows cmd 格式
 * @param cmd 原始命令字符串
 * @returns [file, args] 供 spawn 使用
 */
function parseWinCmd(cmd: string): [string, string[]] {
  const envRe = /^[A-Za-z_]\w*=\S*/;
  const envs: string[] = [];
  let rest = cmd.trim();

  while (envRe.test(rest)) {
    const [match] = rest.match(envRe)!;
    envs.push(match);
    rest = rest.slice(match.length).trimStart();
  }

  if (envs.length === 0) return ["cmd", ["/c", cmd]];

  const setCmd = envs.map((e) => {
    const i = e.indexOf("=");
    return `set "${e.slice(0, i)}=${e.slice(i + 1)}"`;
  }).join(" && ");

  return ["cmd", ["/c", `${setCmd} && ${rest}`]];
}

/**
 * 执行 shell 命令并等待完成
 * @param cmd 要执行的命令字符串
 */
export async function execCmd(cmd: string): Promise<void> {
  const [file, args] = WIN ? parseWinCmd(cmd) : ["sh", ["-c", cmd]];

  console.log(`\n\x1b[1;35m执行:\x1b[0m ${cmd}\n\x1b[2m${SEP}\x1b[0m`);

  await new Promise<void>((resolve, reject) => {
    spawn(file, args, { stdio: "inherit" })
      .on("close", resolve)
      .on("error", reject);
  });

  console.log(`\x1b[2m${SEP}\x1b[0m`);
}

// ── 渲染 ─────────────────────────────────────────────────────

/**
 * 生成底部操作提示
 * @param item 当前选中项
 * @param isSubMenu 是否处于子菜单层
 * @returns 提示字符串
 */
function buildHints(item: MenuItem, isSubMenu: boolean): string {
  return [
    "↑↓ 选择",
    "Home/End 首尾",
    item.children ? "Enter 进入" : "Enter 执行",
    ...(isSubMenu ? ["ESC/← 返回"] : []),
    "Ctrl+C 退出",
  ].join("  ");
}

/**
 * 渲染完整菜单为 ANSI 字符串
 * @param items 当前层菜单项
 * @param sel 选中索引
 * @param breadcrumb 面包屑路径段
 * @returns 可直接 write 到 stdout 的字符串
 */
function render(items: MenuItem[], sel: number, breadcrumb: string[]): string {
  const isSubMenu = breadcrumb.length > 0;
  const counter   = `\x1b[2m(${sel + 1}/${items.length})\x1b[0m`;

  let s = "\x1b[2J\x1b[H";
  s += "\x1b[38;5;45m╭──────────────────────────────────────────────────╮\x1b[0m\n";
  s += "\x1b[38;5;45m│\x1b[0m        \x1b[1;36m🚀 命令菜单    \x1b[0m                          \x1b[38;5;45m│\x1b[0m\n";
  s += "\x1b[38;5;45m╰──────────────────────────────────────────────────╯\x1b[0m\n";
  s += isSubMenu
    ? `\x1b[2m  ${breadcrumb.join(" › ")}\x1b[0m  ${counter}\n`
    : `  ${counter}\n`;
  s += `\x1b[2m  ${buildHints(items[sel]!, isSubMenu)}\x1b[0m\n\n`;

  for (let i = 0; i < items.length; i++) {
    const it = items[i]!;
    const on = i === sel;
    s += `  ${on ? "\x1b[1;32m▶" : "\x1b[2m "} ${it.name}\x1b[0m`;
    s += it.children ? `  ${orange("›")}` : "";
    s += `  \x1b[90m${it.remark ?? ""}\x1b[0m\n`;
  }

  return s;
}

// ── 交互核心 ─────────────────────────────────────────────────

/**
 * 处理 Enter 键逻辑（进入子菜单 或 执行命令）
 * 提取为独立函数以将 navigate 嵌套层级控制在 ≤3
 * @param it 选中的菜单项
 * @param breadcrumb 当前面包屑路径
 */
async function handleEnter(it: MenuItem, breadcrumb: string[]): Promise<void> {
  if (it.children) {
    await navigate(it.children, [...breadcrumb, it.name]);
    return;
  }
  if (it.fun) {
    await it.fun();
    console.log("\x1b[2m按任意键返回...\x1b[0m");
    await waitKey();
  }
}

/**
 * 启动交互式菜单导航
 * @param items 菜单项列表
 * @param breadcrumb 面包屑路径（根层默认空数组）
 */
export async function navigate(items: MenuItem[], breadcrumb: string[] = []): Promise<void> {
  // 非 TTY 环境（如 CI / 管道）直接跳过交互
  if (!process.stdin.isTTY) {
    console.error("\x1b[33m警告：非交互式终端，请通过参数直接指定目标项\x1b[0m");
    return;
  }

  let idx = 0;
  const rd  = () => process.stdout.write(render(items, idx, breadcrumb));
  const fin = () => { process.stdout.write(SHOW); process.stdin.setRawMode(false).pause(); };

  process.stdout.write(HIDE);
  rd();

  await new Promise<void>((resolve) => {
    const onKey = async (k: unknown) => {
      const key = String(k);

      if (key === "\x03") { fin(); console.log("\n\x1b[33m已退出\x1b[0m\n"); process.exit(0); }

      // 导航键：单行处理，无额外嵌套
      if (key === "\x1b[A")                          { idx = (idx - 1 + items.length) % items.length; return rd(); }
      if (key === "\x1b[B")                          { idx = (idx + 1) % items.length;                return rd(); }
      if (key === "\x1b[H" || key === "\x1b[1~")     { idx = 0;                                       return rd(); }
      if (key === "\x1b[F" || key === "\x1b[4~")     { idx = items.length - 1;                        return rd(); }

      // ESC / ← 返回上级
      if ((key === "\x1b" || key === "\x1b[D") && breadcrumb.length > 0) {
        process.stdin.removeListener("data", onKey);
        fin();
        return resolve();
      }

      // Enter：执行或进入子菜单
      if (key === "\r" || key === "\n") {
        const it = items[idx];
        if (!it) return;

        process.stdin.removeListener("data", onKey);
        fin();
        await handleEnter(it, breadcrumb);

        // 返回本层：统一恢复
        process.stdin.setRawMode(true).resume().setEncoding("utf8");
        process.stdin.on("data", onKey);
        process.stdout.write(HIDE);
        rd();
      }
    };

    process.stdin.setRawMode(true).resume().setEncoding("utf8");
    process.stdin.on("data", onKey);
  });
}

// ── CLI 工具 ─────────────────────────────────────────────────

/**
 * 递归收集所有叶子项及其完整路径
 * @param items 菜单项列表
 * @param path 当前累积路径（递归内部使用）
 * @returns 每个叶子项及其路径的数组
 */
export function collectLeaves(
  items: MenuItem[],
  path: string[] = [],
): Array<{ /** 从根到叶子的完整路径 */ path: string[]; /** 叶子菜单项 */ item: MenuItem }> {
  return items.flatMap((it) =>
    it.children
      ? collectLeaves(it.children, [...path, it.name])
      : [{ path: [...path, it.name], item: it }],
  );
}

/**
 * 按 argv 路径段逐层模糊匹配（精确优先，忽略大小写）
 * @param root 根菜单项列表
 * @param args 命令行参数段
 * @returns 命中的菜单项及面包屑，未找到返回 null
 */
export function resolveArgs(
  root: MenuItem[],
  args: string[],
): { /** 命中的菜单项 */ item: MenuItem; /** 路径面包屑 */ breadcrumb: string[] } | null {
  let items = root;
  const breadcrumb: string[] = [];
  let item: MenuItem | undefined;

  for (const arg of args) {
    const q = arg.toLowerCase();
    item = items.find((it) => it.name.toLowerCase() === q)
        ?? items.find((it) => it.name.toLowerCase().includes(q));
    if (!item) return null;
    breadcrumb.push(item.name);
    if (item.children) items = item.children;
  }

  return item ? { item, breadcrumb } : null;
}

/**
 * CLI 总入口：解析 process.argv 并分发到对应逻辑
 *
 * - `--list` / `-l`      列出所有可执行叶子项
 * - `<名称> [<子项>]`    模糊匹配后直接执行或进入子菜单
 * - （无参数）            启动完整交互式菜单
 *
 * @param root 根菜单项列表
 */
export async function entry(root: MenuItem[]): Promise<void> {
  const args = process.argv.slice(2);

  if (args[0] === "--list" || args[0] === "-l") {
    console.log("\n\x1b[1;36m可用项目：\x1b[0m\n");
    let lastGroup = "";
    for (const { path, item } of collectLeaves(root)) {
      const group = path.slice(0, -1).join(" › ");
      if (group !== lastGroup) { console.log(orange(`  ${group}`)); lastGroup = group; }
      console.log(`    \x1b[2m·\x1b[0m ${item.name}  \x1b[90m${item.remark ?? ""}\x1b[0m`);
    }
    console.log();
    return;
  }

  if (args.length > 0) {
    const result = resolveArgs(root, args);
    if (!result) {
      console.error(`\n\x1b[31m未找到：\x1b[0m "${args.join(" › ")}"\n`);
      console.error(`加 \x1b[1m--list\x1b[0m 查看所有可用项目\n`);
      process.exit(1);
    }
    const { item, breadcrumb } = result;
    if (item.fun)           await item.fun();
    else if (item.children) await navigate(item.children, breadcrumb);
    return;
  }

  await navigate(root);
}