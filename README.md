# Suíte Brasil IA — APIs Fiscais, Contábeis, Financeiras e Segurança

> [English Documentation (README.en.md)](./README.en.md) | [Guia B2B para Empresas (PIX / API Key)](./docs/GUIA_EMPRESAS_B2B.md) | [Catálogo JSON](./catalog.json) | [llms.txt](./llms.txt)

Conjunto de **7 APIs serverless em produção** projetadas para **escritórios de contabilidade, BPOs financeiros, ERPs, fintechs, automações (n8n / Make) e agentes autônomos de IA**.

- **Latência de borda (Edge):** Respostas determinísticas em milissegundos + resumo executivo opcional por IA.
- **Pronta para IA e sistemas tradicionais:** Compatível com protocolo aberto **x402 (pay-per-use em USDC na rede Base)**, **Model Context Protocol (`/mcp`)** para assistentes de IA e **planos mensais B2B via PIX / API Key**.
- **Sem servidor para gerenciar:** Zero instalação local — basta apontar o seu sistema ou agente para as URLs abaixo.

---

## Catálogo de APIs em Produção (7 Serviços)

| Serviço | O que resolve na prática | Endpoint Principal | Preço por chamada (x402) |
| :--- | :--- | :--- | :--- |
| **1. Auditor XML NF-e / NFC-e** | Comprime XML SEFAZ 4.00 (~90% menos tokens), confere matemática (`vProd`/`vNF`), CFOP, NCM, `cStat=100` e decodifica chave de 44 dígitos | `POST https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/audit` | `$0.010 USDC` |
| **2. Leitor de Boletos & Guias BR** | Valida e decodifica Boletos FEBRABAN (47/44 dígitos, regra pós-22/02/2025), guias DARF/FGTS/IPTU (48 dígitos) e chaves NF-e | `POST https://br-docs-parser-x402.architect-x402.workers.dev/parse` | `$0.008 USDC` |
| **3. Motor Tributário & Folha BR** | Calcula Simples Nacional (Anexos I–V + otimização Fator R 28%), INSS/IRRF (Legal vs Simplificado) + FGTS e retenções B2B de NFS-e | `POST https://br-tax-payroll-calc-x402.architect-x402.workers.dev/calc` | `$0.008 USDC` |
| **4. Business Intel CNPJ & PIX** | Dossiê completo de CNPJ (QSA, Simples/MEI, score de risco B2B), Geo-CEP IBGE, validador CPF/CNPJ e gerador/leitor de PIX EMVCo CRC16 | `POST https://br-business-intel-x402.architect-x402.workers.dev/intel` | `$0.010 USDC` |
| **5. Calculadoras Banco Central** | Correção monetária oficial (IPCA, IGP-M, INPC, Selic, CDI via API SGS), câmbio PTAX oficial (BRL/USD/EUR/GBP) e simulador Price/SAC | `POST https://br-fin-calculators-x402.architect-x402.workers.dev/fin` | `$0.005 USDC` |
| **6. Limpeza Web para IA** | Converte qualquer página HTML pesada em Markdown limpo, tabelas JSON e JSON-LD com métrica de economia de tokens | `GET https://web-enrichment-x402.architect-x402.workers.dev/clean?url=https://example.com&format=json` | `$0.002 USDC` |
| **7. Firewall Anti-Prompt Injection** | Detecta injeção de prompt (Llama Guard 3 + heurística + Base64) e mascara dados sensíveis (CPF, CNPJ, chaves) antes de enviar ao modelo | `POST https://agent-guard-x402.architect-x402.workers.dev/guard` | `$0.020 USDC` |

---

## Como usar agora mesmo

### 1. Em Agentes de IA (Claude Desktop, Cursor, VS Code)
Cada API possui conector nativo no caminho `/mcp`. Copie a configuração pronta em [`examples/ai-connectors.json`](./examples/ai-connectors.json).

### 2. Em Sistemas, ERPs, Python ou TypeScript (Pay-per-use x402)
Todas as rotas retornam `HTTP 402` com o cabeçalho `PAYMENT-REQUIRED` detalhando o valor em USDC na rede **Base**:
- Veja o exemplo TypeScript em [`examples/quickstart.ts`](./examples/quickstart.ts)
- Veja o exemplo Python de descoberta em [`examples/quickstart.py`](./examples/quickstart.py)

Teste rápido via terminal (`curl`) para ver o contrato de resposta 402 e os metadados de qualquer serviço:
```bash
curl -s https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/.well-known/x402
```

### 3. Contratação B2B para Empresas e Escritórios (PIX / Mensalidade)
Quer integrar no seu ERP, sistema contábil ou fluxo n8n pagando mensalidade fixa em Reais via **PIX** com **API Key dedicada** (sem precisar usar carteira cripto)?

👉 Confira os planos e peça um piloto em [`docs/GUIA_EMPRESAS_B2B.md`](./docs/GUIA_EMPRESAS_B2B.md).

---

## Descoberta Automática para IAs
- Catálogo completo: [`catalog.json`](./catalog.json)
- Índice `llms.txt`: [`llms.txt`](./llms.txt)
- Cada serviço também expõe `/llms.txt` e `/.well-known/x402` individualmente.
