# Global + LATAM AI & x402 API Suite — 10 APIs Serverless para Agentes de IA (x402 + MCP)

> [English (README.en.md)](./README.en.md) | [Español (README.es.md)](./README.es.md) | [Gateway Unificado (api.brunopompeo.com.br)](https://api.brunopompeo.com.br) | [Guia B2B (PIX / API Key)](./docs/GUIA_EMPRESAS_B2B.md) | [Catálogo JSON](./catalog.json) | [llms.txt](./llms.txt)

Conjunto de **10 APIs serverless em produção** na borda Cloudflare (**10–30 ms na América Latina**), projetadas para **agentes autônomos de IA, fintechs, escritórios de contabilidade, ERPs e automações (n8n / LangChain / Make)**.

- **Gateway Unificado + 10 Subdomínios Próprios:** Acesse tudo em [`https://api.brunopompeo.com.br`](https://api.brunopompeo.com.br) ou diretamente em cada subdomínio dedicado (`*.brunopompeo.com.br`).
- **Liquidação nativa x402 v2 na rede Base (USDC):** Zero cadastro, zero assinatura mensal — compatível com **Coinbase CDP Facilitator** (e fallback automático PayAI), listada em **x402-list.com**, **402 Index**, **PayAPI Market**, **x402scan.com**, **Wafermap**, **Glama Connectors** e **Official MCP Registry**.
- **Servidor MCP Unificado em 1 comando:** Conecte todas as **10 ferramentas** no Claude Desktop, Cursor, VS Code ou Windsurf via `npx -y github:brunopompeo1/brazil-ai-fiscal-apis-x402`.
- **Amostra gratuita em cada API:** Chame `GET /sample` em qualquer serviço para inspecionar o payload real sem custo antes de pagar.

---

## Global High-Volume Agent Tools (3 APIs)

| Serviço | O que resolve na prática | Endpoint Pago (x402) | Preço (Base USDC) | Amostra Grátis |
| :--- | :--- | :--- | :--- | :--- |
| **1. Agent Guard Firewall** | Detecta prompt injection (Llama Guard 3 + heurística + Base64) e mascara dados sensíveis (CPF, CNPJ, chaves, e-mails) antes do LLM | `POST https://guard.brunopompeo.com.br/guard` | `$0.008` | [`/sample`](https://guard.brunopompeo.com.br/sample) |
| **2. Web Enrichment** | Converte qualquer página HTML pesada em Markdown limpo, tabelas JSON e JSON-LD com até 85% de economia de tokens | `GET https://web.brunopompeo.com.br/clean?url=https://example.com&format=json` | `$0.002` | [`/sample`](https://web.brunopompeo.com.br/sample) |
| **3. Agent Email** | Gateway transacional pay-per-call sem mensalidade SaaS: compila Markdown em HTML responsivo com modo `dryRun` | `POST https://email.brunopompeo.com.br/send` | `$0.005` | [`/sample`](https://email.brunopompeo.com.br/sample) |

## LATAM & Brazil Fintech / Fiscal Suite (7 APIs)

| Serviço | O que resolve na prática | Endpoint Pago (x402) | Preço (Base USDC) | Amostra Grátis |
| :--- | :--- | :--- | :--- | :--- |
| **4. LATAM Business & FX (NOVO v2.5)** | Valida e decodifica documentos fiscais/bancários de **7 países** (MX RFC/CURP/CLABE, AR CUIT/CUIL/CBU, CL RUT/RUN, CO NIT, PE RUC, UY RUT, BR CPF/CNPJ) em lote + **câmbio LATAM em tempo real** (`MXN/ARS/CLP/COP/PEN/UYU/BRL/USD/EUR`) | `POST https://latam.brunopompeo.com.br/latam` | `$0.008` | [`/sample`](https://latam.brunopompeo.com.br/sample) |
| **5. Auditor XML NF-e / NFC-e** | Comprime XML SEFAZ 4.00 (~90% menos tokens), confere matemática (`vProd`/`vNF`), CFOP, NCM, `cStat=100` e Reforma IBS/CBS | `POST https://nfe.brunopompeo.com.br/audit` | `$0.010` | [`/sample`](https://nfe.brunopompeo.com.br/sample) |
| **6. DANFSe Nacional & RTC 2026** | Gera DANFSe oficial da NFS-e Nacional e calcula tributos da Reforma Tributária (CBS, IBS e ISS — LC 214/2025) | `POST https://danfse.brunopompeo.com.br/generate` | `$0.005` | [`/sample`](https://danfse.brunopompeo.com.br/sample) |
| **7. Leitor de Boletos & Guias BR** | Valida e decodifica Boletos FEBRABAN (47/44 dígitos, fator pós-22/02/2025), guias DARF/FGTS/IPTU (48 dígitos) e chaves NF-e | `POST https://docs.brunopompeo.com.br/parse` | `$0.008` | [`/sample`](https://docs.brunopompeo.com.br/sample) |
| **8. Motor Tributário & Folha BR** | Calcula Simples Nacional (Anexos I–V + otimização Fator R 28%), INSS/IRRF + FGTS e retenções B2B de NFS-e | `POST https://tax.brunopompeo.com.br/calc` | `$0.008` | [`/sample`](https://tax.brunopompeo.com.br/sample) |
| **9. Business Intel CNPJ & PIX** | Dossiê completo de CNPJ (QSA, Simples/MEI, score de risco B2B), Geo-CEP IBGE, validador CPF/CNPJ e PIX EMVCo CRC16 | `POST https://intel.brunopompeo.com.br/intel` | `$0.010` | [`/sample`](https://intel.brunopompeo.com.br/sample) |
| **10. Calculadoras Banco Central** | Correção monetária oficial (IPCA, IGP-M, INPC, Selic, CDI via SGS), câmbio PTAX oficial (BRL/USD/EUR/GBP) e simulador Price/SAC | `POST https://fin.brunopompeo.com.br/fin` | `$0.005` | [`/sample`](https://fin.brunopompeo.com.br/sample) |

---

## Kit "Copie e Cole" para Produção (`examples/`)

- **n8n Workflow importável (Guard + Web + LATAM):** [`examples/n8n-workflow-x402-latam.json`](./examples/n8n-workflow-x402-latam.json)
- **LangChain / Vercel AI Tool pronta:** [`examples/langchain-x402.ts`](./examples/langchain-x402.ts)
- **Cliente TypeScript x402 minimalista (`fetch`):** [`examples/typescript-x402-client.ts`](./examples/typescript-x402-client.ts)
- **Cliente Python para Agentes:** [`examples/python-x402-client.py`](./examples/python-x402-client.py)
- **Execução real end-to-end:** `node examples/execute.mjs` (amostra gratuita) ou `node examples/execute.mjs --execute` (chamada paga real).

---

## Como usar agora mesmo

**Descobrir não executa uma ferramenta paga.** Sem credenciais, o conector inicia em `discovery_only`: lista todas as ferramentas, mas chamadas reais retornam `HTTP 402`. Configure localmente `X402_PRIVATE_KEY` (carteira com USDC na Base) ou `BRAZIL_AI_API_KEY` (plano B2B).

### 1. Servidor MCP Unificado (Claude Desktop, Cursor, VS Code, Windsurf)
Cole no seu `claude_desktop_config.json` ou `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "latam-brazil-ai-x402": {
      "command": "npx",
      "args": ["-y", "github:brunopompeo1/brazil-ai-fiscal-apis-x402"],
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
# Amostra gratuita da API LATAM (MX, AR, CL, CO, PE, UY, BR + FX)
curl -s https://latam.brunopompeo.com.br/sample

# Handshake x402 v2 no Gateway Unificado (retorna HTTP 402 com PAYMENT-REQUIRED)
curl -i -X POST https://api.brunopompeo.com.br/latam \
  -H "Content-Type: application/json" \
  -d '{"rfc":"XAXX010101000","cuit":"30-50001091-2","ruc":"20131312955","fx":{"amount":100,"from":"USD","to":["MXN","ARS","BRL"]}}'
```

### 3. Planos B2B para Empresas e Escritórios (PIX / API Key)
Prefere pagar mensalidade fixa em Reais via **PIX** com **API Key dedicada** (`X-API-Key`) sem carteira cripto? Confira [`docs/GUIA_EMPRESAS_B2B.md`](./docs/GUIA_EMPRESAS_B2B.md).

---

## Descoberta Automática para Agentes
- Gateway Hub: [`https://api.brunopompeo.com.br/llms.txt`](https://api.brunopompeo.com.br/llms.txt)
- OpenAPI 3.1: [`https://api.brunopompeo.com.br/openapi.json`](https://api.brunopompeo.com.br/openapi.json)
- Catálogo JSON: [`catalog.json`](./catalog.json) | [`https://api.brunopompeo.com.br/catalog.json`](https://api.brunopompeo.com.br/catalog.json)
