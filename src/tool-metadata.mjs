// MCP metadata layer (TDQS): title, rich description, annotations, outputSchema and
// parameter documentation for every tool exposed by this server.
// Metadata only: tool names, prices, endpoints, HTTP methods and the x402 v2 payment
// contract live in ./tools.mjs and are never changed here.
import { LIVE_SCHEMAS } from "./live-schemas.mjs";

// ---------------------------------------------------------------------------
// Shared text blocks
// ---------------------------------------------------------------------------
const billing = (price) =>
  `Billing: ${price} USDC per call. With X402_PRIVATE_KEY set, the server pays with x402 v2 on Base mainnet (eip155:8453) and refuses locally, before any request, when the price exceeds X402_MAX_USDC_PER_CALL (default 0.05). With BRAZIL_AI_API_KEY set, the call is debited from a prepaid B2B quota instead. With no credentials nothing is charged: the tool returns isError with error "payment_required_x402" plus the decoded paymentRequirements, so call brazil_ai_suite_status first to see the active payment mode.`;

const ERRORS =
  'Errors never throw: a spend-cap block ("x402_spend_cap_exceeded"), a non-2xx API answer ({ status, endpoint, body }) or a network failure ("mcp_tool_execution_failed") comes back as an isError result with JSON text, so the agent loop keeps running.';

const SETTLEMENT_PROP = {
  type: "object",
  description:
    "x402 settlement receipt decoded from the PAYMENT-RESPONSE header (success flag, transaction hash, network, payer). Present only when the call was paid with an x402 wallet.",
};
const RAW_TEXT_PROP = {
  type: "string",
  description: "Raw response body, present only when the API answered with non-JSON content (for example format=markdown).",
};
const NEXT_STEPS_PROP = {
  type: "array",
  description:
    "Advisory chaining hints: sibling paid APIs of this suite that are commonly called next, with endpoint, price and reason. Never required.",
  items: { type: "object" },
};
const META_PROP = {
  type: "object",
  description: "Service metadata added by the API on paid calls: service id, version, authMode (x402 or b2b), facilitator and processingTimeMs.",
};
const AI_BRIEF_PROP = {
  type: "string",
  description: "Short executive summary written by Cloudflare Workers AI. Present only when aiSummary is true (the default); null or absent if the AI pass was skipped.",
};
const PROCESSING_PROP = { type: "number", description: "Server-side processing time in milliseconds." };
const FAILURE_PROPS = {
  error: { type: "string", description: "Stable machine-readable failure code, present only on failure." },
  message: { type: "string", description: "Human-readable explanation of the failure, present only on failure." },
};

// ---------------------------------------------------------------------------
// Output-schema relaxation: the MCP client validates structuredContent against
// outputSchema, so a stricter schema than the live API could break the agent
// loop. Every nested type also accepts null, and constraints that a live upstream
// could violate (required/enum/min/max/pattern/format) are dropped.
// ---------------------------------------------------------------------------
const DROP_KEYS = new Set([
  "required",
  "enum",
  "const",
  "minItems",
  "maxItems",
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "minLength",
  "maxLength",
  "pattern",
  "format",
  "default",
  "examples",
]);

function relax(node) {
  if (Array.isArray(node)) return node.map(relax);
  if (!node || typeof node !== "object") return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (DROP_KEYS.has(k)) continue;
    if (k === "additionalProperties" && v === false) continue;
    if (k === "type") {
      const types = Array.isArray(v) ? [...v] : [v];
      if (!types.includes("null")) types.push("null");
      out.type = types;
    } else if (k === "properties") {
      out.properties = Object.fromEntries(Object.entries(v).map(([pk, pv]) => [pk, relax(pv)]));
    } else if (k === "oneOf") {
      out.anyOf = v.map(relax);
    } else {
      out[k] = relax(v);
    }
  }
  return out;
}

function outputSchema(properties) {
  return {
    type: "object",
    properties: relax({ ...properties, _x402Settlement: SETTLEMENT_PROP, text: RAW_TEXT_PROP }),
    additionalProperties: true,
  };
}

// Deep-clones an input schema and fills in descriptions on nested paths.
// Paths use dots for object properties and [] for array items, e.g. "fx.amount", "items[].value".
function documentInput(schema, docs = {}, replaceProps = {}) {
  const clone = JSON.parse(JSON.stringify(schema));
  for (const [key, def] of Object.entries(replaceProps)) {
    if (def) clone.properties[key] = JSON.parse(JSON.stringify(def));
  }
  for (const [path, description] of Object.entries(docs)) {
    let node = clone;
    for (const seg of path.split(".")) {
      const isArr = seg.endsWith("[]");
      const name = isArr ? seg.slice(0, -2) : seg;
      node = node?.properties?.[name];
      if (node && isArr) node = node.items;
    }
    if (node && typeof node === "object") node.description = description;
  }
  return clone;
}

const READ_LIVE = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
const READ_DETERMINISTIC = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

