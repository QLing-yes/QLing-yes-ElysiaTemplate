export { logger } from "@/app/lib/logger";
export { redis } from "@/app/lib/redis";
export { ResSchemaFun } from "./schemaDerive";

import type routes from "@/app/plugins/routes.plug.ts";
import type { ResType } from "./schemaDerive";

/** 控制器工厂 */
export const ctrl = <T>(fun: (app: typeof routes) => T) => fun;

/** 成功响应 */
export function success<T>(data: T, msg = ""): ResType<T> {
  return { msg, code: 1, data };
}

/** 错误响应 */
export function error(msg = "", code = 0): ResType<null> {
  return { msg, code, data: null };
}
