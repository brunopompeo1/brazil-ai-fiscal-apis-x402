// Run from the repository: node examples/execute.mjs [--execute]
// Default: free static sample. --execute: live call, 0.002 USDC with a funded
// X402_PRIVATE_KEY, or one request from your BRAZIL_AI_API_KEY quota.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';

if (!process.argv.includes('--execute')) {
  const response = await fetch('https://web-enrichment-x402.architect-x402.workers.dev/sample', { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Sample HTTP ${response.status}`);
  console.log(await response.text());
} else {
  if (!process.env.X402_PRIVATE_KEY && !process.env.EVM_PRIVATE_KEY && !process.env.BRAZIL_AI_API_KEY) {
    throw new Error('Configure X402_PRIVATE_KEY (USDC on Base) or BRAZIL_AI_API_KEY locally before live execution. Never paste credentials into chat.');
  }
  const client = new Client({ name: 'brazil-ai-quickstart', version: '1.0.0' });
  try {
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('../bin/cli.mjs', import.meta.url))] }));
    const result = await client.callTool({ name: 'web_enrichment_clean', arguments: { url: 'https://example.com', format: 'json' } });
    for (const item of result.content) if (item.type === 'text') console.log(item.text);
    if (result.isError) process.exitCode = 1;
  } finally { await client.close(); }
}
