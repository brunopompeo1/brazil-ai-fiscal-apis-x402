# Guia de Contratação B2B — Escritórios de Contabilidade, ERPs e Automações

Todas as APIs deste repositório rodam em infraestrutura global de baixa latência (Cloudflare Edge + Workers AI), sem filas ou servidores lentos, prontas para integrar via **HTTP REST**, **n8n / Make** ou **conectores de IA**.

---

## Para quem é este pacote?

1. **Escritórios de Contabilidade e BPO Financeiro**
   - Conferência automática de XMLs de NF-e/NFC-e recebidos por e-mail/WhatsApp (economia de ~90% em tokens ao enviar para IAs + validação matemática de `vProd`/`vNF`, CFOP, NCM e `cStat=100`).
   - Leitura e auditoria automática de boletos FEBRABAN (com regra pós-22/02/2025) e guias DARF/FGTS/IPTU.
   - Simulação instantânea de Simples Nacional com **otimização automática de Fator R (28%)**, folha INSS/IRRF e retenções de NFS-e (IRRF 1,5%, CSRF 4,65%, ISS, INSS).
2. **Sistemas ERP, Fintechs e Software Houses**
   - Enriquecimento completo de CNPJ (QSA, CNAE, Simples/MEI, score de risco B2B) e Geo-CEP IBGE.
   - Geração e decodificação determinística de **PIX Copia e Cola (EMVCo + CRC16-CCITT)**.
   - Correção monetária oficial integrada ao **Banco Central (IPCA, IGP-M, INPC, Selic, CDI)** e câmbio **PTAX oficial**.
3. **Agências de Automação (n8n / Make) e Bots Corporativos**
   - Firewall anti-Prompt Injection e mascaramento automático de CPF/CNPJ/segredos antes de enviar textos para LLMs.
   - Limpeza de páginas web HTML para Markdown e tabelas JSON.

---

## Modelos de Contratação

### Opção A — Pagamento Automático por Uso (`x402` em USDC na rede Base)
- **Ideal para:** Agentes autônomos, scripts independentes e uso sob demanda.
- **Como funciona:** Sem cadastro prévio e sem mensalidade. Pague apenas frações de centavo por requisição (`$0.002` a `$0.010` USDC).

### Opção B — Plano Mensal B2B com Chave de API (Pagamento via PIX / NF)
Se a sua empresa prefere faturamento em Reais (sem lidar com carteira digital ou USDC), todas as **7 APIs** já aceitam autenticação nativa via **`X-API-Key`** (ou `Authorization: Bearer bai_...`) com controle mensal automático de cota:

| Plano Sugerido | Volume Mensal (todas as APIs) | Investimento Mensal | Indicação |
| :--- | :--- | :--- | :--- |
| **Piloto B2B (7 dias)** | Até 500 requisições | Gratuito (teste) | Validação em n8n, ERP ou escritório |
| **Starter** | Até 10.000 requisições/mês | R$ 149/mês | Pequenos escritórios e agências n8n |
| **Pro Contábil** | Até 50.000 requisições/mês | R$ 490/mês | Escritórios médios, BPOs e SaaS em crescimento |
| **Enterprise / White-label** | Volume customizado + SLA | Sob consulta | ERPs, grandes redes contábeis e fintechs |

---

## Como integrar com `X-API-Key` (n8n, ERP, cURL)

Envie o cabeçalho `X-API-Key` em qualquer uma das 7 APIs da suíte:

```bash
# Exemplo: Cálculo de Simples Nacional + Fator R
curl -s -X POST https://br-tax-payroll-calc-x402.architect-x402.workers.dev/calc \
  -H "Content-Type: application/json" \
  -H "X-API-Key: bai_live_SUA_CHAVE_AQUI" \
  -d '{"simples":{"rbt12":480000,"monthlyRevenue":45000,"anexo":"auto","payroll12m":145000}}'
```

- **Cabeçalhos retornados em toda resposta:** `X-Auth-Mode: b2b-api-key`, `X-Plan-Tier`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-Billing-Month`.
- **Consultar cota restante gratuitamente (sem consumir requisição):**
  ```bash
  curl -s https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/usage \
    -H "X-API-Key: bai_live_SUA_CHAVE_AQUI"
  ```
- **Erros de validação (`400` / `405`) não consomem sua cota mensal.**

### Template pronto para n8n

Para não começar do zero, importe o fluxo já configurado com as 7 APIs (um nó por serviço, com payload de exemplo):

1. Baixe [`examples/brazil-ai-suite-n8n-template.json`](../examples/brazil-ai-suite-n8n-template.json).
2. No n8n, vá em **Workflows → Import from File** e selecione o arquivo.
3. Crie uma credencial **Header Auth** chamada `Brazil AI Suite — X-API-Key` (Name: `X-API-Key`, Value: sua chave `bai_live_...`) e vincule aos 7 nós.
4. Execute o workflow manualmente para validar a resposta de cada API antes de plugar no seu fluxo real (ERP, WhatsApp, e-mail, etc).

> **Como solicitar um teste piloto B2B ou contratar via PIX:**  
> [Clique aqui para abrir uma solicitação `[PILOTO B2B]` no GitHub](https://github.com/brunopompeo1/brazil-ai-fiscal-apis-x402/issues/new?title=%5BPILOTO%20B2B%5D%20Solicita%C3%A7%C3%A3o%20de%20Acesso%20API) informando o volume estimado e quais APIs deseja testar.
