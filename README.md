# Suíte Brasil IA — APIs Fiscais, Contábeis, Financeiras e Segurança

> [English Documentation (README.en.md)](./README.en.md) | [Guia B2B para Empresas (PIX / API Key)](./docs/GUIA_EMPRESAS_B2B.md) | [Catálogo JSON](./catalog.json) | [llms.txt](./llms.txt)

Conjunto de **7 APIs serverless em produção** na Cloudflare Edge projetadas para **escritórios de contabilidade, BPOs financeiros, ERPs, fintechs, automações (n8n / Make) e agentes autônomos de IA**.

- **Indexadas oficialmente:** Compatíveis com **x402scan.com** (`GET /openapi.json` OpenAPI 3.1.0) e **PayAI Bazaar** (`eip155:8453` / Base Mainnet USDC).
- **Conector MCP Unificado em 1 comando:** Conecte todas as 7 ferramentas de uma vez no Claude Desktop, Cursor, VS Code ou Windsurf via `npx -y github:brunopompeo1/brazil-ai-fiscal-apis-x402`.
- **Amostra gratuita em cada API:** Chame `GET /sample` em qualquer serviço para inspecionar o payload real sem custo antes de pagar.

---

## Catálogo de APIs em Produção (7 Serviços)

| Serviço | O que resolve na prática | Endpoint Pago (x402) | Preço (Base USDC) | Amostra Grátis |
| :--- | :--- | :--- | :--- | :--- |
| **1. Auditor XML NF-e / NFC-e** | Comprime XML SEFAZ 4.00 (~90% menos tokens), confere matemática (`vProd`/`vNF`), CFOP, NCM, `cStat=100` e decodifica chave de 44 dígitos | `POST https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/audit` | `$0.010` | [`/sample`](https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/sample) |
| **2. Leitor de Boletos & Guias BR** | Valida e decodifica Boletos FEBRABAN (47/44 dígitos, regra pós-22/02/2025), guias DARF/FGTS/IPTU (48 dígitos) e chaves NF-e | `POST https://br-docs-parser-x402.architect-x402.workers.dev/parse` | `$0.008` | [`/sample`](https://br-docs-parser-x402.architect-x402.workers.dev/sample) |
| **3. Motor Tributário & Folha BR** | Calcula Simples Nacional (Anexos I–V + otimização Fator R 28%), INSS/IRRF (Legal vs Simplificado) + FGTS e retenções B2B de NFS-e | `POST https://br-tax-payroll-calc-x402.architect-x402.workers.dev/calc` | `$0.008` | [`/sample`](https://br-tax-payroll-calc-x402.architect-x402.workers.dev/sample) |
| **4. Business Intel CNPJ & PIX** | Dossiê completo de CNPJ (QSA, Simples/MEI, score de risco B2B), Geo-CEP IBGE, validador CPF/CNPJ e gerador/leitor de PIX EMVCo CRC16 | `POST https://br-business-intel-x402.architect-x402.workers.dev/intel` | `$0.010` | [`/sample`](https://br-business-intel-x402.architect-x402.workers.dev/sample) |
| **5. Calculadoras Banco Central** | Correção monetária oficial (IPCA, IGP-M, INPC, Selic, CDI via API SGS), câmbio PTAX oficial (BRL/USD/EUR/GBP) e simulador Price/SAC | `POST https://br-fin-calculators-x402.architect-x402.workers.dev/fin` | `$0.005` | [`/sample`](https://br-fin-calculators-x402.architect-x402.workers.dev/sample) |
| **6. Limpeza Web para IA** | Converte qualquer página HTML pesada em Markdown limpo, tabelas JSON e JSON-LD com métrica de economia de tokens | `GET https://web-enrichment-x402.architect-x402.workers.dev/clean?url=https://example.com&format=json` | `$0.002` | [`/sample`](https://web-enrichment-x402.architect-x402.workers.dev/sample) |
| **7. Firewall Anti-Prompt Injection** | Detecta injeção de prompt (Llama Guard 3 + heurística + Base64) e mascara dados sensíveis (CPF, CNPJ, chaves) antes de enviar ao modelo | `POST https://agent-guard-x402.architect-x402.workers.dev/guard` | `$0.008` | [`/sample`](https://agent-guard-x402.architect-x402.workers.dev/sample) |

---

## Como usar agora mesmo

**Descobrir não executa uma ferramenta paga.** Sem credenciais, o conector inicia em `discovery_only`: lista ferramentas, mas chamadas reais retornam cobrança. Configure localmente `X402_PRIVATE_KEY` com uma carteira com USDC na Base, ou `BRAZIL_AI_API_KEY` com uma chave B2B válida. Não compartilhe credenciais em mensagens.

Após instalar as dependências do repositório, teste a amostra gratuita com `node examples/execute.mjs`. Para executar uma chamada real de limpeza web, use `node examples/execute.mjs --execute`: custa 0,002 USDC com carteira, ou consome uma chamada da cota B2B. O exemplo usa o mesmo cliente de pagamento do conector e devolve erro se a execução falhar.

Os endereços remotos `/mcp` também exigem um cliente que trate a cobrança x402 ou envie `X-API-Key`; adicionar apenas a URL não configura pagamento automático. Os exemplos `quickstart.ts` e `quickstart.py` inspecionam a cobrança, sem liquidar pagamentos.

### 1. Servidor MCP Unificado (Claude Desktop, Cursor, VS Code, Windsurf)
Cole no seu `claude_desktop_config.json` ou `.cursor/mcp.json` (ver [`examples/ai-connectors.json`](./examples/ai-connectors.json)):

```json
{
  "mcpServers": {
    "brazil-ai-suite": {
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

- Com `X402_PRIVATE_KEY` configurada (carteira com USDC na Base), os micropagamentos x402 ocorrem automaticamente via `@x402/fetch`.
- Sem carteira configurada, todas as ferramentas continuam visíveis e retornam os requisitos exatos HTTP `402` sem quebrar o agente (além da ferramenta gratuita `brazil_ai_suite_status`).

### 2. Em Sistemas, ERPs, Python ou TypeScript (Pay-per-use x402)
Todas as rotas pagas retornam `HTTP 402` com o cabeçalho `PAYMENT-REQUIRED` detalhando o valor em USDC na rede **Base**:
- Exemplo TypeScript: [`examples/quickstart.ts`](./examples/quickstart.ts)
- Exemplo Python: [`examples/quickstart.py`](./examples/quickstart.py)

Teste rápido via terminal (`curl`) para ver o contrato OpenAPI 3.1 ou a amostra gratuita:
```bash
curl -s https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/sample
curl -s https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/openapi.json
```

### 3. Contratação B2B para Empresas e Escritórios (PIX / Mensalidade)
Quer integrar no seu ERP, sistema contábil ou fluxo n8n pagando mensalidade fixa em Reais via **PIX** com **API Key dedicada** (sem precisar usar carteira cripto)?

Confira os planos e peça um piloto em [`docs/GUIA_EMPRESAS_B2B.md`](./docs/GUIA_EMPRESAS_B2B.md).

---

## Descoberta Automática para IAs
- Catálogo completo: [`catalog.json`](./catalog.json)
- Índice `llms.txt`: [`llms.txt`](./llms.txt)
- Cada serviço expõe individualmente `GET /openapi.json`, `GET /sample`, `GET /llms.txt`, `GET /.well-known/x402` e `POST /mcp`.
