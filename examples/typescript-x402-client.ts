/**
 * Minimalist TypeScript x402 v2 fetch client for Global + LATAM AI Suite (10 APIs).
 *
 * Modes:
 *  1) Automatic USDC payment on Base: set X402_PRIVATE_KEY (0x...)
 *  2) B2B API Key (PIX monthly plan): set BRAZIL_AI_API_KEY (bai_...)
 *  3) Discovery / dry inspection: leave both empty to inspect HTTP 402 PAYMENT-REQUIRED
 */

import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { toClientEvmSigner } from "@x402/evm";
import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const ENDPOINT = process.env.X402_ENDPOINT || "https://latam.brunopompeo.com.br/latam";

function buildFetch(): typeof fetch {
  const pk = process.env.X402_PRIVATE_KEY as `0x${string}` | undefined;
  if (!pk) return fetch;

  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: base, transport: http() });
  const signer = toClientEvmSigner(account, publicClient);
  const client = new x402Client();
  registerExactEvmScheme(client, { signer, networks: ["eip155:8453"] });
  return wrapFetchWithPayment(fetch, client);
}

async function main() {
  const payingFetch = buildFetch();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.BRAZIL_AI_API_KEY) {
    headers["X-API-Key"] = process.env.BRAZIL_AI_API_KEY;
  }

  const payload = {
    items: [
      { value: "SAT970701NN3", country: "MX", type: "RFC" },
      { value: "002010077777777771", country: "MX", type: "CLABE" },
      { value: "30-50001091-2", country: "AR", type: "CUIT" },
      { value: "60.803.000-K", country: "CL", type: "RUT" },
      { value: "890.903.938-8", country: "CO", type: "NIT" },
      { value: "20131312955", country: "PE", type: "RUC" },
      { value: "211003420017", country: "UY", type: "RUT" },
    ],
    fx: { amount: 500, from: "USD", to: ["MXN", "ARS", "CLP", "COP", "PEN", "UYU", "BRL"] },
  };

  const res = await payingFetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (res.status === 402) {
    const rawHeader = res.headers.get("PAYMENT-REQUIRED");
    const decoded = rawHeader ? JSON.parse(Buffer.from(rawHeader, "base64").toString("utf8")) : await res.json();
    console.log("HTTP 402 Payment Required (x402 v2):");
    console.log(JSON.stringify(decoded, null, 2));
    return;
  }

  const data = await res.json();
  const paymentReceipt = res.headers.get("PAYMENT-RESPONSE");
  console.log("HTTP", res.status, JSON.stringify(data, null, 2));
  if (paymentReceipt) {
    console.log("x402 Settlement:", Buffer.from(paymentReceipt, "base64").toString("utf8"));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
