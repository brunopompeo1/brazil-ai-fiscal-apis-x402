# Global + LATAM AI & x402 API Suite — 12 Serverless Edge APIs (x402 v2 + MCP)

[![brunopompeo1/brazil-ai-fiscal-apis-x402 MCP server](https://glama.ai/mcp/servers/brunopompeo1/brazil-ai-fiscal-apis-x402/badges/score.svg)](https://glama.ai/mcp/servers/brunopompeo1/brazil-ai-fiscal-apis-x402)


> **New in v2.7.0 — 2 Global DeFi & Infra APIs (`$0.015 USDC`):** [`defi.brunopompeo.com.br`](https://defi.brunopompeo.com.br/sample) (Honeypot.is V2 swap simulation + GoPlus + DexScreener liquidity + DefiLlama oracle divergence across 7 EVM chains + EVM wallet phishing/sanctions risk & live Base ETH/USDC balances `/wallet`) and [`pulse.brunopompeo.com.br`](https://pulse.brunopompeo.com.br/sample) (live Hyperliquid perp funding across ~180 markets + squeeze radar `/funding` + live outage telemetry for 10 core AI/Crypto providers & Base RPC `/infra`). All 10 original API prices remain unchanged.
>
> **Also included (v2.6.0) — Official Brazil Tax Reform (LC 214/2025, RFB Base V0073) without Java Server:** [`danfse.brunopompeo.com.br`](https://danfse.brunopompeo.com.br/tables) embeds all 170 official Receita Federal `cClassTrib` legal reductions, Simples Nacional & 2026–2033 transition; [`nfe.brunopompeo.com.br`](https://nfe.brunopompeo.com.br/sample) audits CBS/IBS credits in BRL (single or batch `xmls[]`) with ready-to-send `supplierAlert`. See [`docs/RECEITA_4_AGENTES_REFORMA_TRIBUTARIA.md`](./docs/RECEITA_4_AGENTES_REFORMA_TRIBUTARIA.md) & [`examples/rtc-4-agents-workflow.mjs`](./examples/rtc-4-agents-workflow.mjs).

> [Português (README.md)](./README.md) | [Español (README.es.md)](./README.es.md) | [Unified Hub (api.brunopompeo.com.br)](https://api.brunopompeo.com.br) | [JSON Catalog](./catalog.json) | [llms.txt](./llms.txt)

A production suite of **12 ultra-fast Cloudflare Edge APIs** (**10–30 ms latency across Latin America**) built for **autonomous AI agents, DeFi/crypto bots, fintechs, KYC/onboarding pipelines, accounting automation, n8n/LangChain workflows, and ERPs**.

**Discovery does not execute a paid tool.** Without credentials, the unified MCP server runs in `discovery_only` mode. Configure `X402_PRIVATE_KEY` locally with a Base USDC wallet, or set `BRAZIL_AI_API_KEY` for a B2B plan.

- **Unified Gateway + 12 Dedicated Custom Domains:** Call everything via [`https://api.brunopompeo.com.br`](https://api.brunopompeo.com.br) or directly on each service subdomain (`*.brunopompeo.com.br`).
- **Zero signup, zero subscriptions:** Native **x402 v2** (`HTTP 402 Payment Required` in USDC on Base `eip155:8453`) via **Coinbase CDP Facilitator** (with PayAI fallback). Free **`GET /sample`** on every API.
- **One-command Unified MCP Server:** Connect all **14 paid tools + 1 free status tool** in Claude Desktop, Cursor, VS Code, or Windsurf via `npx -y @brunopompeo/brazil-ai-x402-mcp` (or `npx -y github:brunopompeo1/brazil-ai-fiscal-apis-x402`).

---

## Global High-Volume Agent & DeFi Tools (5)

| Service | Capabilities | Paid Endpoint (Base USDC) | Price | Free Sample |
| :--- | :--- | :--- | :--- | :--- |
| **Base & EVM DeFi Shield (NEW v2.7)** | Pre-trade token safety across 7 EVM chains (Honeypot.is V2 swap simulation + GoPlus + DexScreener live liquidity + DefiLlama oracle divergence `pass`/`warn`/`fail` + `safetyScore`) & EVM wallet risk + live Base ETH/USDC balances (`/wallet`) | `POST/GET https://defi.brunopompeo.com.br/check` & `/wallet` | `$0.015` | [`/sample`](https://defi.brunopompeo.com.br/sample) |
| **Crypto Perp & Infra Pulse (NEW v2.7)** | Live Hyperliquid perpetual funding rates (1h/8h/APR %), mark/oracle basis, OI USD & squeeze radar across ~180 markets + live outage status for 10 AI & Crypto providers & Base RPC (`/infra`) | `POST/GET https://pulse.brunopompeo.com.br/funding` & `/infra` | `$0.015` | [`/sample`](https://pulse.brunopompeo.com.br/sample) |
| **Agent Guard Firewall** | Hybrid prompt-injection detection (Llama Guard 3 8B + heuristics + Base64 decode) + PII/secret redaction | `POST https://guard.brunopompeo.com.br/guard` | `$0.008` | [`/sample`](https://guard.brunopompeo.com.br/sample) |
| **Web Content Enrichment** | HTML-to-Markdown + structured JSON tables + JSON-LD extraction with up to 85% token reduction | `GET https://web.brunopompeo.com.br/clean?url=<URL>&format=json` | `$0.002` | [`/sample`](https://web.brunopompeo.com.br/sample) |
| **Agent Email Dispatcher** | Pay-per-call transactional email gateway (Markdown → responsive HTML) with `dryRun` mode, zero SaaS subscription | `POST https://email.brunopompeo.com.br/send` | `$0.005` | [`/sample`](https://email.brunopompeo.com.br/sample) |

## LATAM & Brazil Fintech / Fiscal Suite (7)

| Service | Capabilities | Paid Endpoint (Base USDC) | Price | Free Sample |
| :--- | :--- | :--- | :--- | :--- |
| **LATAM Business & FX (v2.5)** | Validates & decodes tax/bank IDs across **7 countries** (MX RFC/CURP/CLABE, AR CUIT/CUIL/CBU, CL RUT/RUN, CO NIT, PE RUC, UY RUT, BR CPF/CNPJ) with batch/auto-detect + **real-time LATAM FX** (`MXN/ARS/CLP/COP/PEN/UYU/BRL/USD/EUR`) | `POST https://latam.brunopompeo.com.br/latam` | `$0.008` | [`/sample`](https://latam.brunopompeo.com.br/sample) |
| **Brazil NF-e XML Auditor** | SEFAZ 4.00 XML-to-JSON compression (~90% token savings), `vProd`/`vNF` reconciliation, CFOP/NCM/IBS/CBS credit audit | `POST https://nfe.brunopompeo.com.br/audit` | `$0.010` | [`/sample`](https://nfe.brunopompeo.com.br/sample) |
| **Brazil DANFSe & Tax Reform (RTC)** | Official Receita Federal RTC Calculator (Base V0073, zero Java server) and NFS-e Nacional DANFSe generator | `POST https://danfse.brunopompeo.com.br/generate` | `$0.005` | [`/sample`](https://danfse.brunopompeo.com.br/sample) |
| **Brazil Boleto & Tax Slip Parser** | FEBRABAN bank boletos (47/44 digits, post-Feb/2025 reset), DARF/FGTS/IPTU slips (48 digits), NF-e keys | `POST https://docs.brunopompeo.com.br/parse` | `$0.008` | [`/sample`](https://docs.brunopompeo.com.br/sample) |
| **Brazil Tax & Payroll Engine** | Simples Nacional (Anexos I–V + 28% Fator R), progressive INSS/IRRF + FGTS, B2B NFS-e withholdings | `POST https://tax.brunopompeo.com.br/calc` | `$0.008` | [`/sample`](https://tax.brunopompeo.com.br/sample) |
| **Brazil Business Intel & PIX** | Corporate CNPJ KYB dossier (QSA, Simples/MEI, risk score), IBGE Geo-CEP, PIX EMVCo CRC16 generator/decoder | `POST https://intel.brunopompeo.com.br/intel` | `$0.010` | [`/sample`](https://intel.brunopompeo.com.br/sample) |
| **Brazil BCB Financial Calculators** | Official Central Bank SGS monetary correction (IPCA, IGPM, INPC, SELIC, CDI), PTAX FX, Price/SAC schedules | `POST https://fin.brunopompeo.com.br/fin` | `$0.005` | [`/sample`](https://fin.brunopompeo.com.br/sample) |

---

## Copy-Paste Production Templates (`examples/`)
- **n8n Importable Workflow (`guard` + `web` + `latam`):** [`examples/n8n-workflow-x402-latam.json`](./examples/n8n-workflow-x402-latam.json)
- **LangChain / Vercel AI SDK Tool:** [`examples/langchain-x402.ts`](./examples/langchain-x402.ts)
- **Minimalist TypeScript x402 Client:** [`examples/typescript-x402-client.ts`](./examples/typescript-x402-client.ts)
- **Python Agent Client:** [`examples/python-x402-client.py`](./examples/python-x402-client.py)

## Quick Integration — Unified MCP Server
```json
{
  "mcpServers": {
    "latam-brazil-ai-x402": {
      "command": "npx",
      "args": ["-y", "@brunopompeo/brazil-ai-x402-mcp"],
      "env": {
        "X402_PRIVATE_KEY": "",
        "X402_MAX_USDC_PER_CALL": "0.05"
      }
    }
  }
}
```