// ---------------------------------------------------------------------------
// Free status tool
// ---------------------------------------------------------------------------
export const STATUS_TOOL_METADATA = {
  title: "Suite catalog, prices and payment mode (free)",
  description: [
    "Free, local discovery call: lists every paid tool of the Global + LATAM AI & x402 Suite with its HTTP method, live endpoint and USDC price on Base, and reports how this MCP server will pay (x402_wallet, b2b_api_key or discovery_only), the paying wallet address and the per-call spend cap.",
    "Use it first, before any paid tool, to confirm the price and that a payment method is configured; it is also the right call when a paid tool answered payment_required_x402 or x402_spend_cap_exceeded.",
    "Do not use it to fetch business data: it never contacts the APIs, never spends USDC and has no parameters.",
    "Read-only and idempotent: the answer changes only when the server env (X402_PRIVATE_KEY, BRAZIL_AI_API_KEY, X402_MAX_USDC_PER_CALL) changes. It cannot fail.",
  ].join(" "),
  annotations: { title: "Suite catalog, prices and payment mode (free)", ...READ_DETERMINISTIC },
  outputSchema: {
    type: "object",
    properties: relax({
      suite: { type: "string", description: "Suite name." },
      version: { type: "string", description: "Version of this MCP server package." },
      totalMicroservices: { type: "number", description: "Number of live Edge APIs behind the paid tools." },
      totalPaidTools: { type: "number", description: "Number of paid tools exposed by this server." },
      network: { type: "string", description: "Settlement network, always eip155:8453 (Base mainnet)." },
      currency: { type: "string", description: "Settlement currency, always USDC." },
      paymentMode: {
        type: "string",
        description:
          "x402_wallet (X402_PRIVATE_KEY set, pays per call), b2b_api_key (BRAZIL_AI_API_KEY set, prepaid quota) or discovery_only (no credentials; paid tools return payment_required_x402).",
      },
      walletAddress: { type: "string", description: "Public address of the paying Base wallet; null unless paymentMode is x402_wallet." },
      maxUsdcPerCall: { type: "number", description: "Per-call spend cap in USDC enforced locally before paying; 0 when no wallet is configured." },
      services: {
        type: "array",
        description: "One entry per paid tool.",
        items: {
          type: "object",
          properties: {
            tool: { type: "string", description: "MCP tool name." },
            method: { type: "string", description: "HTTP method used against the endpoint (GET or POST)." },
            endpoint: { type: "string", description: "Live HTTPS endpoint called by the tool." },
            priceUsdc: { type: "string", description: "Price per call in USDC, as a decimal string." },
          },
        },
      },
    }),
    additionalProperties: true,
  },
};

