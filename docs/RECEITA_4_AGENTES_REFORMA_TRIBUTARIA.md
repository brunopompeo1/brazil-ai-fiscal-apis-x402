# Receita Pronta: 4 Agentes Autônomos da Reforma Tributária (LC 214/2025) — Sem Servidor Java

> **Zero Java 21 · Zero Spring Boot · Zero Docker · Sub-10ms no Cloudflare Edge**  
> Base oficial embarcada diretamente dos repositórios MIT da Receita Federal do Brasil (**Base V0073 — IT 2025.002 v.1.71**, Portaria Cotec nº 342):  
> - `ReceitaFederal/calculadora-rtc-regime-regular` (170 `cClassTrib` ativos, 450 prefixos NCM, 89 prefixos NBS)  
> - `ReceitaFederal/calculadora-rtc-simples-nacional` (15 atividades oficiais + Anexos I–V + Fator R)  
> - `ReceitaFederal/calculadora-rtc-gerador-danfse` (DANFSe padrão NFS-e Nacional)

---

## Como funciona o pagamento (zero cadastro)

Todas as APIs abaixo aceitam:
1. **x402 v2 (USDC na rede Base `eip155:8453`)** — pay-per-call sem conta nem cartão (`$0.005` a `$0.010` por chamada).
2. **Chave B2B mensal (PIX)** — cabeçalho `X-API-Key: bai_...`.
3. **Endpoints gratuitos de descoberta e teste**:
   - `GET https://danfse.brunopompeo.com.br/tables` (tabela oficial RFB V0073, setores e curva 2026–2033)
   - `GET https://danfse.brunopompeo.com.br/sample` (exemplos vivos de Construção 50%, Saúde 60%, Cesta Básica 100%, Simples Nacional)
   - `GET https://nfe.brunopompeo.com.br/sample` (exemplo vivo de Auditoria de Crédito CBS/IBS + `supplierAlert`)

---

## Agente 1 — Compras (Auditoria de Crédito CBS/IBS + Cobrança Automática ao Fornecedor)

**Problema real:** Na Reforma Tributária (LC 214/2025), se o fornecedor emitir NF-e sem o grupo `<IBSCBS>` ou com alíquota incorreta, sua empresa **perde o crédito tributário em dinheiro**.

**Fluxo (2 APIs — custo total `$0.015 USDC`):**
1. **`POST https://nfe.brunopompeo.com.br/audit`** (`$0.010 USDC`): envia o XML da NF-e recebida.
2. O retorno traz `rtcCreditAudit` (severidade `missing_credit_highlight` / `understated_credit` / `overcharged_tax`, valor exato em R$ em risco no ano atual + projeção 2027/2033) e o objeto pronto **`supplierAlert.emailDraft`**.
3. Se `supplierAlert.actionRequired === true`, o agente encaminha `emailDraft` para **`POST https://email.brunopompeo.com.br/send`** (`$0.005 USDC`).

### Payload Copy-Paste (Etapa 1 — Auditar XML)
```json
POST https://nfe.brunopompeo.com.br/audit
{
  "xml": "<nfeProc>...</nfeProc>",
  "referenceYear": 2027,
  "buyerRegime": "regime_regular",
  "supplierEmail": "fiscal@fornecedor.com.br"
}
```

### Encadeamento automático (Etapa 2 — Cobrar Fornecedor)
```json
POST https://email.brunopompeo.com.br/send
{
  "to": "fiscal@fornecedor.com.br",
  "subject": "{{supplierAlert.emailDraft.subject}}",
  "text": "{{supplierAlert.emailDraft.bodyText}}",
  "dryRun": false
}
```

---

## Agente 2 — Medição & Construção Civil (Redução Legal 50% — Art. 261 LC 214/2025)

**Problema real:** Em medições de obra e incorporação imobiliária, aplicar alíquota cheia por engano custa **50% a mais de CBS/IBS** (ou **70%** em locação de imóveis).

**Fluxo (1 API — custo `$0.005 USDC`):**
- **`POST https://danfse.brunopompeo.com.br/calculate`** (JSON enxuto sem HTML) ou **`POST /generate`** (com HTML oficial do DANFSe).
- Basta informar `setor: "construcao_civil"` (ou `cClassTrib: "200046"` ou `codigoTributacaoNacional: "07.02.01"`).

### Payload Copy-Paste
```json
POST https://danfse.brunopompeo.com.br/calculate
{
  "ano": 2027,
  "setor": "construcao_civil",
  "regime": "regime_regular",
  "valorServico": 100000.00,
  "discriminacao": "Medição de obra civil comercial — Etapa 03"
}
```

### Resultado determinístico (Base RFB V0073)
- `cClassTrib`: `200046` (`CST 200` — `LC 214/2025 — Art. 261`)
- CBS efetiva: `8.80% -> 4.40%` (`R$ 4.400,00`) | IBS efetivo: `0.10% -> 0.05%` (`R$ 50,00`)
- **Economia legal documentada:** `R$ 4.450,00` + grupo oficial `ibscbsOfficialGroup` pronto para ERP/NFS-e!

---

## Agente 3 — Frota & Combustíveis (Auditoria em Lote `xmls[]` + Monofasia Art. 172)

**Problema real:** Frotas recebem dezenas de NF-es misturando **combustíveis monofásicos** (diesel/gasolina — CST 620, Art. 172) com **peças, pneus e manutenção** (tributação integral com direito a crédito CBS/IBS).

**Fluxo (1 chamada em lote até 25 XMLs — custo `$0.010 USDC` no total):**
- **`POST https://nfe.brunopompeo.com.br/audit`** enviando `xmls: [xml1, xml2, ...]` ou `items: [...]` direto do ERP/planilha.
- A API separa automaticamente combustíveis monofásicos (`NCM 27101921` -> `cClassTrib 620001 / CST 620`) de peças/pneus sem destaque de crédito (`NCM 40112090` -> `missing_credit_highlight`), agregando `batchSummary` e `supplierAlerts[]`.

### Payload Copy-Paste (Lote de Frota)
```json
POST https://nfe.brunopompeo.com.br/audit
{
  "referenceYear": 2027,
  "items": [
    { "descricao": "Óleo Diesel S10", "ncm": "27101921", "valor": 15000, "vCBS": 0, "vIBS": 0 },
    { "descricao": "Pneu Radial 295/80R22.5", "ncm": "40112090", "valor": 24000, "vCBS": 0, "vIBS": 0 }
  ],
  "supplierEmail": "faturamento@autopecas-frota.com.br"
}
```

---

## Agente 4 — Faturamento Ponta a Ponta (XML → DANFSe RTC Oficial → E-mail ao Cliente)

**Problema real:** Automatizar emissão de espelho DANFSe já com a memória oficial da Reforma Tributária e disparar para o financeiro do tomador sem intervenção humana.

**Fluxo (2 APIs — custo total `$0.010 USDC`):**
1. **`POST https://danfse.brunopompeo.com.br/generate`** (`$0.005 USDC`): envia o XML bruto da NFS-e (ou JSON estruturado com `setor`/`cClassTrib`/`regime`). Recebe `danfse.html` + `rtcCalculation` + `ibscbsOfficialGroup`.
2. **`POST https://email.brunopompeo.com.br/send`** (`$0.005 USDC`): envia o resumo + DANFSe em HTML diretamente para o e-mail do cliente.

### Executar o script pronto de demonstração
```bash
node examples/rtc-4-agents-workflow.mjs
```
(Por padrão roda em modo gratuito de inspeção `/tables` + `/sample`; com `B2B_API_KEY` ou carteira x402 executa os 4 agentes ao vivo!)
