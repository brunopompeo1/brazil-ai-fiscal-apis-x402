# Global + LATAM AI & x402 API Suite — 12 APIs Serverless para Agentes de IA (x402 + MCP)

[![brunopompeo1/brazil-ai-fiscal-apis-x402 MCP server](https://glama.ai/mcp/servers/brunopompeo1/brazil-ai-fiscal-apis-x402/badges/score.svg)](https://glama.ai/mcp/servers/brunopompeo1/brazil-ai-fiscal-apis-x402)

> **v2.7.1 — Metadados MCP para agentes:** todos os servidores `/mcp` negociam o protocolo 2024-11-05, 2025-03-26 ou 2025-06-18 e listam ferramentas com `title`, `annotations` e `outputSchema`; nome de ferramenta inválido devolve erro JSON-RPC -32602 em vez de cair numa rota paga. Preços, rotas e contrato x402 v2 inalterados.
>
> **Novidade v2.7.0 — 2 Novas APIs Globais de DeFi & Infra (`$0.015 USDC`):** [`defi.brunopompeo.com.br`](https://defi.brunopompeo.com.br/sample) (simulação real Honeypot.is V2 + GoPlus + liquidez DexScreener + divergência de oráculo DefiLlama em 7 redes EVM + risco/saldos de carteiras `/wallet`) e [`pulse.brunopompeo.com.br`](https://pulse.brunopompeo.com.br/sample) (funding ao vivo em ~180 mercados perpétuos Hyperliquid + radar de squeeze `/funding` + radar de instabilidade de 10 provedores críticos de IA/Cripto & RPC Base `/infra`). Preços das 10 APIs originais 100% preservados.

> [English (README.en.md)](./README.en.md) | [Español (README.es.md)](./README.es.md) | [Gateway Unificado (api.brunopompeo.com.br)](https://api.brunopompeo.com.br) | [Guia B2B (PIX / API Key)](./docs/GUIA_EMPRESAS_B2B.md) | [Catálogo JSON](./catalog.json) | [llms.txt](./llms.txt)

Conjunto de **12 APIs serverless em produção** na borda Cloudflare (**10–30 ms na América Latina**), projetadas para **agentes autônomos de IA, bots DeFi/cripto, fintechs, escritórios de contabilidade, ERPs e automações (n8n / LangChain / Make)**.

- **Gateway Unificado + 12 Subdomínios Próprios:** Acesse tudo em [`https://api.brunopompeo.com.br`](https://api.brunopompeo.com.br) ou diretamente em cada subdomínio dedicado (`*.brunopompeo.com.br`).
- **Liquidação nativa x402 v2 na rede Base (USDC):** Zero cadastro, zero assinatura mensal — compatível com **Coinbase CDP Facilitator** (e fallback automático PayAI), listada em **x402-list.com**, **402 Index**, **PayAPI Market**, **x402scan.com**, **Wafermap**, **Glama Connectors** e **Official MCP Registry**.
- **Servidor MCP Unificado em 1 comando:** Conecte todas as **14 ferramentas pagas + 1 gratuita** no Claude Desktop, Cursor, VS Code ou Windsurf via `npx -y @brunopompeo/brazil-ai-x402-mcp` (ou `npx -y github:brunopompeo1/brazil-ai-fiscal-apis-x402`).
- **Amostra gratuita em cada API:** Chame `GET /sample` em qualquer serviço para inspecionar o payload real sem custo antes de pagar.

---

## Global High-Volume Agent & DeFi Tools (5 APIs)

| Serviço | O que resolve na prática | Endpoint Pago (x402) | Preço (Base USDC) | Amostra Grátis |
| :--- | :--- | :--- | :--- | :--- |
| **1. Base & EVM DeFi Shield (NOVO v2.7)** | Escudo pré-trade para tokens em 7 redes EVM (simulação Honeypot.is V2 + GoPlus + liquidez DexScreener + divergência de oráculo DefiLlama `pass`/`warn`/`fail` + `safetyScore`) e auditoria de risco + saldos Base ETH/USDC de carteiras (`/wallet`) | `POST/GET https://defi.brunopompeo.com.br/check` & `/wallet` | `$0.015` | [`/sample`](https://defi.brunopompeo.com.br/sample) |
| **2. Crypto Perp & Infra Pulse (NOVO v2.7)** | Taxas de funding perpétuo ao vivo em ~180 mercados Hyperliquid (1h/8h/APR %, basis, OI USD, radar de squeeze) + radar de instabilidade/incidentes em 10 provedores críticos de IA & Cripto + saúde RPC da Base (`/infra`) | `POST/GET https://pulse.brunopompeo.com.br/funding` & `/infra` | `$0.015` | [`/sample`](https://pulse.brunopompeo.com.br/sample) |
| **3. Agent Guard Firewall** | Detecta prompt injection (Llama Guard 3 + heurística + Base64) e mascara dados sensíveis (CPF, CNPJ, chaves, e-mails) antes do LLM | `POST https://guard.brunopompeo.com.br/guard` | `$0.008` | [`/sample`](https://guard.brunopompeo.com.br/sample) |
| **4. Web Enrichment** | Converte qualquer página HTML pesada em Markdown limpo, tabelas JSON e JSON-LD com até 85% de economia de tokens | `GET https://web.brunopompeo.com.br/clean?url=https://example.com&format=json` | `$0.002` | [`/sample`](https://web.brunopompeo.com.br/sample) |
| **5. Agent Email** | Gateway transacional pay-per-call sem mensalidade SaaS: compila Markdown em HTML responsivo com modo `dryRun` | `POST https://email.brunopompeo.com.br/send` | `$0.005` | [`/sample`](https://email.brunopompeo.com.br/sample) |

## LATAM & Brazil Fintech / Fiscal Suite (7 APIs)

| Serviço | O que resolve na prática | Endpoint Pago (x402) | Preço (Base USDC) | Amostra Grátis |
| :--- | :--- | :--- | :--- | :--- |
| **6. LATAM Business & FX (v2.5)** | Valida e decodifica documentos fiscais/bancários de **7 países** (MX RFC/CURP/CLABE, AR CUIT/CUIL/CBU, CL RUT/RUN, CO NIT, PE RUC, UY RUT, BR CPF/CNPJ) em lote + **câmbio LATAM em tempo real** (`MXN/ARS/CLP/COP/PEN/UYU/BRL/USD/EUR`) | `POST https://latam.brunopompeo.com.br/latam` | `$0.008` | [`/sample`](https://latam.brunopompeo.com.br/sample) |
| **7. Auditor XML NF-e & Crédito CBS/IBS (v2.6)** | Comprime XML SEFAZ 4.00 (~90% menos tokens), audita **crédito tributário CBS/IBS (Compras & Frota, lote `xmls[]` até 25)** na Base RFB V0073, calcula R$ em risco e gera `supplierAlert` pronto para cobrar o fornecedor | `POST https://nfe.brunopompeo.com.br/audit` | `$0.010` | [`/sample`](https://nfe.brunopompeo.com.br/sample) |
| **8. Calculadora RTC Oficial RFB (V0073) & DANFSe (v2.6)** | **Sem servidor Java 21/Spring Boot:** 170 `cClassTrib` oficiais, reduções automáticas (Construção 50%, Saúde/Educação 60%, Cesta Básica 100%), Simples Nacional, transição 2026–2033 e DANFSe | `POST https://danfse.brunopompeo.com.br/generate` | `$0.005` | [`/sample`](https://danfse.brunopompeo.com.br/sample) / [`/tables`](https://danfse.brunopompeo.com.br/tables) |
| **9. Leitor de Boletos & Guias BR** | Valida e decodifica Boletos FEBRABAN (47/44 dígitos, fator pós-22/02/2025), guias DARF/FGTS/IPTU (48 dígitos) e chaves NF-e | `POST https://docs.brunopompeo.com.br/parse` | `$0.008` | [`/sample`](https://docs.brunopompeo.com.br/sample) |
| **10. Motor Tributário & Folha BR** | Calcula Simples Nacional (Anexos I–V + otimização Fator R 28%), INSS/IRRF + FGTS e retenções B2B de NFS-e | `POST https://tax.brunopompeo.com.br/calc` | `$0.008` | [`/sample`](https://tax.brunopompeo.com.br/sample) |
| **11. Business Intel CNPJ & PIX** | Dossiê completo de CNPJ (QSA, Simples/MEI, score de risco B2B), Geo-CEP IBGE, validador CPF/CNPJ e PIX EMVCo CRC16 | `POST https://intel.brunopompeo.com.br/intel` | `$0.010` | [`/sample`](https://intel.brunopompeo.com.br/sample) |
| **12. Calculadoras Banco Central** | Correção monetária oficial (IPCA, IGP-M, INPC, Selic, CDI via SGS), câmbio PTAX oficial (BRL/USD/EUR/GBP) e simulador Price/SAC | `POST https://fin.brunopompeo.com.br/fin` | `$0.005` | [`/sample`](https://fin.brunopompeo.com.br/sample) |

---

## Receita Pronta: 4 Agentes da Reforma Tributária (Zero Servidor Java)

- **Guia Copy-Paste Completo (Compras, Medição/Construção 50%, Frota em Lote e Faturamento XML→DANFSe→E-mail):** [`docs/RECEITA_4_AGENTES_REFORMA_TRIBUTARIA.md`](./docs/RECEITA_4_AGENTES_REFORMA_TRIBUTARIA.md)
- **Script Executável:** `node examples/rtc-4-agents-workflow.mjs` (funciona grátis via `/tables` e `/sample`, ou ao vivo com `B2B_API_KEY` / x402)

---

## Kit "Copie e Cole" para Produção (`examples/`)

- **n8n Workflow importável (Guard + Web + LATAM):** [`examples/n8n-workflow-x402-latam.json`](./examples/n8n-workflow-x402-latam.json)
- **LangChain / Vercel AI Tool pronta:** [`examples/langchain-x402.ts`](./examples/langchain-x402.ts)
- **Cliente TypeScript x402 minimalista (`fetch`):** [`examples/typescript-x402-client.ts`](./examples/typescript-x402-client.ts)
- **Cliente Python para Agentes:** [`examples/python-x402-client.py`](./examples/python-x402-client.py)
- **Execução real end-to-end:** `node examples/execute.mjs` (amostra gratuita) ou `node examples/execute.mjs --execute` (chamada paga real).

---

## Como usar agora mesmo

**Descobrir não executa uma ferramenta paga.** Sem credenciais, o conector inicia em `discovery_only`: lista todas as 15 ferramentas (14 pagas + 1 gratuita), mas chamadas reais retornam `HTTP 402`. Configure localmente `X402_PRIVATE_KEY` (carteira com USDC na Base) ou `BRAZIL_AI_API_KEY` (plano B2B).

### 1. Servidor MCP Unificado (Claude Desktop, Cursor, VS Code, Windsurf)
Cole no seu `claude_desktop_config.json` ou `.cursor/mcp.json`:

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

### 2. Teste rápido via `curl`
```bash
# Amostra gratuita do Base DeFi Pre-Trade Shield & Hyperliquid Perp Pulse
curl -s https://defi.brunopompeo.com.br/sample
curl -s https://pulse.brunopompeo.com.br/sample

# Handshake x402 v2 no Gateway Unificado (retorna HTTP 402 com PAYMENT-REQUIRED)
curl -i -X POST https://api.brunopompeo.com.br/check \
  -H "Content-Type: application/json" \
  -d '{"address":"WETH","chain":"base"}'
```

### 3. Planos B2B para Empresas e Escritórios (PIX / API Key)
Prefere pagar mensalidade fixa em Reais via **PIX** com **API Key dedicada** (`X-API-Key`) sem carteira cripto? Confira [`docs/GUIA_EMPRESAS_B2B.md`](./docs/GUIA_EMPRESAS_B2B.md).

---

## Descoberta Automática para Agentes
- Gateway Hub: [`https://api.brunopompeo.com.br/llms.txt`](https://api.brunopompeo.com.br/llms.txt)
- OpenAPI 3.1: [`https://api.brunopompeo.com.br/openapi.json`](https://api.brunopompeo.com.br/openapi.json)
- Catálogo JSON: [`catalog.json`](./catalog.json) | [`https://api.brunopompeo.com.br/catalog.json`](https://api.brunopompeo.com.br/catalog.json)
