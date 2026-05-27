[English](./README-en.md) | [中文](./README.md)

## Pre-release

- Version `1.0.0` onwards is the official release.
- `bun create app-elysia@latest` - Try it out

## Project Structure
- Auto-routing, logging system, ORM, end-to-end type safety, and more features coming soon.

```
Project/
├── public/                   # Static assets (auto-routed)
├── app/
│   ├── common/
│   │   └── index.ts          # Global module (registered to "$g", used only in `controller`)
│   │   └── schemas.ts        # Data schemas (auto-registered via elysia.model)
│   │   └── schemaDerive.ts   # Derived types and methods for schemas
│   ├── controller/           # Controller layer (auto-loads files ending with `ctrl.ts`, routes update on change)
│   ├── lib/
│   │   ├── error.ts          # Global error & process event capture (sync mode)
│   │   ├── logger.ts         # Logger (async mode by default)
│   │   ├── drizzle.ts        # Drizzle client
│   │   └── redis.ts          # Redis client
│   ├── model/                # Drizzle schema directory
│   ├── plugins/
│   │   ├── index.plug.ts     # Global plugin
│   │   └── macro.plug.ts     # Macro plugin
│   │   └── controller.plug.ts # Controller plugin
│   │   └── schemas.plug.ts   # Schema registration plugin
│   ├── utils/                # Utility functions
│   └── cluster.ts            # Single-machine multi-process cluster entry
│   └── index.ts              # Application entry
├── logs/
├── test/                     # Eden test directory
├── support/                  # Helper scripts directory (no need to care)
│   └── script/
│       ├── index.ts          # Generation script
│       ├── menu.ts           # Command menu
│       └── routes.ts         # Route generation tool
|── .env                      # Configuration file
|── drizzle.config.ts         # Drizzle configuration
...
```

## Create a Project with CLI

```bash
bun create app-elysia@latest
```

- You can also directly download this repository for use.

### Follow These Steps to Configure Drizzle

1. **Check database configuration** — Verify the database connection info in [.env](.env) is correct
2. **Confirm schemas** — Check the schema definitions in [app/model](app/model) meet your requirements
3. **Sync to database** — Run `bun run generate_drizzle` + `bun run drizzle_migrate`

## Quick Start

```bash
bun i
bun run dev
```

## Commands

```bash
bun run menu    # Launch interactive menu
bun run dev     # Start dev server with auto route generation
bun run start-hot # Start in production mode with hot reload
bun run start-hot-bg # Start in production mode with hot reload, persist after terminal close
bun run fix     # Fix code style

bun run generate  # Run all commands prefixed with `generate_`
bun run generate_script  # Generate routes (usually no need to run manually)

bun run drizzle_studio  # Drizzle visual editor
bun run generate_drigrate_migrate # Generate migrations and run them

```
- `bun run menu --list` lists all options
- `bun run menu <parent> <child> <...>` navigate and execute by path level

## Logging Configuration

- Default: App uses `sync` mode for recording ([app/lib/error.ts](app/lib/error.ts)), controllers use `async` mode ([app/plugins/controller.plug.ts](app/plugins/controller.plug.ts)).

```typescript
import { Logger, logger } from "@/app/lib/logger";
//const logger = new Logger({ sync: false, level: "debug" });
logger.info("msg", { meta: "value" });
logger.error("msg", Object | Error);
```

[logger.ts](app/lib/logger.ts)

```typescript
/** Log level */
export type LogLevel = "debug" | "info" | "warn" | "error";

/** File rotation granularity */
export type RotateBy = "hour" | "day" | "month";

/** Log metadata type */
export type Meta = Record<string, unknown> | Error | undefined | null;

/** Logger constructor options */
export interface LoggerOptions {
  /** Log output directory, default `logs` */
  dir?: string;
  /** File rotation granularity, default `day` */
  rotateBy?: RotateBy;
  /** Whether to also output to stdout, default `true` */
  stdout?: boolean;
  /** Minimum log level, default `debug` */
  level?: LogLevel;
  /** Scheduled flush interval (ms), default `1000` */
  flushInterval?: number;
  /**
   * Memory buffer high watermark (bytes), sync flush to disk when reached, default `1MB`
   * Applicable to async mode; sync mode flushes on each write, this option is ignored
   */
  highWaterMark?: number;
  /** Maximum number of archived files to keep, 0 means no limit, default `0` */
  maxFiles?: number;
  /** Sync write mode, default `false` */
  sync?: boolean;
  /** Indentation spaces for formatting metadata, default `1` */
  formatted?: number;
}
```

## AI Skills / For LLMs

```bash
bunx skills add elysiajs/skills
```

- [llms](https://elysiajs.com/llms.txt)
- [llms-full](https://elysiajs.com/llms-full.txt)

## MCP Recommendations

```json
{
  "mcpServers": {
    // Turn any GitHub project into a documentation hub
    "name": {
      "url": "https://gitmcp.io/{author}/{repo}"
    },
    // Elysia documentation
    "elysia": {
      "url": "https://gitmcp.io/elysiajs/documentation"
    },
    // Bun documentation
    "bun": {
      "url": "https://bun.com/docs/mcp"
    },
    // Codebase context understanding service
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp",
        "--api-key",
        "your-key"
      ]
    },
    // Codebase deep understanding service
    "deepwiki": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-deepwiki@latest"
      ]
    },
    // Chrome DevTools integration
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest"
      ]
    },
    // Playwright browser automation
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```