# Brazil AI & x402 Enterprise Suite — Fiscal, Accounting, Finance & Security APIs

> [Documentação em Português (README.md)](./README.md) | [JSON Catalog](./catalog.json) | [llms.txt](./llms.txt)

A production suite of **7 serverless edge APIs** built for **autonomous AI agents, fintechs, accounting automation, ERPs, and LatAm/Brazil B2B workflows**.

- **Zero setup, zero subscriptions:** Native **x402 v2** (`HTTP 402 Payment Required` in USDC on Base Mainnet) + **MCP (`/mcp`)** JSON-RPC 2.0 + **`/llms.txt`** and **`/.well-known/x402`** discovery.
- **Deterministic engines + Edge AI summaries:** Exact math and Brazilian regulatory rules combined with optional Cloudflare Workers AI executive briefs.
- **B2B API Key option:** Brazilian software houses and accounting firms can also license monthly volume plans via PIX ([B2B Guide](./docs/GUIA_EMPRESAS_B2B.md)).

---

## Live Production Endpoints

| Service | Capabilities | Endpoint | Price (Base USDC) |
| :--- | :--- | :--- | :--- |
| **Brazil NF-e XML Auditor** | SEFAZ 4.00 XML-to-JSON compression (~90% token savings), `vProd`/`vNF` reconciliation, CFOP/NCM/cStat=100 audit, 44-digit Mod-11 key decoder | `POST https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/audit` | `$0.010` |
| **Brazil Boleto & Tax Slip Parser** | FEBRABAN bank boletos (47/44 digits, post-Feb/2025 due-date reset), DARF/FGTS/IPTU slips (48 digits), 35+ banks, NF-e keys | `POST https://br-docs-parser-x402.architect-x402.workers.dev/parse` | `$0.008` |
| **Brazil Tax & Payroll Engine** | Simples Nacional (Anexos I–V + 28% Fator R optimization), progressive INSS/IRRF (Legal vs Simplified) + FGTS, B2B NFS-e withholdings | `POST https://br-tax-payroll-calc-x402.architect-x402.workers.dev/calc` | `$0.008` |
| **Brazil Business Intel & PIX** | Corporate CNPJ KYB dossier (QSA, Simples/MEI, risk score), IBGE Geo-CEP, CPF/CNPJ Mod-11 validator, PIX EMVCo CRC16 generator/decoder | `POST https://br-business-intel-x402.architect-x402.workers.dev/intel` | `$0.010` |
| **Brazil BCB Financial Calculators** | Official Central Bank SGS monetary correction (IPCA, IGPM, INPC, SELIC, CDI), official PTAX FX (BRL/USD/EUR/GBP), Price/SAC amortization | `POST https://br-fin-calculators-x402.architect-x402.workers.dev/fin` | `$0.005` |
| **Web Content Enrichment** | HTML-to-Markdown + structured JSON tables + JSON-LD extraction with token-savings metrics | `GET https://web-enrichment-x402.architect-x402.workers.dev/clean?url=<URL>&format=json` | `$0.002` |
| **Agent Guard Firewall** | Hybrid prompt-injection detection (Llama Guard 3 8B + heuristics + Base64 decode) + Brazilian PII/secret masking | `POST https://agent-guard-x402.architect-x402.workers.dev/guard` | `$0.020` |

---

## Quick Integration

- **MCP Clients (Claude Desktop, Cursor, VS Code):** Copy [`examples/ai-connectors.json`](./examples/ai-connectors.json).
- **TypeScript / Node x402 Client:** See [`examples/quickstart.ts`](./examples/quickstart.ts).
- **Python Discovery Script:** See [`examples/quickstart.py`](./examples/quickstart.py).
