#!/usr/bin/env node
import { runMcpServer } from "../src/index.mjs";

runMcpServer().catch((err) => {
  console.error("[brazil-ai-x402-mcp] fatal:", err);
  process.exit(1);
});
