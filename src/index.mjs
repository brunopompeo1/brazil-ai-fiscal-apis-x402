import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { wrapFetchWithPayment, x402Client, decodePaymentResponseHeader } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { toClientEvmSigner } from "@x402/evm";
import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { SUITE_TOOLS } from "./tools.mjs";
import { STATUS_TOOL_METADATA, describeTool } from "./tool-metadata.mjs";

const SUITE_VERSION = "2.7.1";

const SUITE_STATUS_TOOL = {
  name: "brazil_ai_suite_status",
  title: STATUS_TOOL_METADATA.title,
  description: STATUS_TOOL_METADATA.description,
  inputSchema: {
    type: "object",
    properties: {},
  },
  outputSchema: STATUS_TOOL_METADATA.outputSchema,
  annotations: STATUS_TOOL_METADATA.annotations,
};

// structuredContent must be a JSON object; arrays and plain text are wrapped.
function toStructured(parsed) {
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed)) return { items: parsed };
  return { text: String(parsed ?? "") };
}

function normalizePrivateKey(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const prefixed = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(prefixed)) {
    throw new Error("Invalid X402_PRIVATE_KEY format (expected 64 hex chars).");
  }
  return prefixed;
}

function createPaymentClient() {
  const rawKey = process.env.X402_PRIVATE_KEY || process.env.EVM_PRIVATE_KEY || "";
  const apiKey = (process.env.BRAZIL_AI_API_KEY || "").trim();
  const maxUsd = Number(process.env.X402_MAX_USDC_PER_CALL || "0.05");

  if (rawKey) {
    const pk = normalizePrivateKey(rawKey);
    const account = privateKeyToAccount(pk);
    const publicClient = createPublicClient({ chain: base, transport: http() });
    const signer = toClientEvmSigner(account, publicClient);
    const client = new x402Client();
    registerExactEvmScheme(client, { signer, networks: ["eip155:8453"] });
    const payingFetch = wrapFetchWithPayment(fetch, client);

    return {
      mode: "x402_wallet",
      walletAddress: account.address,
      maxUsdcPerCall: Number.isFinite(maxUsd) ? maxUsd : 0.05,
      fetchFn: payingFetch,
      apiKey: apiKey || null,
    };
  }

  if (apiKey) {
    return {
      mode: "b2b_api_key",
      walletAddress: null,
      maxUsdcPerCall: 0,
      fetchFn: fetch,
      apiKey,
    };
  }

  return {
    mode: "discovery_only",
    walletAddress: null,
    maxUsdcPerCall: 0,
    fetchFn: fetch,
    apiKey: null,
  };
}

function decodeBase64Json(b64) {
  try {
    return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

export async function runMcpServer() {
  const paymentCtx = createPaymentClient();

  const server = new Server(
    { name: "brazil-ai-x402-mcp", version: SUITE_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        SUITE_STATUS_TOOL,
        ...SUITE_TOOLS.map((t) => describeTool(t)),
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    if (name === "brazil_ai_suite_status") {
      const status = {
                suite: "Global + LATAM AI & x402 Suite",
                version: SUITE_VERSION,
                totalMicroservices: 12,
                totalPaidTools: SUITE_TOOLS.length,
                network: "eip155:8453 (Base Mainnet)",
                currency: "USDC",
                paymentMode: paymentCtx.mode,
                walletAddress: paymentCtx.walletAddress,
                maxUsdcPerCall: paymentCtx.maxUsdcPerCall,
                services: SUITE_TOOLS.map((t) => ({
                  tool: t.name,
                  method: t.method,
                  endpoint: t.endpoint,
                  priceUsdc: t.priceUsd,
                })),
      };
      return {
        content: [{ type: "text", text: JSON.stringify(status, null, 2) }],
        structuredContent: status,
      };
    }

    const tool = SUITE_TOOLS.find((t) => t.name === name);
    if (!tool) {
      return {
        isError: true,
        content: [{ type: "text", text: JSON.stringify({ error: `Unknown tool: ${name}` }) }],
      };
    }

    const priceNum = Number(tool.priceUsd);
    if (paymentCtx.mode === "x402_wallet" && priceNum > paymentCtx.maxUsdcPerCall) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "x402_spend_cap_exceeded",
              tool: tool.name,
              priceUsdc: tool.priceUsd,
              maxUsdcPerCall: paymentCtx.maxUsdcPerCall,
              hint: "Increase X402_MAX_USDC_PER_CALL env var to authorize this call.",
            }),
          },
        ],
      };
    }

    try {
      let targetUrl = tool.endpoint;
      const headers = { Accept: "application/json" };
      if (paymentCtx.apiKey) {
        headers["Authorization"] = `Bearer ${paymentCtx.apiKey}`;
        headers["X-API-Key"] = paymentCtx.apiKey;
      }

      const fetchOpts = { method: tool.method, headers };
      if (tool.method === "GET") {
        const u = new URL(tool.endpoint);
        for (const [k, v] of Object.entries(args || {})) {
          if (v !== undefined && v !== null) {
            u.searchParams.set(k, String(v));
          }
        }
        targetUrl = u.toString();
      } else {
        headers["Content-Type"] = "application/json";
        fetchOpts.body = JSON.stringify(args || {});
      }

      const res = await paymentCtx.fetchFn(targetUrl, fetchOpts);

      if (res.status === 402) {
        const prHeader = res.headers.get("PAYMENT-REQUIRED");
        const decodedHeader = prHeader ? decodeBase64Json(prHeader) : null;
        let bodyJson = null;
        try {
          bodyJson = await res.json();
        } catch {
          bodyJson = null;
        }
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  status: 402,
                  error: "payment_required_x402",
                  tool: tool.name,
                  priceUsdc: tool.priceUsd,
                  network: "eip155:8453",
                  endpoint: targetUrl,
                  paymentMode: paymentCtx.mode,
                  howToPay:
                    "Set X402_PRIVATE_KEY (Base wallet funded with USDC) or BRAZIL_AI_API_KEY in your MCP server env config.",
                  paymentRequirements: decodedHeader?.accepts || bodyJson?.accepts || bodyJson,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      const textBody = await res.text();
      const paymentResHeader =
        res.headers.get("PAYMENT-RESPONSE") || res.headers.get("X-PAYMENT-RESPONSE");
      let settlement = null;
      if (paymentResHeader) {
        try {
          settlement = decodePaymentResponseHeader(paymentResHeader);
        } catch {
          settlement = decodeBase64Json(paymentResHeader);
        }
      }

      if (!res.ok) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: JSON.stringify({ status: res.status, endpoint: targetUrl, body: textBody }),
            },
          ],
        };
      }

      let parsed;
      try {
        parsed = JSON.parse(textBody);
      } catch {
        parsed = textBody;
      }

      const payload =
        typeof parsed === "string" ? parsed : settlement ? { ...parsed, _x402Settlement: settlement } : parsed;
      const structured = toStructured(payload);
      if (settlement && typeof parsed === "string") structured._x402Settlement = settlement;

      return {
        content: [
          {
            type: "text",
            text: typeof payload === "string" ? payload : JSON.stringify(payload, null, 2),
          },
        ],
        structuredContent: structured,
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "mcp_tool_execution_failed",
              tool: tool.name,
              message: err instanceof Error ? err.message : String(err),
            }),
          },
        ],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
