/**
 * 通用交互式菜单引擎
 * ↑↓ / Home / End 选择，Enter 进入/执行，ESC / ← 返回，Ctrl+C 退出
 */

export type MenuItem = {
  name: string;
  remark?: string;
  fun?: () => void | Promise<void>;
  children?: MenuItem[];
};

// ── 终端工具 ─────────────────────────────────────────────────

const HIDE = "\x1b[?25l";
const SHOW = "\x1b[?25h";

export const orange = (s: string) => `\x1b[38;5;208m${s}\x1b[0m`;

const waitKey = () =>
  new Promise<void>((resolve) => {
    process.stdin.setRawMode(true).resume().setEncoding("utf8");
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false).pause();
      resolve();
    });
  });
export async function execCmd(cmd: string) {
  const WIN = process.platform === "win32";
  const SEP = "─".repeat(40);
  const spawnCmd = WIN ? parseCmd(cmd) : ["sh", "-c", cmd];
  console.log(`\n\x1b[1;35m执行:\x1b[0m ${spawnCmd[2]}\n\x1b[2m${SEP}\x1b[0m`);

  const p = Bun.spawn(spawnCmd, {
    stdout: "inherit",
    stderr: "inherit",
  });
  await p.exited;
  console.log(`\x1b[2m${SEP}\x1b[0m`);
}

function parseCmd(cmd: string): string[] {
  const envPattern = /^[A-Za-z_][A-Za-z0-9_]*=.*?(?=\s+[A-Za-z_]|$)/g;
  const envs = cmd.match(envPattern) || [];
  if (envs.length === 0) return ["cmd", "/c", cmd];

  const actualCmd = cmd.slice(envs.join(" ").length).trim();
  const setCmd = envs
    .map((e) => {
      const i = e.indexOf("=");
      return `set "${e.slice(0, i)}=${e.slice(i + 1)}"`;
    })
    .join("&&");

  return ["cmd", "/c", `${setCmd}&&${actualCmd}`];
}

// ── 渲染 ─────────────────────────────────────────────────────

const buildHints = (item: MenuItem, isSubMenu: boolean) =>
  [
    "↑↓ 选择",
    "Home/End 首尾",
    item.children ? "Enter 进入" : "Enter 执行",
    ...(isSubMenu ? ["ESC/← 返回"] : []),
    "Ctrl+C 退出",
  ].join("  ");

function render(items: MenuItem[], sel: number, breadcrumb: string[]) {
  const isSubMenu = breadcrumb.length > 0;
  const counter = `\x1b[2m(${sel + 1}/${items.length})\x1b[0m`;

  let s = "\x1b[2J\x1b[H";
  s +=
    "\x1b[38;5;45m╭──────────────────────────────────────────────────╮\x1b[0m\n";
  s +=
    "\x1b[38;5;45m│\x1b[0m        \x1b[1;36m🚀 Bun 命令菜单    \x1b[0m                       \x1b[38;5;45m│\x1b[0m\n";
  s +=
    "\x1b[38;5;45m╰──────────────────────────────────────────────────╯\x1b[0m\n";
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

export async function navigate(items: MenuItem[], breadcrumb: string[] = []) {
  let idx = 0;
  const rd = () => process.stdout.write(render(items, idx, breadcrumb));
  const fin = () => {
    process.stdout.write(SHOW);
    process.stdin.setRawMode(false).pause();
  };

  process.stdout.write(HIDE);
  rd();

  await new Promise<void>((resolve) => {
    const onKey = async (k: unknown) => {
      const key = String(k);

      if (key === "\x03") {
        // Ctrl+C
        fin();
        console.log("\n\x1b[33m已退出\x1b[0m\n");
        process.exit(0);
      } else if (key === "\x1b[A") {
        // ↑
        idx = (idx - 1 + items.length) % items.length;
        rd();
      } else if (key === "\x1b[B") {
        // ↓
        idx = (idx + 1) % items.length;
        rd();
      } else if (key === "\x1b[H" || key === "\x1b[1~") {
        // Home
        idx = 0;
        rd();
      } else if (key === "\x1b[F" || key === "\x1b[4~") {
        // End
        idx = items.length - 1;
        rd();
      } else if (key === "\x1b" || key === "\x1b[D") {
        // ESC / ←
        if (breadcrumb.length > 0) {
          process.stdin.removeListener("data", onKey);
          fin();
          resolve();
        }
      } else if (key === "\r" || key === "\n") {
        // Enter
        const it = items[idx];
        if (!it) return;

        process.stdin.removeListener("data", onKey);
        fin();

        if (it.children) {
          await navigate(it.children, [...breadcrumb, it.name]);
        } else if (it.fun) {
          await it.fun();
          console.log("\x1b[2m按任意键返回...\x1b[0m");
          await waitKey();
        }

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

/** 递归收集所有叶子项及其路径 */
export function collectLeaves(
  items: MenuItem[],
  path: string[] = [],
): Array<{ path: string[]; item: MenuItem }> {
  return items.flatMap((it) =>
    it.children
      ? collectLeaves(it.children, [...path, it.name])
      : [{ path: [...path, it.name], item: it }],
  );
}

/** 按 argv 路径段逐层模糊匹配（精确优先，忽略大小写） */
export function resolveArgs(
  root: MenuItem[],
  args: string[],
): { item: MenuItem; breadcrumb: string[] } | null {
  let items = root;
  const breadcrumb: string[] = [];
  let item: MenuItem | undefined;

  for (const arg of args) {
    const q = arg.toLowerCase();
    item =
      items.find((it) => it.name.toLowerCase() === q) ??
      items.find((it) => it.name.toLowerCase().includes(q));
    if (!item) return null;
    breadcrumb.push(item.name);
    if (item.children) items = item.children;
  }

  return item ? { item, breadcrumb } : null;
}