// ---------------------------------------------------------------------------
// Paid tools
// ---------------------------------------------------------------------------
export const TOOL_METADATA = {
  base_token_safety_check: {
    title: "Pre-trade token safety check (Base/EVM honeypot, tax, liquidity, oracle)",
    description: [
      "Scores whether an ERC-20 token is safe to buy and sell before a swap: Honeypot.is V2 sell simulation, GoPlus contract scan (honeypot, buy/sell tax, mintable, proxy, hidden owner, blacklist), DexScreener liquidity and pair age, and DefiLlama oracle vs DEX price divergence, folded into verdict (SAFE, CAUTION, DANGER, HONEYPOT), safetyScore 0-100 and a swapEligibility decision with a recommended max slippage.",
      "Use it right before an agent swaps, lists or accepts an unfamiliar token on Base, Ethereum, Arbitrum, Optimism, Polygon, BSC or Avalanche.",
      "Do not use it for wallet or counterparty screening (use evm_wallet_risk_check) or for market timing (use hyperliquid_perp_funding_radar).",
      "Read-only: it only queries public security and market sources and never signs or sends transactions. Results reflect live market data, so a repeat call may differ. An invalid address or unsupported chain returns ok:false with error invalid_token_address and the list of supported chains.",
      billing("0.015"),
      ERRORS,
    ].join(" "),
    annotations: { title: "Pre-trade token safety check (Base/EVM)", ...READ_LIVE },
    inputDocs: {
      address:
        "Token contract address (0x + 40 hex chars) or a Base ticker shortcut: WETH, USDC, AERO, VIRTUAL, DEGEN, BRETT or CBBTC. Required.",
      chain:
        "Chain where the token lives: base (default), ethereum, arbitrum, optimism, polygon, bsc or avalanche. Must match the chain of the address.",
    },
    output: {
      ok: { type: "boolean", description: "true when the check ran; false for invalid input (see error)." },
      chain: { type: "string", description: "Chain key actually checked." },
      chainId: { type: "number", description: "EVM chain id of the checked chain." },
      token: { type: "object", description: "Resolved token identity: address, symbol, name, decimals." },
      verdict: { type: "string", description: "SAFE, CAUTION, DANGER or HONEYPOT. Treat HONEYPOT and DANGER as do-not-trade." },
      safetyScore: { type: "number", description: "0-100 composite safety score; 75+ is SAFE, 45-74 CAUTION, below 45 DANGER." },
      swapEligibility: {
        type: "object",
        description: "Trade decision: eligible (boolean), maxRecommendedSlippageBps (50, 100 or 250) and reason.",
      },
      pricingAndOracle: {
        type: "object",
        description: "dexPriceUsd, oraclePriceUsd, oracleConfidence, divergencePct and oracleAgree (pass, warn or fail).",
      },
      liquidityAndMarket: {
        type: "object",
        description:
          "primaryDex, pairAddress, pairUrl, topPoolLiquidityUsd, totalChainLiquidityUsd, volume24hUsd, priceChange24hPct, pairAgeHours and txns24h buys/sells.",
      },
      contractSecurity: {
        type: "object",
        description:
          "Contract flags: isHoneypot, cannotSellAll, buyTaxPct, sellTaxPct, isMintable, isProxy, hiddenOwner, isBlacklisted, isOpenSource, holderCount, top10HolderPct and the Honeypot.is simulation result.",
      },
      flags: { type: "array", description: "Risk findings, each with severity (high or medium), code and detail.", items: { type: "object" } },
      sources: { type: "object", description: "Which upstream sources answered: goPlus, honeypotIsV2, dexScreener, defiLlama (booleans)." },
      supportedChains: { type: "array", description: "Supported chain keys, returned with invalid-input errors.", items: { type: "string" } },
      suggestedNextSteps: NEXT_STEPS_PROP,
      meta: META_PROP,
      ...FAILURE_PROPS,
    },
  },

  evm_wallet_risk_check: {
    title: "EVM wallet risk screen (phishing, sanctions, laundering) + live balances",
    description: [
      "Screens an EVM wallet with GoPlus address security (phishing, sanctions, stealing attacks, mixers, money laundering, malicious contracts created) and reads live native ETH and USDC balances, transaction count and account type (EOA or CONTRACT) over RPC, returning riskVerdict (CLEAN, SUSPICIOUS, MALICIOUS) and riskScore 0-100.",
      "Use it before paying, refunding or onboarding a counterparty wallet, or to check a token deployer flagged by base_token_safety_check.",
      "Do not use it to evaluate a token contract (use base_token_safety_check). It is a risk signal, not a legal sanctions determination.",
      "Read-only: it never signs or moves funds. Balances are live, so repeat calls can differ. An invalid address returns ok:false with error and message.",
      billing("0.015"),
      ERRORS,
    ].join(" "),
    annotations: { title: "EVM wallet risk screen + live balances", ...READ_LIVE },
    inputDocs: {
      address: "Wallet address to screen (0x + 40 hex chars). Required.",
      chain: "Chain for the GoPlus screen: base (default), ethereum, arbitrum, optimism or polygon.",
    },
    output: {
      ok: { type: "boolean", description: "true when the screen ran; false for invalid input." },
      chain: { type: "string", description: "Chain key actually screened." },
      chainId: { type: "number", description: "EVM chain id of the screened chain." },
      address: { type: "string", description: "Normalized wallet address." },
      accountType: { type: "string", description: "EOA (externally owned account) or CONTRACT." },
      riskVerdict: { type: "string", description: "CLEAN (score below 40), SUSPICIOUS (40-74) or MALICIOUS (75+)." },
      riskScore: { type: "number", description: "0-100 risk score; 95 for sanctions, phishing or stealing attacks." },
      triggeredFlags: { type: "array", description: "GoPlus flags that fired, e.g. phishing_activities, sanctioned, mixer.", items: { type: "string" } },
      maliciousContractsCreated: { type: "number", description: "Number of malicious contracts deployed by this wallet." },
      balances: { type: "object", description: "Live balances: nativeEth and usdc, as decimal numbers." },
      txCount: { type: "number", description: "Outgoing transaction count (nonce); null if RPC did not answer." },
      sources: { type: "object", description: "Which sources answered: goPlusAddressSecurity, onchainRpc (booleans)." },
      meta: META_PROP,
      ...FAILURE_PROPS,
    },
  },

  hyperliquid_perp_funding_radar: {
    title: "Hyperliquid perp funding, open interest and squeeze radar",
    description: [
      "Reads live Hyperliquid perpetual futures data for about 180 markets and returns, per market, mark and oracle price, basis in bps, funding per 1h and 8h and annualized APR %, open interest and 24h volume in USD, a crowding regime (LONG_CROWDED, SHORT_CROWDED, NEUTRAL) and a squeeze bias, plus a market-wide summary and the top 5 long-crowded and short-crowded markets.",
      "Use it to time entries or exits, size hedges, or detect crowded positioning before a trade.",
      "Do not use it for token contract safety (use base_token_safety_check) or for spot prices only.",
      "Read-only: it never places orders. Data is live, so repeat calls differ. Pass symbol or symbols to filter; otherwise the top markets by open interest are returned (top, default 15, max 50). Unknown tickers are simply absent from markets.",
      billing("0.015"),
      ERRORS,
    ].join(" "),
    annotations: { title: "Hyperliquid perp funding & squeeze radar", ...READ_LIVE, idempotentHint: false },
    inputDocs: {
      symbol: "Optional comma-separated tickers, e.g. 'BTC,ETH,SOL,HYPE'. Case-insensitive. When set, top is ignored.",
      symbols: "Optional array of tickers, e.g. ['BTC','ETH']. Merged with symbol.",
      "symbols[]": "One perp ticker as listed on Hyperliquid, e.g. BTC.",
      top: "How many markets to return, ranked by open interest, when no symbol filter is given. Default 15, clamped to 1-50.",
    },
    output: {
      ok: { type: "boolean", description: "true when Hyperliquid answered; false when the venue was unreachable." },
      venue: { type: "string", description: "Always Hyperliquid." },
      fetchedAt: { type: "string", description: "ISO 8601 time of the snapshot." },
      upstreamLatencyMs: { type: "number", description: "Hyperliquid API latency in milliseconds." },
      marketSummary: {
        type: "object",
        description:
          "totalMarketsScanned, totalOpenInterestUsd, totalVolume24hUsd, averageFundingAprPct and aggregateRegime (BULLISH_OVERHEATED, BEARISH_SHORT_CROWDED, BALANCED).",
      },
      markets: {
        type: "array",
        description:
          "Per-market rows: symbol, maxLeverage, markPx, oraclePx, basisBps, funding1hPct, funding8hPct, fundingAprPct, openInterestUsd, volume24hUsd, change24hPct, regime, squeezeBias.",
        items: { type: "object" },
      },
      squeezeRadar: {
        type: "object",
        description: "topLongCrowded and topShortCrowded: the 5 most extreme funding markets with at least 500k USD open interest.",
      },
      suggestedNextSteps: NEXT_STEPS_PROP,
      meta: META_PROP,
      ...FAILURE_PROPS,
    },
  },

  ai_crypto_outage_radar: {
    title: "Live outage radar for AI, cloud and crypto providers + Base RPC",
    description: [
      "Checks the public status pages of 10 providers agents depend on (OpenAI, Anthropic, Cloudflare, GitHub, Vercel, Supabase, Base, Coinbase, Solana, Alchemy) and probes the Base mainnet RPC (latest block and latency), returning each provider's indicator, active incidents and a single agentRecommendation: ALL_SYSTEMS_GO, PROCEED_WITH_RETRY_GUARD or USE_FALLBACK_OR_DELAY.",
      "Use it before dispatching on-chain transactions or long LLM jobs, or to explain a burst of upstream failures.",
      "Do not use it for market data (use hyperliquid_perp_funding_radar) or to monitor your own services.",
      "Read-only and live: repeat calls can differ. A provider whose status page is unreachable is reported with indicator 'unreachable' and operational false instead of failing the call.",
      billing("0.015"),
      ERRORS,
    ].join(" "),
    annotations: { title: "AI & crypto outage radar", ...READ_LIVE, idempotentHint: false },
    inputDocs: {
      category: "Optional provider group: all (default), ai (OpenAI, Anthropic), cloud (Cloudflare, GitHub, Vercel, Supabase) or crypto (Base, Coinbase, Solana, Alchemy).",
    },
    output: {
      ok: { type: "boolean", description: "true when the radar ran." },
      checkedAt: { type: "string", description: "ISO 8601 time of the check." },
      allOperational: { type: "boolean", description: "true when every checked provider is operational and Base RPC is healthy." },
      agentRecommendation: {
        type: "string",
        description: "ALL_SYSTEMS_GO, PROCEED_WITH_RETRY_GUARD (minor degradation) or USE_FALLBACK_OR_DELAY (major outage or Base RPC down).",
      },
      summary: { type: "object", description: "totalChecked, operationalCount and degradedCount." },
      baseMainnetRpc: { type: "object", description: "healthy (boolean), latestBlock (number) and latencyMs of the Base mainnet RPC probe." },
      degradedProviders: {
        type: "array",
        description: "Providers not fully operational: id, name, indicator, description and activeIncidents.",
        items: { type: "object" },
      },
      providers: {
        type: "array",
        description: "Every checked provider: id, name, category, indicator, description, operational, activeIncidents (name, status, impact, updatedAt) and latencyMs.",
        items: { type: "object" },
      },
      meta: META_PROP,
      ...FAILURE_PROPS,
    },
  },

  agent_guard_sanitize: {
    title: "Prompt-injection firewall and PII/secret redaction for untrusted text",
    description: [
      "Inspects untrusted text before it reaches an LLM: multi-language prompt-injection and jailbreak regex, Base64-smuggled payload decoding and an optional Cloudflare Workers AI Llama Guard 3 semantic pass, then masks emails, credit cards, CPF/CNPJ, API tokens and private keys. Returns isSafe, threatLevel, riskScore, detectedPatterns, the AI verdict and sanitizedText.",
      "Use it on scraped pages, inbound emails, tickets, webhooks or tool outputs before inserting them into a prompt or memory, and before logging text that may hold secrets.",
      "Do not use it to moderate the agent's own output or as a general content classifier; for web content you still need to fetch, call web_enrichment_clean first and pass its markdown here.",
      "Read-only and deterministic for the regex and masking layers; the AI verdict may vary slightly between runs. Set deepScan false for a cheaper-latency regex-only pass and maskPii false to keep the original text. Empty or oversized text returns success:false with error and message.",
      billing("0.008"),
      ERRORS,
    ].join(" "),
    annotations: { title: "Prompt-injection firewall & PII redaction", ...READ_DETERMINISTIC },
    inputDocs: {
      text: "Untrusted text to inspect (scraped HTML or markdown, email body, support ticket, webhook payload, tool output). Required, plain UTF-8.",
      maskPii: "Redact emails, credit cards, CPFs, CNPJs, API tokens and private keys in sanitizedText. Default true.",
      deepScan: "Also run the Cloudflare Workers AI Llama Guard 3 semantic classifier. Default true; false gives a faster regex-only verdict.",
    },
    output: LIVE_SCHEMAS.outputProperties.agent_guard_sanitize,
  },

  web_enrichment_clean: {
    title: "Fetch a URL and return clean Markdown, tables as JSON and JSON-LD",
    description: [
      "Fetches a public web page at the Cloudflare edge and strips navigation, scripts and ads, returning clean Markdown, every HTML table as JSON (headers and rows), Schema.org JSON-LD blocks, outgoing links, page metadata and token-compression metrics showing how much context was saved.",
      "Use it when an agent needs the readable content or tabular data of a specific URL with far fewer tokens than raw HTML.",
      "Do not use it for search (it needs a URL), for pages behind login or heavy client-side rendering, or to decide whether the content is safe; pass untrusted content through agent_guard_sanitize afterwards.",
      "Read-only: it performs one GET on the target and stores nothing. Pages change, so repeat calls can differ. With format=markdown the answer is plain Markdown text (returned in the text field). An unreachable or non-HTML URL returns a non-2xx error result.",
      billing("0.002"),
      ERRORS,
    ].join(" "),
    annotations: { title: "Web page to clean Markdown, tables & JSON-LD", ...READ_LIVE, idempotentHint: false },
    inputDocs: {
      url: "Absolute http(s) URL of the public page to fetch, e.g. https://example.com/pricing. Required.",
      format: "json (default) returns the full structured object; markdown returns only the cleaned Markdown as plain text.",
    },
    output: {
      url: { type: "string", description: "Final URL that was fetched." },
      metadata: { type: "object", description: "Page metadata such as title and description." },
      markdown: { type: "string", description: "Cleaned main content as Markdown." },
      tables: {
        type: "array",
        description: "HTML tables converted to JSON, each with headers (array of strings) and rows (array of string arrays).",
        items: { type: "object" },
      },
      jsonLd: { type: "array", description: "Schema.org JSON-LD objects found in the page.", items: { type: "object" } },
      links: { type: "array", description: "Outgoing links, each with text and href.", items: { type: "object" } },
      tokenMetrics: {
        type: "object",
        description: "rawHtmlTokens, cleanOutputTokens, tokensSaved and compressionRatioPercent.",
      },
      processingTimeMs: PROCESSING_PROP,
      suggestedNextSteps: NEXT_STEPS_PROP,
      ...FAILURE_PROPS,
    },
  },

  agent_send_email: {
    title: "Send a transactional or alert email on behalf of the agent",
    description: [
      "Sends a real email from the suite's transactional sender: the Markdown body is compiled to responsive HTML (or raw html is sent as-is), with optional plain-text fallback and Reply-To, and the provider message id is returned.",
      "Use it when an autonomous workflow must notify a human or a supplier, for example a supplierAlert from br_nfe_xml_auditor or a risk alert.",
      "Do not use it for marketing or bulk mail, for messages that need attachments, or to test rendering (every successful call delivers a real message).",
      "Side effects: NOT read-only and NOT idempotent; each call sends a new email, so retry only when the previous call returned an error. Nothing is deleted or overwritten. Invalid recipients or a missing subject return success:false with error and message.",
      billing("0.005"),
      ERRORS,
    ].join(" "),
    annotations: {
      title: "Send transactional email",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    inputDocs: {
      to: "Recipient address, or several separated by commas. Required.",
      subject: "Subject line, plain text. Required.",
      markdown: "Body in Markdown, compiled into responsive HTML. Provide markdown, text or html.",
      text: "Optional plain-text body, used as the text/plain part and as the body when no markdown or html is given.",
      html: "Optional raw HTML body; overrides the HTML compiled from markdown.",
      replyTo: "Optional Reply-To address so replies go to a human instead of the sender.",
    },
    output: {
      success: { type: "boolean", description: "true when the provider accepted the message." },
      messageId: { type: "string", description: "Provider message id, for tracking." },
      status: { type: "string", description: "Delivery status reported by the provider, e.g. sent or queued." },
      provider: { type: "string", description: "Email provider that handled the send." },
      recipientCount: { type: "number", description: "Number of recipients." },
      recipients: { type: "array", description: "Normalized recipient addresses.", items: { type: "string" } },
      subject: { type: "string", description: "Subject actually sent." },
      renderedHtmlBytes: { type: "number", description: "Size of the HTML body sent, in bytes." },
      processingTimeMs: PROCESSING_PROP,
      ...FAILURE_PROPS,
    },
  },

  latam_validate_and_fx: {
    title: "Validate LATAM tax IDs and bank accounts (7 countries) + live LATAM FX",
    description: [
      "Validates and decodes tax IDs and bank accounts from 7 countries with official check-digit algorithms: Mexico RFC, CURP and CLABE (with bank), Argentina CUIT, CUIL and CBU, Chile RUT, Colombia NIT, Peru RUC, Uruguay RUT and Brazil CPF and CNPJ. It auto-detects country and type, accepts one value or a batch of up to 100 items, and can bundle a live FX conversion across USD, EUR, MXN, ARS, CLP, COP, PEN, UYU and BRL in the same call.",
      "Use it for supplier or customer onboarding, payout file checks and cross-border invoicing in Latin America.",
      "Do not use it for Brazilian company registry data such as partners or tax regime (use br_business_intel) or for official Brazilian Central Bank PTAX rates (use br_fin_calculators).",
      "Read-only: validation is offline and deterministic; only the fx block reads live rates and may differ between calls. Invalid documents are not errors: they come back with valid:false and the reasons in errors. Give exactly one of value or items.",
      billing("0.008"),
      ERRORS,
    ].join(" "),
    annotations: { title: "LATAM tax ID & bank validation + FX", ...READ_LIVE },
    inputDocs: {
      value: "One identifier to check, with or without punctuation, e.g. 'XAXX010101000' or '20-12345678-9'. Use items instead for batches.",
      type: "Document type, which skips auto-detection: RFC, CURP, CLABE (MX); CUIT, CUIL, CBU (AR); RUT or RUT_CL (CL); RUT_UY (UY); NIT (CO); RUC (PE); CPF, CNPJ (BR). Omit to auto-detect.",
    },
    replaceInputProps: LIVE_SCHEMAS.inputProperties.latam_validate_and_fx,
    output: LIVE_SCHEMAS.outputProperties.latam_validate_and_fx,
  },

  br_nfe_xml_auditor: {
    title: "Brazil NF-e XML compressor, access-key decoder and CBS/IBS credit auditor",
    description: [
      "Turns a Brazilian NF-e or NFC-e XML (SEFAZ layout 4.00) into compact JSON (about 90% fewer tokens), checks totals and CFOP consistency, decodes and Mod-11-validates the 44-digit access key, and audits the Tax Reform CBS/IBS credit (LC 214/2025, official RFB Base V0073): highlighted vs expected tax per item, credit at risk, overcharged tax, 2027 and 2033 projections and a ready-to-send supplierAlert.",
      "Use it for accounts-payable intake, input tax-credit recovery and supplier compliance; accepts a single xml, a batch xmls array (up to 25) or direct items without XML.",
      "Do not use it to calculate tax on a service you are issuing (use br_danfse_rtc_generate) or to parse a boleto line (use br_docs_parser).",
      "Read-only and deterministic for parsing and audit; only aiExecutiveBrief may vary. Malformed XML returns HTTP 422 as an error result. Send the supplierAlert yourself with agent_send_email if desired.",
      billing("0.010"),
      ERRORS,
    ].join(" "),
    annotations: { title: "NF-e XML auditor & CBS/IBS credit audit", ...READ_DETERMINISTIC },
    inputDocs: {
      "items[]":
        "One purchased item without XML: { descricao, ncm (8 digits), cClassTrib (6 digits, optional), valor (BRL), vCBS and vIBS highlighted by the supplier (BRL) }.",
    },
    output: {
      success: { type: "boolean", description: "true when the document was parsed and audited." },
      mode: { type: "string", description: "batch_xml_audit or direct_items_rtc_audit for those inputs; absent for a single XML." },
      accessKeyAudit: {
        type: "object",
        description: "Access-key decode: mod11Valid, uf, issueYearMonth, issuerCnpj, model, series, invoiceNumber and emissionType.",
      },
      invoiceSummary: { type: "object", description: "naturezaOperacao, CRT, emitente, destinatario and totals (vProd, vDesc, vFrete, vIPI, vST, vNF, vTotTrib)." },
      items: { type: "array", description: "Line items (NCM, CFOP, quantities, ICMS/IPI/PIS/COFINS) when includeItems is true.", items: { type: "object" } },
      auditReport: { type: "object", description: "status, mathConsistent, cfopScopeConsistent, sefazAuthorized and anomalies." },
      rtcCreditAudit: {
        type: "object",
        description:
          "CBS/IBS credit audit: severity, highlighted vs expected vCBS/vIBS, creditAtRiskBrl, overchargedTaxBrl, projectedCreditAtRisk2027Brl/2033Brl and per-item findings.",
      },
      supplierAlert: {
        type: "object",
        description: "Ready-to-send supplier notice: actionRequired, severity, priority, supplier, invoiceRef, financialImpactBrl, recommendedAction and emailDraft.",
      },
      batchSummary: { type: "object", description: "Batch totals for xmls input: invoices with credit risk, total credit at risk and severity breakdown." },
      supplierAlerts: { type: "array", description: "One supplierAlert per risky invoice in a batch.", items: { type: "object" } },
      invoices: { type: "array", description: "Per-invoice results in a batch.", items: { type: "object" } },
      tokenMetrics: { type: "object", description: "rawXmlTokensEst, cleanJsonTokensEst, tokensSaved and savingsPercent." },
      aiExecutiveBrief: AI_BRIEF_PROP,
      processingTimeMs: PROCESSING_PROP,
      ...FAILURE_PROPS,
    },
  },

  br_danfse_rtc_generate: {
    title: "Brazil CBS/IBS/ISS calculator (RFB Base V0073) and DANFSe generator",
    description: [
      "Calculates the Brazilian Tax Reform taxes on a service (CBS, IBS state and municipal, plus ISS during the 2026-2033 transition) with the official Receita Federal RTC tables (Base V0073: 170 cClassTrib, NCM and NBS mappings, legal reductions of 30%, 50%, 60% and 100%, Simples Nacional Annexes I-V) and renders the printable national DANFSe in HTML, without any Java server.",
      "Use it when issuing or pricing a service invoice (NFS-e), simulating the tax burden of a service by year or regime, or finding the cClassTrib for an NCM, NBS or sector.",
      "Do not use it to audit tax credits on purchase invoices (use br_nfe_xml_auditor) or for payroll and Simples DAS only (use br_tax_payroll_calc).",
      "Read-only and deterministic: the same input always yields the same calculation; it does not transmit anything to a city hall or SEFAZ. Provide xml, or valorServico with discriminacao, or a servico object. Missing amount or an unknown cClassTrib returns success:false with error and message.",
      billing("0.005"),
      ERRORS,
    ].join(" "),
    annotations: { title: "CBS/IBS/ISS calculator & DANFSe generator", ...READ_DETERMINISTIC },
    inputDocs: {
      xml: "Raw NFS-e XML (national standard or ABRASF). When given, provider, taker and values are read from it.",
      valorServico: "Shortcut gross service amount in BRL when no xml or servico object is sent.",
      discriminacao: "Shortcut service description printed on the DANFSe.",
      anexoSimples: "Simples Nacional annex (I to V) used with regime simples_nacional to compute the effective DAS rate.",
    },
    replaceInputProps: LIVE_SCHEMAS.inputProperties.br_danfse_rtc_generate,
    output: LIVE_SCHEMAS.outputProperties.br_danfse_rtc_generate,
  },

  br_docs_parser: {
    title: "Brazil boleto, DARF/utility slip and NF-e access-key decoder",
    description: [
      "Validates and decodes Brazilian payment documents: FEBRABAN bank boleto (47-digit digitable line or 44-digit barcode) with bank, amount and due date (including the post-February-2025 due-date factor rollover), tax and utility slips such as DARF, FGTS, IPTU and utility bills (48-digit line, Mod-10 or Mod-11) with segment and amount, and the 44-digit NF-e access key with Mod-11 check.",
      "Use it before paying a boleto or tax slip, to extract amount and due date from a code typed or OCR'd by a user, or to sanity-check an NF-e key.",
      "Do not use it to parse a full NF-e XML (use br_nfe_xml_auditor) or to create a PIX charge (use br_business_intel).",
      "Read-only and deterministic: it never pays or registers anything. A wrong check digit is not an error: isValid is false and validation.errors explains why.",
      billing("0.008"),
      ERRORS,
    ].join(" "),
    annotations: { title: "Boleto, DARF & NF-e key decoder", ...READ_DETERMINISTIC },
    inputDocs: {
      code: "The digitable line or barcode, with or without spaces and dots: 47 digits (bank boleto), 48 digits (tax or utility slip), or 44 digits (barcode or NF-e key). Required.",
      documentType: "auto (default) detects by length and prefix; force boleto, arrecadacao or nfe_key when a 44-digit code is ambiguous.",
      aiSummary: "Add a short Workers AI summary of the document. Default true.",
    },
    output: {
      success: { type: "boolean", description: "true when the code was parsed." },
      detectedType: { type: "string", description: "BOLETO_BANCARIO, GUIA_ARRECADACAO or CHAVE_NFE." },
      isValid: { type: "boolean", description: "true when every check digit matches." },
      validation: { type: "object", description: "Check-digit details: algorithm, field and general check digits and errors (array of reasons)." },
      boleto: {
        type: "object",
        description: "Bank boleto: bankCode, bankName, currencyCode, amountBRL, amountFormatted, dueDateFactor, dueDate, digitableLine, barcode.",
      },
      arrecadacao: {
        type: "object",
        description: "Tax or utility slip: segmentCode, segmentName, amountBRL, amountFormatted, companyOrAgencyId, freeField, digitableLine, barcode.",
      },
      nfeKey: {
        type: "object",
        description: "NF-e key: accessKey, uf, issueYearMonth, issuerCnpj, model, modelName, series, invoiceNumber, emissionType, numericCode.",
      },
      aiExecutiveBrief: AI_BRIEF_PROP,
      processingTimeMs: PROCESSING_PROP,
      ...FAILURE_PROPS,
    },
  },

  br_tax_payroll_calc: {
    title: "Brazil Simples Nacional, payroll (INSS/IRRF/FGTS) and NFS-e withholding calculator",
    description: [
      "Deterministic Brazilian tax calculator with three independent blocks you can combine in one call: simples (Simples Nacional bracket, effective rate, DAS amount and Fator R annex III vs V decision), payroll (progressive INSS, IRRF choosing legal deductions or the simplified discount, net salary and employer FGTS, also for pro-labore) and nfseRetention (B2B service withholdings: IRRF 1.5%, CSRF/PCC 4.65%, ISS and INSS 11%, and net payable).",
      "Use it for monthly DAS estimates, salary and pro-labore simulations, and to know how much to withhold when paying a service invoice.",
      "Do not use it for Tax Reform CBS/IBS on services (use br_danfse_rtc_generate) or for inflation and loan math (use br_fin_calculators).",
      "Read-only and deterministic, using the current federal tables. Send at least one block; a block missing its required fields returns success:false with error and message.",
      billing("0.008"),
      ERRORS,
    ].join(" "),
    annotations: { title: "Simples, payroll & withholding calculator", ...READ_DETERMINISTIC },
    inputDocs: {
      "simples.anexo": "Simples Nacional annex I to V, or auto to let Fator R pick between III and V. Default auto.",
      "payroll.grossSalary": "Monthly gross salary or pro-labore in BRL. Required for the payroll block.",
      "payroll.dependents": "Number of IRRF dependents. Default 0.",
      "payroll.otherDeductions": "Other legal IRRF deductions in BRL, such as alimony. Default 0.",
      "payroll.isProLabore": "true for partner pro-labore (flat 11% INSS, no FGTS). Default false.",
      "nfseRetention.invoiceAmount": "Gross service invoice amount in BRL. Required for the nfseRetention block.",
      "nfseRetention.issRatePct": "Municipal ISS rate in percent (2 to 5). Default 5.",
      "nfseRetention.retainIss": "true when the taker withholds ISS. Default false.",
      "nfseRetention.isSimplesNacional": "true when the provider is in Simples Nacional, which waives IRRF and CSRF withholding.",
      "nfseRetention.serviceType": "geral (default), consultoria_ti_contabil (professional services) or limpeza_vigilancia (cleaning and security, 11% INSS).",
      aiSummary: "Add a short Workers AI brief. Default true.",
    },
    output: {
      success: { type: "boolean", description: "true when every requested block was calculated." },
      simplesNacional: {
        type: "object",
        description: "requestedAnexo, appliedAnexo, fatorR, fatorRQualified, faixa, nominalRatePct, deductionBRL, effectiveRatePct and estimatedDasBRL.",
      },
      payrollCalc: {
        type: "object",
        description: "grossSalary, inssDiscount, irrfMethodUsed, irrfDiscount, netSalary and fgtsEmployerCost.",
      },
      nfseRetentions: {
        type: "object",
        description: "grossAmount, irrfWithheld, csrfPccWithheld, issWithheld, inssWithheld, totalWithheld and netPayable.",
      },
      aiExecutiveBrief: AI_BRIEF_PROP,
      processingTimeMs: PROCESSING_PROP,
      ...FAILURE_PROPS,
    },
  },

  br_business_intel: {
    title: "Brazil CNPJ KYB dossier, CEP lookup, CPF/CNPJ check and PIX BRCode",
    description: [
      "Brazilian business toolkit in one call: cnpj returns the Receita Federal company dossier (legal and trade name, status, age, capital, size, legal nature, main CNAE, Simples/MEI option, partner count) with a deterministic B2B risk score and recommendation; cep returns address, IBGE municipality code and area code; documentToValidate checks CPF or CNPJ Mod-11 digits offline; pixGenerate builds a Central Bank EMVCo PIX copy-and-paste code with CRC16; pixDecode parses and checksum-audits a PIX code.",
      "Use it for supplier and customer KYB, address enrichment, and creating or checking PIX charges.",
      "Do not use it for other LATAM countries (use latam_validate_and_fx) or for boletos (use br_docs_parser). The risk score is a heuristic, not a credit bureau rating.",
      "Read-only: it never moves money; a generated PIX code is only a payload. cnpj and cep read live public registries and may lag official changes; the other blocks are deterministic. Send at least one block; an unknown CNPJ or CEP returns that block with ok:false instead of failing the call.",
      billing("0.010"),
      ERRORS,
    ].join(" "),
    annotations: { title: "CNPJ KYB, CEP, CPF/CNPJ & PIX toolkit", ...READ_LIVE },
    inputDocs: {
      pixDecode: "A PIX copy-and-paste string starting with 000201 to parse into EMV fields and verify its CRC16.",
    },
    output: LIVE_SCHEMAS.outputProperties.br_business_intel,
  },

  br_fin_calculators: {
    title: "Brazil BCB monetary correction, PTAX conversion and Price/SAC loan simulator",
    description: [
      "Brazilian finance calculators in one call: correction restates a BRL amount between two dates with the official Central Bank SGS series (IPCA, IGPM, INPC, SELIC or CDI); ptax converts BRL, USD, EUR and GBP at the official PTAX closing rate of a date; loan simulates Price (fixed installment) and SAC (constant amortization) schedules with totals and optional month-by-month table.",
      "Use it for contract and rent readjustments, judicial updates, official FX for invoices and accounting, and financing comparisons.",
      "Do not use it for LATAM currencies other than BRL (use latam_validate_and_fx fx) or for taxes (use br_tax_payroll_calc).",
      "Read-only: correction and ptax read live Central Bank data, so months or dates not yet published are skipped or fall back to the previous bulletin; loan is pure math and deterministic. Send at least one block; a Central Bank outage returns that block with ok:false and a reason instead of failing the call.",
      billing("0.005"),
      ERRORS,
    ].join(" "),
    annotations: { title: "BCB correction, PTAX & loan simulator", ...READ_LIVE },
    inputDocs: {
      "correction.amountBRL": "Amount in BRL to restate. Required for the correction block.",
      "correction.index": "Official index: IPCA, IGPM, INPC, SELIC or CDI.",
      "correction.startDate": "Start date YYYY-MM-DD (inclusive month).",
      "correction.endDate": "End date YYYY-MM-DD; must be after startDate.",
      "correction.includeBreakdown": "Return the monthly factors used. Default false.",
      "ptax.amount": "Amount to convert in the source currency.",
      "ptax.from": "Source currency: BRL, USD, EUR or GBP.",
      "ptax.to": "Target currency: BRL, USD, EUR or GBP.",
      "ptax.date": "Optional reference date YYYY-MM-DD; defaults to the latest published bulletin. Weekends and holidays fall back to the previous business day.",
      "loan.principal": "Amount financed in BRL.",
      "loan.monthlyInterestRatePct": "Monthly interest rate in percent, e.g. 1.5.",
      "loan.months": "Number of monthly installments.",
      "loan.system": "PRICE, SAC or BOTH (default) for a side-by-side comparison.",
      "loan.includeSchedule": "Return the full month-by-month table. Default false.",
      aiSummary: "Add a short Workers AI brief. Default true.",
    },
    output: LIVE_SCHEMAS.outputProperties.br_fin_calculators,
  },
};

/**
 * Returns the MCP tools/list entry for a paid tool definition from ./tools.mjs,
 * enriched with title, description, annotations, documented inputSchema and outputSchema.
 */
export function describeTool(tool) {
  const meta = TOOL_METADATA[tool.name];
  if (!meta) {
    return { name: tool.name, description: tool.description, inputSchema: tool.inputSchema };
  }
  return {
    name: tool.name,
    title: meta.title,
    description: meta.description,
    inputSchema: documentInput(tool.inputSchema, meta.inputDocs, meta.replaceInputProps),
    outputSchema: outputSchema(meta.output),
    annotations: meta.annotations,
  };
}
