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
- **Como funciona:** Sem cadastro prévio e sem mensalidade. Pague apenas frações de centavo por requisição (`$0.002` a `$0.020` USDC).

### Opção B — Plano Mensal B2B com Chave de API (Pagamento via PIX / NF)
Se a sua empresa prefere faturamento em Reais (sem lidar com carteira digital ou USDC), disponibilizamos acesso via **API Key dedicada** com pacote mensal de requisições:

| Plano Sugerido | Volume Mensal (todas as APIs) | Investimento Mensal | Indicação |
| :--- | :--- | :--- | :--- |
| **Starter** | Até 10.000 requisições/mês | R$ 149/mês | Pequenos escritórios e agências n8n |
| **Pro Contábil** | Até 50.000 requisições/mês | R$ 490/mês | Escritórios médios, BPOs e SaaS em crescimento |
| **Enterprise / White-label** | Volume customizado + SLA | Sob consulta | ERPs, grandes redes contábeis e fintechs |

> **Como solicitar um teste piloto B2B:**  
> [Clique aqui para abrir uma solicitação `[PILOTO B2B]` no GitHub](https://github.com/brunopompeo1/brazil-ai-fiscal-apis-x402/issues/new?title=%5BPILOTO%20B2B%5D%20Solicita%C3%A7%C3%A3o%20de%20Acesso%20API) informando o volume estimado e quais APIs deseja testar.
