import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';

const env = { ...process.env };
for (const key of ['X402_PRIVATE_KEY', 'EVM_PRIVATE_KEY', 'BRAZIL_AI_API_KEY']) delete env[key];
const client = new Client({ name: 'smoke', version: '2.5.0' });
try {
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('../bin/cli.mjs', import.meta.url))], env }));
  const tools = await client.listTools();
  assert.equal(tools.tools.length, 11);
  assert.ok(tools.tools.some((t) => t.name === 'latam_validate_and_fx'), 'Missing latam_validate_and_fx tool');
  const result = await client.callTool({ name: 'brazil_ai_suite_status', arguments: {} });
  const status = JSON.parse(result.content[0].text);
  assert.equal(status.paymentMode, 'discovery_only');
  assert.equal(status.version, '2.5.0');
  assert.equal(status.services.length, 10);
  console.log('OK: initialization, eleven tools (10 paid + 1 free status), v2.5.0, and explicit discovery-only status without credentials.');
} finally { await client.close(); }
