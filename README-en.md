[English](./README-en.md) | [中文](./README.md)

## Pre-release Version
- Version `1.0.0` and above are officially released versions.

## Project Structure
> ⚠️ **Note**: Prisma and Drizzle related files are only generated when you select the corresponding template via CLI.
- Automatic routing, logging system, end-to-end type safety, and more features coming soon.

```
Project/
├── public/                   # Static resources (auto-routed)
├── app/
│   ├── common/
│   │   └── index.ts          # Global module (registered to global "$g", only used in `controller`)
│   │   └── schemas.ts        # Data models (automatically registered via elysia.model)
│   │   └── schemaDerive.ts   # Derived types and methods for data models
│   ├── controller/           # Controller layer (auto-loads files ending with `ctrl.ts`, routes auto-update on changes)
│   ├── lib/
│   │   ├── error.ts          # Global error and process event capture/recording (sync mode)
│   │   ├── logger.ts         # Logging library (async mode by default)
│   │   ├── prisma.ts         # Prisma client
│   │   └── redis.ts          # Redis client
│   ├── plugins/
│   │   ├── index.plug.ts     # Global plugin
│   │   └── macro.plug.ts     # Macro plugin
│   │   └── routes.plug.ts    # Routes plugin
│   │   └── schemas.plug.ts   # Data model registration plugin
│   ├── utils/                # Utility functions
│   └── cluster.ts            # Single-machine multi-process cluster mode entry
│   └── index.ts              # Application entry point
├── logs/
├── prisma/                   # Prisma ORM configuration directory
│   ├── migrations/           # Database migration files directory
│   │   └── migration.sql
│   └── schema.prisma         # Prisma data models
├── test/                     # Eden test directory
├── support/                  # Support scripts directory (no need to worry about)
│   └── script/
│       ├── index.ts          # Generation scripts
│       ├── menu.ts           # Command menu
│       └── routes.ts         # Route generation utility
|── .env                      # Configuration file
...
```

## Create Project Using CLI

```bash
bun create app-elysia@latest
```
- Of course, you can also directly download and use this repository.

### After Selecting Drizzle Template, Please Configure Following These Steps:

1. **Check Database Configuration** — Verify the database connection information in [.env](.env) is correct
2. **Verify Data Models** — Check if the model definitions in [app/model](app/model) meet your requirements
3. **Sync to Database** — Run `bun run generate_drizzle` + `bun run drizzle_migrate`

### After Selecting Prisma Template, Please Configure Following These Steps:

1. **Check Database Configuration** — Verify the database connection information in [.env](.env) is correct
2. **Verify Data Models** — Check if the model definitions in [schema.prisma](prisma/schema.prisma) meet your requirements
3. **Initialize Database** (execute for new databases only) — Run `bunx --bun prisma migrate dev --name init` to create initial migration
4. **Generate Client** — Execute `bun run generate_prisma` to generate Prisma Client

## Quick Start

```bash
bun i
bun run dev
```

## Commands
```bash
bun run menu    # Start command menu
bun run dev     # Start development server, auto-generate routes
bun run dev-watch # Start development server
bun run start-hot # Start in production environment with hot reload support
bun run start-hot-bg # Start in production environment with hot reload support, process continues when terminal closes
bun run fix     # Fix code style

bun run generate  # Generate routes, prisma client, drizzle migration data
bun run generate_script  # Generate routes (generally no need to manually execute)

bun run generate_drizzle  # Generate Drizzle migration data
bun run drizzle_migrate  # Execute migration
bun run drizzle_push  # Sync database
bun run drizzle_studio  # Database visualization tool

bun run generate_prisma  # Generate Prisma client
```

## Logging Configuration
- Default: [Application uses `sync` mode for recording](app/lib/error.ts), [Controller uses `async` recording method](app/plugins/routes.plug.ts).

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
  /** Whether to output to stdout simultaneously, default `true` */
  stdout?: boolean;
  /** Minimum recording level, default `debug` */
  level?: LogLevel;
  /** Periodic flush interval (ms), default `1000` */
  flushInterval?: number;
  /**
   * Memory buffer high water mark (bytes), flush to disk when reached, default `1MB`
   * Applicable to async mode; sync mode writes directly to disk each time, this option is invalid
   */
  highWaterMark?: number;
  /** Maximum number of archived files to retain, 0 means unlimited, default `0` */
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

## Recommended MCP
```json
{
  "mcpServers": {
    // Turn any GitHub project into a documentation center
    "name": {
      "url": "https://gitmcp.io/{author}/{repo}"
    },
    // elysia documentation
    "elysia": {
      "url": "https://gitmcp.io/elysiajs/documentation"
    },
    // Bun documentation
    "bun": {
      "url": "https://bun.com/docs/mcp",
    },
    // Codebase context understanding service
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp",
        "--api-key",
        "your-api-key"
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
