# Suite Global + LATAM de APIs IA & x402 — 12 Microservicios Serverless (x402 v2 + MCP)

[![brunopompeo1/brazil-ai-fiscal-apis-x402 MCP server](https://glama.ai/mcp/servers/brunopompeo1/brazil-ai-fiscal-apis-x402/badges/score.svg)](https://glama.ai/mcp/servers/brunopompeo1/brazil-ai-fiscal-apis-x402) [![M8ven Score](https://m8ven.ai/badge/mcp/brunopompeo1-brazil-ai-fiscal-apis-x402-d3qc12?v=4f123adbca91a34da5bbfc1d8d5f70e2)](https://m8ven.ai/mcp/brunopompeo1-brazil-ai-fiscal-apis-x402-d3qc12?s=readme)


> **v2.7.1 — Metadatos MCP para agentes:** todos los servidores `/mcp` negocian el protocolo 2024-11-05, 2025-03-26 o 2025-06-18 y listan herramientas con `title`, `annotations` y `outputSchema`; un nombre de herramienta inválido devuelve el error JSON-RPC -32602 en lugar de llegar a una ruta de pago. Precios, rutas y contrato x402 v2 sin cambios.
>
> **Novedad v2.7.0 — 2 Nuevas APIs Globales de DeFi e Infraestructura (`$0.015 USDC`):** [`defi.brunopompeo.com.br`](https://defi.brunopompeo.com.br/sample) (simulación real Honeypot.is V2 + GoPlus + liquidez DexScreener + divergencia de oráculo DefiLlama en 7 redes EVM + riesgo y saldos Base ETH/USDC de wallets `/wallet`) y [`pulse.brunopompeo.com.br`](https://pulse.brunopompeo.com.br/sample) (tasas de funding en vivo en ~180 mercados perpetuos Hyperliquid + radar de squeeze `/funding` + radar de caídas en 10 proveedores críticos de IA/Cripto y RPC Base `/infra`). Los precios de las 10 APIs originales permanecen intactos.
>
> **Incluido desde v2.6.0 — Reforma Tributaria Oficial de Brasil (LC 214/2025, Base RFB V0073) sin servidor Java:** [`danfse.brunopompeo.com.br`](https://danfse.brunopompeo.com.br/tables) incorpora los 170 códigos oficiales `cClassTrib`, reducciones legales, Simples Nacional y transición 2026–2033; [`nfe.brunopompeo.com.br`](https://nfe.brunopompeo.com.br/sample) audita créditos CBS/IBS en BRL (lote `xmls[]`) con `supplierAlert` listo para enviar. Ver [`docs/RECEITA_4_AGENTES_REFORMA_TRIBUTARIA.md`](./docs/RECEITA_4_AGENTES_REFORMA_TRIBUTARIA.md) y [`examples/rtc-4-agents-workflow.mjs`](./examples/rtc-4-agents-workflow.mjs).

> [English (README.en.md)](./README.en.md) | [Português (README.md)](./README.md) | [Hub Unificado (api.brunopompeo.com.br)](https://api.brunopompeo.com.br) | [Catálogo JSON](./catalog.json) | [llms.txt](./llms.txt)

Colección en producción de **12 APIs serverless en el borde de Cloudflare** (**10–30 ms de latencia en México, Argentina, Chile, Colombia, Perú, Uruguay y Brasil**), diseñadas específicamente para **agentes autónomos de IA, bots DeFi/cripto, fintechs, flujos KYC/onboarding, n8n, LangChain y ERPs**.

- **Sin registro, sin tarjeta y sin suscripciones:** Pago por solicitud en **USDC sobre red Base (`eip155:8453`)** mediante el estándar abierto **x402 v2** (`HTTP 402 PAYMENT-REQUIRED` / `PAYMENT-SIGNATURE`), con soporte dual Coinbase CDP + PayAI.
- **Hub Unificado + 12 Subdominios Dedicados:** Consume todo desde [`https://api.brunopompeo.com.br`](https://api.brunopompeo.com.br) o directamente en cada subdominio (`*.brunopompeo.com.br`).
- **Servidor MCP Unificado en 1 comando:** Conecta las **14 herramientas pagas + 1 gratuita** en Claude Desktop, Cursor, VS Code o Windsurf con `npx -y @brunopompeo/brazil-ai-x402-mcp` (o `npx -y github:brunopompeo1/brazil-ai-fiscal-apis-x402`).
- **Muestra gratuita (`GET /sample`) en cada API:** Prueba la estructura exacta de entrada/salida sin costo antes de pagar.

---

## Herramientas Globales de Alto Volumen para Agentes y DeFi (5 APIs)

| Servicio | Qué resuelve | Endpoint Pago (x402 Base USDC) | Precio | Muestra Gratis |
| :--- | :--- | :--- | :--- | :--- |
| **1. Base & EVM DeFi Shield (NUEVO v2.7)** | Escudo pre-trade en 7 redes EVM (simulación Honeypot.is V2 + GoPlus + liquidez DexScreener + divergencia de oráculo DefiLlama `pass`/`warn`/`fail` + `safetyScore`) y auditoría de riesgo + saldos Base ETH/USDC de wallets (`/wallet`) | `POST/GET https://defi.brunopompeo.com.br/check` & `/wallet` | `$0.015` | [`/sample`](https://defi.brunopompeo.com.br/sample) |
| **2. Crypto Perp & Infra Pulse (NUEVO v2.7)** | Tasas de funding perpetuas en vivo en ~180 mercados Hyperliquid (1h/8h/APR %, basis, OI USD, radar de squeeze) + radar de caídas en 10 proveedores críticos de IA/Cripto y salud RPC Base (`/infra`) | `POST/GET https://pulse.brunopompeo.com.br/funding` & `/infra` | `$0.015` | [`/sample`](https://pulse.brunopompeo.com.br/sample) |
| **3. Agent Guard Firewall** | Detecta prompt injection, jailbreaks y fuga de secretos (Llama Guard 3 8B + heurística + decodificador Base64) y oculta PII sensible | `POST https://guard.brunopompeo.com.br/guard` | `$0.008` | [`/sample`](https://guard.brunopompeo.com.br/sample) |
| **4. Web Enrichment** | Convierte páginas HTML ruidosas en Markdown limpio, tablas JSON y JSON-LD reduciendo hasta 85% los tokens del LLM | `GET https://web.brunopompeo.com.br/clean?url=https://example.com&format=json` | `$0.002` | [`/sample`](https://web.brunopompeo.com.br/sample) |
| **5. Agent Email** | API de correo transaccional pago por envío (Markdown → HTML responsivo) con modo `dryRun` y sin mensualidad SaaS | `POST https://email.brunopompeo.com.br/send` | `$0.005` | [`/sample`](https://email.brunopompeo.com.br/sample) |

## Suite Fintech & Fiscal para LATAM y Brasil (7 APIs)

| Servicio | Qué resuelve | Endpoint Pago (x402 Base USDC) | Precio | Muestra Gratis |
| :--- | :--- | :--- | :--- | :--- |
| **6. LATAM Business & FX (v2.5)** | Valida y decodifica identificadores fiscales y bancarios de **7 países** (individual, auto-detección o lotes hasta 100) + **tipo de cambio LATAM en tiempo real** (`MXN, ARS, CLP, COP, PEN, UYU, BRL, USD, EUR`) | `POST https://latam.brunopompeo.com.br/latam` | `$0.008` | [`/sample`](https://latam.brunopompeo.com.br/sample) |
| **7. Auditor XML NF-e / NFC-e (Brasil)** | Comprime XML SEFAZ 4.00 (~90% menos tokens), verifica matemáticas fiscales (`vProd`/`vNF`), CFOP/NCM y Reforma IBS/CBS | `POST https://nfe.brunopompeo.com.br/audit` | `$0.010` | [`/sample`](https://nfe.brunopompeo.com.br/sample) |
| **8. DANFSe Nacional & RTC (Brasil)** | Calculadora RTC Oficial RFB (Base V0073, sin servidor Java) y generador DANFSe oficial de NFS-e Nacional 2026 | `POST https://danfse.brunopompeo.com.br/generate` | `$0.005` | [`/sample`](https://danfse.brunopompeo.com.br/sample) |
| **9. Lector de Boletos y Guías (Brasil)** | Valida y decodifica boletos FEBRABAN (47/44 dígitos), guías DARF/FGTS/IPTU (48 dígitos) y llaves NF-e | `POST https://docs.brunopompeo.com.br/parse` | `$0.008` | [`/sample`](https://docs.brunopompeo.com.br/sample) |
| **10. Motor Tributario y Nómina (Brasil)** | Calcula Simples Nacional (Anexos I–V + Fator R), nómina CLT (INSS/IRRF/FGTS) y retenciones B2B | `POST https://tax.brunopompeo.com.br/calc` | `$0.008` | [`/sample`](https://tax.brunopompeo.com.br/sample) |
| **11. Business Intel CNPJ & PIX (Brasil)** | Dossier oficial de empresas brasileñas (CNPJ, socios QSA, score KYC), Geo-CEP IBGE y PIX EMVCo CRC16 | `POST https://intel.brunopompeo.com.br/intel` | `$0.010` | [`/sample`](https://intel.brunopompeo.com.br/sample) |
| **12. Calculadoras Financieras (Brasil)** | Corrección monetaria oficial BCB (IPCA, IGP-M, Selic, CDI), cambio PTAX y tablas de amortización Price/SAC | `POST https://fin.brunopompeo.com.br/fin` | `$0.005` | [`/sample`](https://fin.brunopompeo.com.br/sample) |

---

## Cobertura de `latam.brunopompeo.com.br/latam` (7 Países en 1 Llamada)

- **México (MX):** `RFC` (persona física/moral, fecha, dígito SAT Mod-11), `CURP` (18 caracteres, sexo, entidad federativa, dígito RENAPO Mod-10) y `CLABE` (18 dígitos, código de banco ABM + dígito Banxico Mod-10).
- **Argentina (AR):** `CUIT` / `CUIL` (11 dígitos, tipo de contribuyente, DNI, dígito AFIP Mod-11) y `CBU` (22 dígitos, doble dígito verificador + entidad BCRA).
- **Chile (CL):** `RUT` / `RUN` (dígito verificador SII Mod-11 con `K`, persona natural vs jurídica, formato canónico).
- **Colombia (CO):** `NIT` (dígito de verificación oficial DIAN con pesos primos Mod-11).
- **Perú (PE):** `RUC` (11 dígitos, prefijos `10/15/16/17/20`, dígito SUNAT Mod-11 y extracción de DNI).
- **Uruguay (UY):** `RUT` (12 dígitos, estructura y dígito verificador DGI Mod-11).
- **Brasil (BR):** `CPF` y `CNPJ` (Mod-11) para flujos KYC transfronterizos unificados.
- **Tipo de Cambio LATAM (`fx`):** Conversión en tiempo real entre `MXN`, `ARS`, `CLP`, `COP`, `PEN`, `UYU`, `BRL`, `USD` y `EUR` con caché en el borde y fallback resiliente (nunca rompe el loop del agente con error 500).

---

## Plantillas "Copiar y Pegar" para Producción (`examples/`)

- **Workflow n8n importable (`guard` + `web` + `latam`):** [`examples/n8n-workflow-x402-latam.json`](./examples/n8n-workflow-x402-latam.json)
- **Tool lista para LangChain / Vercel AI SDK:** [`examples/langchain-x402.ts`](./examples/langchain-x402.ts)
- **Cliente TypeScript x402 minimalista:** [`examples/typescript-x402-client.ts`](./examples/typescript-x402-client.ts)
- **Cliente Python para Agentes:** [`examples/python-x402-client.py`](./examples/python-x402-client.py)

## Prueba Rápida (`curl`)

```bash
# 1. Ver ejemplo gratuito de respuesta real (sin pago)
curl -s https://defi.brunopompeo.com.br/sample
curl -s https://pulse.brunopompeo.com.br/sample

# 2. Probar escudo pre-trade DeFi (retorna HTTP 402 con encabezado PAYMENT-REQUIRED)
curl -i -X POST https://api.brunopompeo.com.br/check \
  -H "Content-Type: application/json" \
  -d '{"address":"WETH","chain":"base"}'
```

## Conector MCP Unificado (Claude Desktop / Cursor / VS Code)

```json
{
  "mcpServers": {
    "latam-ai-x402": {
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

> **Nota:** Sin `X402_PRIVATE_KEY`, el servidor inicia en modo `discovery_only` (muestra las 15 herramientas y devuelve el contrato HTTP 402 sin cobrar). Para pagos automáticos en producción, configure su clave privada con saldo USDC en Base o una clave B2B en `BRAZIL_AI_API_KEY`.
