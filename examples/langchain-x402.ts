/**
 * Ready-to-copy LangChain / Vercel AI SDK tools backed by x402 v2 (USDC on Base) or B2B API Key.
 *
 * Dependencies (install in your app):
 *   npm install @x402/fetch @x402/evm viem zod
 *   # Plus either `ai` (Vercel AI SDK) or `@langchain/core`
 */

import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { toClientEvmSigner } from "@x402/evm";
import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export interface SuiteClientOptions {
  privateKey?: `0x${string}`; // Base USDC wallet for automatic x402 v2 micropayments
  b2bApiKey?: string;         // Optional B2B API Key (skips crypto wallet)
  baseUrl?: string;           // Defaults to unified gateway https://api.brunopompeo.com.br
}

export function createSuiteFetch(opts: SuiteClientOptions = {}) {
  const baseUrl = (opts.baseUrl || "https://api.brunopompeo.com.br").replace(/\/$/, "");
  let fetchImpl: typeof fetch = fetch;

  if (opts.privateKey) {
    const account = privateKeyToAccount(opts.privateKey);
    const publicClient = createPublicClient({ chain: base, transport: http() });
    const signer = toClientEvmSigner(account, publicClient);
    const client = new x402Client();
    registerExactEvmScheme(client, { signer, networks: ["eip155:8453"] });
    fetchImpl = wrapFetchWithPayment(fetch, client);
  }

  return async function callSuite<T = unknown>(
    path: string,
    body?: Record<string, unknown>,
    method: "GET" | "POST" = "POST"
  ): Promise<T> {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (opts.b2bApiKey) headers["X-API-Key"] = opts.b2bApiKey;
    if (method === "POST") headers["Content-Type"] = "application/json";

    const res = await fetchImpl(`${baseUrl}${path}`, {
      method,
      headers,
      body: method === "POST" ? JSON.stringify(body || {}) : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`x402 API error (${res.status}): ${JSON.stringify(data)}`);
    }
    return data as T;
  };
}

/**
 * Drop-in tool definitions compatible with Vercel AI SDK `tool()` and LangChain `DynamicStructuredTool`.
 */
export function buildAgentTools(opts: SuiteClientOptions) {
  const callSuite = createSuiteFetch(opts);

  return {
    latamValidateAndFx: {
      name: "latam_validate_and_fx",
      description:
        "Validate & decode LATAM tax IDs and bank accounts across 7 countries (MX RFC/CURP/CLABE, AR CUIT/CBU, CL RUT, CO NIT, PE RUC, UY RUT, BR CPF/CNPJ) + live FX conversion ($0.008 USDC).",
      execute: async (input: {
        value?: string;
        country?: "MX" | "AR" | "CL" | "CO" | "PE" | "UY" | "BR";
        type?: string;
        items?: Array<{ value: string; country?: string; type?: string }>;
        fx?: { amount?: number; from?: string; to?: string | string[] };
      }) => callSuite("/latam", input, "POST"),
    },
    agentGuard: {
      name: "agent_guard_sanitize",
      description:
        "Detect prompt injection, jailbreaks and mask PII/secrets before feeding untrusted text to an LLM ($0.008 USDC).",
      execute: async (input: { text: string; maskPii?: boolean; deepScan?: boolean }) =>
        callSuite("/guard", input, "POST"),
    },
    webEnrichment: {
      name: "web_enrichment_clean",
      description:
        "Fetch and clean any URL into LLM-ready Markdown, JSON tables and JSON-LD with up to 85% token savings ($0.002 USDC).",
      execute: async (input: { url: string; format?: "json" | "markdown" }) => {
        const qs = new URLSearchParams({ url: input.url, format: input.format || "json" });
        return callSuite(`/clean?${qs.toString()}`, undefined, "GET");
      },
    },
  };
}

// Example usage (run with: npx tsx examples/langchain-x402.ts)
if (process.argv[1]?.endsWith("langchain-x402.ts")) {
  const tools = buildAgentTools({
    privateKey: process.env.X402_PRIVATE_KEY as `0x${string}` | undefined,
    b2bApiKey: process.env.BRAZIL_AI_API_KEY,
  });

  tools.latamValidateAndFx
    .execute({
      items: [
        { value: "SAT970701NN3", country: "MX", type: "RFC" },
        { value: "30-50001091-2", country: "AR", type: "CUIT" },
      ],
      fx: { amount: 100, from: "USD", to: ["MXN", "ARS", "BRL"] },
    })
    .then((res) => console.log(JSON.stringify(res, null, 2)))
    .catch((err) => console.error(err.message));
}
