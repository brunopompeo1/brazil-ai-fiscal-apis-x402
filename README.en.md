# Brazil AI & x402 Enterprise Suite — Fiscal, Accounting, Finance & Security APIs

> [Documentação em Português (README.md)](./README.md) | [JSON Catalog](./catalog.json) | [llms.txt](./llms.txt)

A production suite of **7 serverless edge APIs** built for **autonomous AI agents, fintechs, accounting automation, ERPs, and LatAm/Brazil B2B workflows**.

- **Zero setup, zero subscriptions:** Native **x402 v2** (`HTTP 402 Payment Required` in USDC on Base Mainnet), **OpenAPI 3.1.0 (`/openapi.json`)** indexed on **x402scan.com** & **PayAI Bazaar**, free **`/sample`** preview endpoints, and **Model Context Protocol (`MCP`)**.
- **One-command Unified MCP Server:** Connect all 7 tools at once in Claude Desktop, Cursor, VS Code, or Windsurf via `npx -y github:brunopompeo1/brazil-ai-fiscal-apis-x402`.
- **B2B API Key option:** Brazilian software houses and accounting firms can also license monthly volume plans via PIX ([B2B Guide](./docs/GUIA_EMPRESAS_B2B.md)).

---

## Live Production Endpoints

| Service | Capabilities | Paid Endpoint (Base USDC) | Price | Free Sample |
| :--- | :--- | :--- | :--- | :--- |
| **Brazil NF-e XML Auditor** | SEFAZ 4.00 XML-to-JSON compression (~90% token savings), `vProd`/`vNF` reconciliation, CFOP/NCM/cStat=100 audit, 44-digit Mod-11 key decoder | `POST https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/audit` | `$0.010` | [`/sample`](https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/sample) |
| **Brazil Boleto & Tax Slip Parser** | FEBRABAN bank boletos (47/44 digits, post-Feb/2025 due-date reset), DARF/FGTS/IPTU slips (48 digits), 35+ banks, NF-e keys | `POST https://br-docs-parser-x402.architect-x402.workers.dev/parse` | `$0.008` | [`/sample`](https://br-docs-parser-x402.architect-x402.workers.dev/sample) |
| **Brazil Tax & Payroll Engine** | Simples Nacional (Anexos I–V + 28% Fator R optimization), progressive INSS/IRRF (Legal vs Simplified) + FGTS, B2B NFS-e withholdings | `POST https://br-tax-payroll-calc-x402.architect-x402.workers.dev/calc` | `$0.008` | [`/sample`](https://br-tax-payroll-calc-x402.architect-x402.workers.dev/sample) |
| **Brazil Business Intel & PIX** | Corporate CNPJ KYB dossier (QSA, Simples/MEI, risk score), IBGE Geo-CEP, CPF/CNPJ Mod-11 validator, PIX EMVCo CRC16 generator/decoder | `POST https://br-business-intel-x402.architect-x402.workers.dev/intel` | `$0.010` | [`/sample`](https://br-business-intel-x402.architect-x402.workers.dev/sample) |
| **Brazil BCB Financial Calculators** | Official Central Bank SGS monetary correction (IPCA, IGPM, INPC, SELIC, CDI), official PTAX FX (BRL/USD/EUR/GBP), Price/SAC amortization | `POST https://br-fin-calculators-x402.architect-x402.workers.dev/fin` | `$0.005` | [`/sample`](https://br-fin-calculators-x402.architect-x402.workers.dev/sample) |
| **Web Content Enrichment** | HTML-to-Markdown + structured JSON tables + JSON-LD extraction with token-savings metrics | `GET https://web-enrichment-x402.architect-x402.workers.dev/clean?url=<URL>&format=json` | `$0.002` | [`/sample`](https://web-enrichment-x402.architect-x402.workers.dev/sample) |
| **Agent Guard Firewall** | Hybrid prompt-injection detection (Llama Guard 3 8B + heuristics + Base64 decode) + Brazilian PII/secret masking | `POST https://agent-guard-x402.architect-x402.workers.dev/guard` | `$0.008` | [`/sample`](https://agent-guard-x402.architect-x402.workers.dev/sample) |

---

## Quick Integration

### Unified MCP Client (Claude Desktop, Cursor, VS Code)
```json
{
  "mcpServers": {
    "brazil-ai-suite": {
      "command": "npx",
      "args": ["-y", "github:brunopompeo1/brazil-ai-fiscal-apis-x402"],
      "env": {
        "X402_PRIVATE_KEY": "0xYOUR_BASE_WALLET_PRIVATE_KEY_OPTIONAL",
        "X402_MAX_USDC_PER_CALL": "0.05"
      }
    }
  }
}
```
- See [`examples/ai-connectors.json`](./examples/ai-connectors.json) for both unified `npx` and individual remote `/mcp` endpoints.
- **TypeScript / Node x402 Client:** [`examples/quickstart.ts`](./examples/quickstart.ts).
- **Python Discovery Script:** [`examples/quickstart.py`](./examples/quickstart.py).
