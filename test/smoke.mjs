import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';

const env = { ...process.env };
for (const key of ['X402_PRIVATE_KEY', 'EVM_PRIVATE_KEY', 'BRAZIL_AI_API_KEY']) delete env[key];
const client = new Client({ name: 'smoke', version: '2.7.0' });
try {
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [fileURLToPath(new URL('../bin/cli.mjs', import.meta.url))], env }));
  const tools = await client.listTools();
  assert.equal(tools.tools.length, 15, `Expected 15 tools (14 paid + 1 free), got ${tools.tools.length}`);

  const expectedTools = [
    'brazil_ai_suite_status',
    'base_token_safety_check',
    'evm_wallet_risk_check',
    'hyperliquid_perp_funding_radar',
    'ai_crypto_outage_radar',
    'agent_guard_sanitize',
    'web_enrichment_clean',
    'agent_send_email',
    'latam_validate_and_fx',
    'br_nfe_xml_auditor',
    'br_danfse_rtc_generate',
    'br_docs_parser',
    'br_tax_payroll_calc',
    'br_business_intel',
    'br_fin_calculators',
  ];
  for (const name of expectedTools) {
    assert.ok(tools.tools.some((t) => t.name === name), `Missing tool: ${name}`);
  }

  const result = await client.callTool({ name: 'brazil_ai_suite_status', arguments: {} });
  const status = JSON.parse(result.content[0].text);
  assert.equal(status.paymentMode, 'discovery_only');
  assert.equal(status.version, '2.7.0');
  assert.equal(status.totalMicroservices, 12);
  assert.equal(status.services.length, 14);

  const expectedPrices = {
    base_token_safety_check: '0.015',
    evm_wallet_risk_check: '0.015',
    hyperliquid_perp_funding_radar: '0.015',
    ai_crypto_outage_radar: '0.015',
    agent_guard_sanitize: '0.008',
    web_enrichment_clean: '0.002',
    agent_send_email: '0.005',
    latam_validate_and_fx: '0.008',
    br_nfe_xml_auditor: '0.010',
    br_danfse_rtc_generate: '0.005',
    br_docs_parser: '0.008',
    br_tax_payroll_calc: '0.008',
    br_business_intel: '0.010',
    br_fin_calculators: '0.005',
  };
  for (const svc of status.services) {
    assert.equal(svc.priceUsdc, expectedPrices[svc.tool], `Price mismatch for ${svc.tool}`);
  }

  console.log('OK: initialization, fifteen tools (14 paid across 12 APIs + 1 free status), v2.7.0, preserved pricing, and explicit discovery-only status without credentials.');
} finally { await client.close(); }
