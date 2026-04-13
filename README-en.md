English | [中文](./README.md)

## Pre-Release
- `1.0.0` is the stable release.

## Project Structure

```
Project/
├── public/                   # Static assets (auto-routed)
├── app/
│   ├── common/
│   │   └── index.ts          # Global module (registered to "$g")
│   │   └── schemas.ts        # Data models
│   │   └── schemaDerive.ts  # Derived types & methods
│   ├── controller/           # Controllers (auto-load `ctrl.ts` files)
│   ├── lib/
│   │   ├── error.ts          # Global error handling (sync mode)
│   │   ├── logger.ts         # Logger (async mode)
│   │   ├── prisma.ts         # Prisma client
│   │   └── redis.ts          # Redis client
│   ├── plugins/
│   │   ├── index.plug.ts     # Global plugins
│   │   └── macro.plug.ts     # Macro plugins
│   │   └── routes.plug.ts    # Route plugins
│   │   └── schemas.plug.ts   # Schema registration
│   ├── utils/                # Utilities
│   └── cluster.ts            # Cluster mode entry
│   └── index.ts              # App entry
├── logs/
├── prisma/                   # Prisma ORM
│   ├── migrations/
│   └── schema.prisma
├── test/                     # Eden tests
├── support/                  # Support scripts
└── .env
```

## Quick Start

```bash
bun i
bun run dev-parallel
```

## Commands

```bash
bun run menu      # Command menu
bun run dev       # Dev server + auto-generate routes
bun run dev-watch # Dev server only
bun run start-hot # Production with hot reload
bun run start-hot-bg # Production, background process
bun run fix       # Fix code style
bun run generate  # Generate routes & prisma
bun run generate_script  # Generate routes
bun run generate_prisma  # Generate prisma client
```

## Logger

- Error handling: [sync mode](app/lib/error.ts)
- Controller logs: [async mode](app/plugins/routes.plug.ts)

```typescript
import { Logger, logger } from "@/app/lib/logger";
logger.info("msg", { meta: "value" });
logger.error("msg", Object | Error);
```

## AI Skills / LLMs

```bash
bunx skills add elysiajs/skills
```

- [llms](https://elysiajs.com/llms.txt)
- [llms-full](https://elysiajs.com/llms-full.txt)

## Recommended MCPs

```json
{
  "mcpServers": {
    "elysia": {
      "url": "https://gitmcp.io/elysiajs/documentation"
    },
    "bun": {
      "url": "https://bun.com/docs/mcp"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "your-key"]
    },
    "deepwiki": {
      "command": "npx",
      "args": ["-y", "mcp-deepwiki@latest"]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```
