export const SUITE_TOOLS = [
  {
    name: "base_token_safety_check",
    priceUsd: "0.015",
    method: "POST",
    endpoint: "https://defi.brunopompeo.com.br/check",
    description:
      "Pre-trade token safety check on Base/EVM: Honeypot.is V2 swap simulation, GoPlus honeypot & tax scan, DexScreener live liquidity, DefiLlama oracle price divergence (pass/warn/fail), safetyScore (0-100), and swapEligibility across 7 EVM chains ($0.015 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description:
            "0x token contract address or Base symbol (WETH, USDC, AERO, VIRTUAL, DEGEN, BRETT)",
        },
        chain: {
          type: "string",
          enum: ["base", "ethereum", "arbitrum", "optimism", "polygon", "bsc", "avalanche"],
          description: "Chain name (default: base)",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "evm_wallet_risk_check",
    priceUsd: "0.015",
    method: "POST",
    endpoint: "https://defi.brunopompeo.com.br/wallet",
    description:
      "Check any EVM wallet for phishing, sanctions, money laundering, or malicious contract flags via GoPlus plus live Base ETH & USDC balances and account type (EOA vs CONTRACT) via RPC ($0.015 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "0x EVM wallet address",
        },
        chain: {
          type: "string",
          enum: ["base", "ethereum", "arbitrum", "optimism", "polygon"],
          description: "Chain name (default: base)",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "hyperliquid_perp_funding_radar",
    priceUsd: "0.015",
    method: "POST",
    endpoint: "https://pulse.brunopompeo.com.br/funding",
    description:
      "Fetch live Hyperliquid perpetual futures funding rates (1h, 8h, APR %), mark/oracle basis, open interest USD, and top long/short squeeze candidates across ~180 markets ($0.015 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "Optional comma-separated ticker(s), e.g. BTC,ETH,SOL,HYPE",
        },
        symbols: {
          type: "array",
          items: { type: "string" },
          description: "Optional array of ticker symbols, e.g. ['BTC','ETH','SOL','HYPE']",
        },
        top: {
          type: "number",
          description:
            "Number of top OI markets to return when symbol/symbols is omitted (default: 15, max: 50)",
        },
      },
    },
  },
  {
    name: "ai_crypto_outage_radar",
    priceUsd: "0.015",
    method: "POST",
    endpoint: "https://pulse.brunopompeo.com.br/infra",
    description:
      "Check live operational status & active incidents across 10 core AI & Crypto providers (OpenAI, Anthropic, Cloudflare, GitHub, Vercel, Supabase, Base, Coinbase, Solana, Alchemy) plus live Base Mainnet RPC block & latency ($0.015 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["all", "ai", "cloud", "crypto"],
          description: "Optional filter: all (default), ai, cloud, crypto",
        },
      },
    },
  },
  {
    name: "agent_guard_sanitize",
    priceUsd: "0.008",
    method: "POST",
    endpoint: "https://guard.brunopompeo.com.br/guard",
    description:
      "Hybrid Edge AI firewall (@cf/meta/llama-guard-3-8b + multi-language regex + Base64 decoder) that detects prompt injection and masks corporate PII/secrets ($0.008 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description:
            "Untrusted external input (scraped HTML, email, support ticket, webhook) to inspect and sanitize",
        },
        maskPii: {
          type: "boolean",
          description:
            "Redact emails, credit cards, CPFs, CNPJs, API tokens, and private keys (default: true)",
        },
        deepScan: {
          type: "boolean",
          description:
            "Run Cloudflare Workers AI (@cf/meta/llama-guard-3-8b) semantic classifier (default: true)",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "web_enrichment_clean",
    priceUsd: "0.002",
    method: "GET",
    endpoint: "https://web.brunopompeo.com.br/clean",
    description:
      "Scrapes any URL at the Cloudflare Edge and returns clean Markdown, structured HTML tables as JSON, Schema.org JSON-LD, and token compression metrics ($0.002 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description:
            "Target HTTP/HTTPS URL to scrape, clean, and extract structured tables/JSON-LD",
        },
        format: {
          type: "string",
          enum: ["json", "markdown"],
          description: "Output format (default: json)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "agent_send_email",
    priceUsd: "0.005",
    method: "POST",
    endpoint: "https://email.brunopompeo.com.br/send",
    description:
      "Dispatches transactional or alert emails on behalf of an autonomous AI agent with automatic Markdown-to-responsive-HTML compilation and zero SaaS subscription ($0.005 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description: "Recipient email address (or comma-separated list of recipients)",
        },
        subject: {
          type: "string",
          description: "Email subject line",
        },
        markdown: {
          type: "string",
          description: "Markdown email content (automatically compiled into responsive HTML email)",
        },
        text: {
          type: "string",
          description: "Optional plain text body fallback",
        },
        html: {
          type: "string",
          description: "Optional raw HTML body override",
        },
        replyTo: {
          type: "string",
          description: "Optional Reply-To email address",
        },
      },
      required: ["to", "subject"],
    },
  },
  {
    name: "latam_validate_and_fx",
    priceUsd: "0.008",
    method: "POST",
    endpoint: "https://latam.brunopompeo.com.br/latam",
    description:
      "Validates & decodes LATAM tax IDs and bank accounts across 7 countries (MX RFC/CURP/CLABE, AR CUIT/CUIL/CBU, CL RUT/RUN, CO NIT, PE RUC, UY RUT, BR CPF/CNPJ) with auto-detection, batch mode (up to 100), and real-time LATAM FX rates (MXN/ARS/CLP/COP/PEN/UYU/BRL/USD/EUR) ($0.008 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        value: {
          type: "string",
          description: "Single LATAM tax or bank identifier (auto-detected if country/type omitted)",
        },
        country: {
          type: "string",
          enum: ["MX", "AR", "CL", "CO", "PE", "UY", "BR"],
        },
        type: {
          type: "string",
          enum: ["RFC", "CURP", "CLABE", "CUIT", "CUIL", "CBU", "RUT", "RUT_CL", "RUT_UY", "NIT", "RUC", "CPF", "CNPJ"],
        },
        items: {
          type: "array",
          description: "Batch array of LATAM identifiers to validate in one call",
          items: {
            type: "object",
            properties: {
              value: { type: "string" },
              country: { type: "string" },
              type: { type: "string" },
              label: { type: "string" },
            },
            required: ["value"],
          },
        },
        fx: {
          type: "object",
          description: "Optional real-time LATAM FX conversion ({ amount, from, to })",
          properties: {
            amount: { type: "number" },
            from: { type: "string" },
            to: {
              oneOf: [
                { type: "string" },
                { type: "array", items: { type: "string" } },
              ],
            },
          },
        },
      },
    },
  },
  {
    name: "br_nfe_xml_auditor",
    priceUsd: "0.010",
    method: "POST",
    endpoint: "https://nfe.brunopompeo.com.br/audit",
    description:
      "Brazilian NF-e/NFC-e XML-to-JSON compressor (~90% token savings), Mod-11 key decoder, and LC 214/2025 CBS/IBS Tax Credit Auditor (single XML, batch xmls[] up to 25, or direct items[]) with official RFB Base V0073 and ready-to-send supplierAlert ($0.010 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        xml: {
          type: "string",
          description:
            "Raw Brazilian NF-e or NFC-e XML content (<nfeProc> or <NFe>, SEFAZ 4.00 layout) to parse, compress (~90% token savings), and mathematically audit.",
        },
        accessKey: {
          type: "string",
          description:
            "Optional 44-digit Brazilian NF-e access key (Chave de Acesso) to decompose UF, issue date, issuer CNPJ, model, number, and validate Mod-11 check digit.",
        },
        includeItems: {
          type: "boolean",
          description:
            "Include line-item details (NCM, CFOP, quantities, ICMS/IPI/PIS/COFINS) in output (default: true).",
        },
        xmls: {
          type: "array",
          items: { type: "string" },
          description: "Optional batch array of up to 25 NF-e/NFC-e XML strings for fleet/procurement CBS/IBS credit auditing.",
        },
        items: {
          type: "array",
          description: "Optional direct purchased items array ({ descricao, ncm, cClassTrib, valor, vCBS, vIBS }) for CBS/IBS credit auditing without XML.",
          items: { type: "object" },
        },
        auditRtcCredit: {
          type: "boolean",
          description: "Enable LC 214/2025 CBS/IBS tax credit audit & supplierAlert generation (default: true).",
        },
        referenceYear: {
          type: "integer",
          description: "Calendar year (2026..2033) for expected CBS/IBS rates (default: invoice issue year >= 2026).",
        },
        supplierEmail: {
          type: "string",
          description: "Optional supplier email to prefill supplierAlert.emailDraft for agent-email-x402 chaining.",
        },
        aiSummary: {
          type: "boolean",
          description:
            "Generate a concise accounting/tax audit summary via Cloudflare Workers AI (default: true).",
        },
      },
    },
  },
  {
    name: "br_danfse_rtc_generate",
    priceUsd: "0.005",
    method: "POST",
    endpoint: "https://danfse.brunopompeo.com.br/generate",
    description:
      "Official Brazil Receita Federal RTC Calculator (Base V0073 — 170 cClassTrib, 450 NCMs, 89 NBS, legal reductions 50%/60%/100%, Simples Nacional Annexes I-V, 2026-2033 transition) & DANFSe generator on Cloudflare Edge without Java server ($0.005 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        xml: {
          type: "string",
          description: "Raw NFS-e XML (National standard or ABRASF).",
        },
        valorServico: {
          type: "number",
          description: "Shortcut service amount in BRL.",
        },
        discriminacao: {
          type: "string",
          description: "Shortcut service description.",
        },
        prestador: {
          type: "object",
          description: "Service provider identification (CNPJ, razão social, município).",
        },
        tomador: {
          type: "object",
          description: "Service taker identification (CPF/CNPJ, nome/razão social).",
        },
        cClassTrib: {
          type: "string",
          description: "Official 6-digit Receita Federal cClassTrib code (Base V0073, e.g. '200046' construction 50%, '200029' health 60%, '200003' basic basket 100%).",
        },
        ncm: { type: "string", description: "Optional NCM code for automatic official RFB cClassTrib & reduction lookup." },
        nbs: { type: "string", description: "Optional NBS service code for automatic official RFB cClassTrib lookup." },
        setor: {
          type: "string",
          description: "Semantic sector alias (e.g. 'construcao_civil', 'saude', 'educacao', 'cesta_basica', 'profissao_intelectual', 'combustiveis').",
        },
        regime: {
          type: "string",
          enum: ["regime_regular", "simples_nacional", "simples_nacional_regular_por_fora"],
          description: "Tax regime (default: 'regime_regular').",
        },
        ano: { type: "integer", description: "Calendar year for LC 214/2025 transition schedule (2026..2033, default: 2026)." },
        anexoSimples: { type: "string", enum: ["I", "II", "III", "IV", "V"] },
        rbt12: { type: "number", description: "Last 12-month gross revenue in BRL for Simples Nacional effective DAS rate." },
        fatorR: { type: "number", description: "Payroll/revenue ratio (0..1) for Simples Nacional Annex III vs V." },
        generateHtml: { type: "boolean", description: "Include printable DANFSe HTML in response (default: true)." },
        servico: {
          type: "object",
          description: "Service values, cTribNac, cClassTrib, and optional manual ISS/CBS/IBS rates.",
        },
      },
    },
  },
  {
    name: "br_docs_parser",
    priceUsd: "0.008",
    method: "POST",
    endpoint: "https://docs.brunopompeo.com.br/parse",
    description:
      "Brazilian FEBRABAN Bank Boleto (47/44), Tax/Utility Slip DARF/FGTS/IPTU (48/44), and NF-e Access Key (44) validator & decoder with post-2025 due date engine ($0.008 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description:
            "Brazilian payment slip digitable line (47 digits for Bank Boleto, 48 digits for Tax/Utility Slip like DARF/FGTS/IPTU), 44-digit barcode, or 44-digit NF-e access key.",
        },
        documentType: {
          type: "string",
          enum: ["auto", "boleto", "arrecadacao", "nfe_key"],
          description: "Optional explicit parser mode (default: auto).",
        },
        aiSummary: {
          type: "boolean",
          description:
            "Generate a concise payment/document summary via Cloudflare Workers AI (default: true).",
        },
      },
      required: ["code"],
    },
  },
  {
    name: "br_tax_payroll_calc",
    priceUsd: "0.008",
    method: "POST",
    endpoint: "https://tax.brunopompeo.com.br/calc",
    description:
      "Deterministic Brazilian tax & payroll calculator: Simples Nacional (Anexos I-V + Fator R), progressive INSS/IRRF, FGTS, and B2B NFS-e withholdings ($0.008 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        simples: {
          type: "object",
          description:
            "Calculate Brazilian Simples Nacional effective tax rate, DAS amount, and Fator R (28% payroll ratio optimization).",
          properties: {
            rbt12: { type: "number", description: "Trailing 12-month gross revenue (RBT12) in BRL" },
            monthlyRevenue: { type: "number", description: "Current month revenue in BRL" },
            anexo: { type: "string", enum: ["I", "II", "III", "IV", "V", "auto"] },
            payroll12m: {
              type: "number",
              description: "Trailing 12-month payroll expense in BRL (used for Fator R)",
            },
          },
          required: ["rbt12", "monthlyRevenue"],
        },
        payroll: {
          type: "object",
          description:
            "Calculate progressive INSS, IRRF (comparing legal deductions vs simplified discount), net salary, and employer FGTS.",
          properties: {
            grossSalary: { type: "number" },
            dependents: { type: "number" },
            otherDeductions: { type: "number" },
            isProLabore: { type: "boolean" },
          },
          required: ["grossSalary"],
        },
        nfseRetention: {
          type: "object",
          description:
            "Calculate B2B Brazilian service invoice withholdings (IRRF 1.5%, CSRF/PCC 4.65%, ISS, INSS 11%) and net payable.",
          properties: {
            invoiceAmount: { type: "number" },
            issRatePct: { type: "number" },
            retainIss: { type: "boolean" },
            isSimplesNacional: { type: "boolean" },
            serviceType: {
              type: "string",
              enum: ["geral", "consultoria_ti_contabil", "limpeza_vigilancia"],
            },
          },
          required: ["invoiceAmount"],
        },
        aiSummary: {
          type: "boolean",
          description:
            "Generate an executive Brazilian tax & payroll brief via Cloudflare Workers AI (default: true).",
        },
      },
    },
  },
  {
    name: "br_business_intel",
    priceUsd: "0.010",
    method: "POST",
    endpoint: "https://intel.brunopompeo.com.br/intel",
    description:
      "Brazilian Corporate CNPJ KYB Dossier (QSA partners, Simples/MEI, B2B Risk Score), IBGE Geo-CEP lookup, CPF/CNPJ Mod-11 validator, and Central Bank PIX BRCode (EMVCo + CRC16) generator/decoder ($0.010 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        cnpj: {
          type: "string",
          description:
            "Brazilian corporate tax ID (CNPJ, 14 digits) to fetch full Receita Federal dossier, QSA partners, tax regime (Simples/MEI), and B2B credit/compliance risk score.",
        },
        cep: {
          type: "string",
          description:
            "Brazilian postal code (CEP, 8 digits) to enrich address, IBGE municipality code, state UF, and area code (DDD).",
        },
        documentToValidate: {
          type: "string",
          description:
            "CPF (11 digits) or CNPJ (14 digits) to validate mathematical check digits (Mod-11).",
        },
        pixGenerate: {
          type: "object",
          description:
            "Generate an official Central Bank of Brazil (BCB EMVCo) PIX Copy-and-Paste payload with CRC16-CCITT checksum.",
          properties: {
            key: {
              type: "string",
              description: "PIX key (CPF, CNPJ, Email, Phone +55, or Random UUID)",
            },
            merchantName: { type: "string", description: "Recipient name (up to 25 ASCII chars)" },
            merchantCity: { type: "string", description: "Recipient city (up to 15 ASCII chars)" },
            amount: { type: "number", description: "Transaction amount in BRL (e.g., 49.90)" },
            txid: {
              type: "string",
              description: "Transaction reference ID (alphanumeric up to 25 chars)",
            },
          },
          required: ["key", "merchantName", "merchantCity"],
        },
        pixDecode: {
          type: "string",
          description:
            "Raw PIX Copy-and-Paste string (000201...) to parse EMV tags and verify CRC16 integrity.",
        },
        aiSummary: {
          type: "boolean",
          description:
            "Generate an executive B2B compliance summary using Cloudflare Workers AI (default: true).",
        },
      },
    },
  },
  {
    name: "br_fin_calculators",
    priceUsd: "0.005",
    method: "POST",
    endpoint: "https://fin.brunopompeo.com.br/fin",
    description:
      "Official Central Bank of Brazil (BCB) IPCA/IGPM/Selic/CDI monetary correction, PTAX currency conversion, and Price/SAC loan simulator ($0.005 USDC via x402 on Base).",
    inputSchema: {
      type: "object",
      properties: {
        correction: {
          type: "object",
          description:
            "Official Central Bank of Brazil (BCB SGS) monetary correction using IPCA, IGPM, INPC, SELIC, or CDI.",
          properties: {
            amountBRL: { type: "number" },
            index: { type: "string", enum: ["IPCA", "IGPM", "INPC", "SELIC", "CDI"] },
            startDate: { type: "string", description: "YYYY-MM-DD" },
            endDate: { type: "string", description: "YYYY-MM-DD" },
            includeBreakdown: { type: "boolean" },
          },
          required: ["amountBRL", "index", "startDate", "endDate"],
        },
        ptax: {
          type: "object",
          description:
            "Official Central Bank of Brazil PTAX currency conversion (BRL, USD, EUR, GBP).",
          properties: {
            amount: { type: "number" },
            from: { type: "string", enum: ["BRL", "USD", "EUR", "GBP"] },
            to: { type: "string", enum: ["BRL", "USD", "EUR", "GBP"] },
            date: { type: "string", description: "Optional reference date YYYY-MM-DD" },
          },
          required: ["amount", "from", "to"],
        },
        loan: {
          type: "object",
          description: "Exact Price and SAC loan/financing amortization simulator.",
          properties: {
            principal: { type: "number" },
            monthlyInterestRatePct: { type: "number" },
            months: { type: "number" },
            system: { type: "string", enum: ["PRICE", "SAC", "BOTH"] },
            includeSchedule: { type: "boolean" },
          },
          required: ["principal", "monthlyInterestRatePct", "months"],
        },
        aiSummary: {
          type: "boolean",
          description:
            "Generate a concise financial brief via Cloudflare Workers AI (default: true).",
        },
      },
    },
  },
];
