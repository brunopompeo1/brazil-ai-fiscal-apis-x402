#!/usr/bin/env node
/**
 * 4 Autonomous Agents for Brazil's Tax Reform (LC 214/2025) — Zero Java Server
 * Powered by Official Receita Federal MIT Tables (Base V0073) on Cloudflare Edge.
 *
 * Usage:
 *   Free discovery/demo mode:  node examples/rtc-4-agents-workflow.mjs
 *   Live B2B API Key mode:     B2B_API_KEY=bai_... node examples/rtc-4-agents-workflow.mjs
 */

const DANFSE_BASE = "https://danfse.brunopompeo.com.br";
const NFE_BASE = "https://nfe.brunopompeo.com.br";
const EMAIL_BASE = "https://email.brunopompeo.com.br";
const API_KEY = process.env.B2B_API_KEY || "";

async function callJson(url, body) {
  const headers = { "content-type": "application/json" };
  if (API_KEY) headers["X-API-Key"] = API_KEY;
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  console.log("=== 4 Autonomous Tax Reform Agents (LC 214/2025 — RFB Base V0073 — Zero Java) ===\n");

  if (!API_KEY) {
    console.log("Running in FREE inspection mode (set B2B_API_KEY or use @x402/fetch for live paid execution).\n");
    const tables = await callJson(`${DANFSE_BASE}/tables`);
    console.log("1) Official RFB Tables:", tables.data.metadata?.dbVersion, tables.data.metadata?.counts);

    const danfseSample = await callJson(`${DANFSE_BASE}/sample`);
    console.log("2) Construction 50% Reduction Sample (2027):", {
      cClassTrib: danfseSample.data.calculation?.rtc?.classification?.cClassTrib,
      fundamentacao: danfseSample.data.calculation?.rtc?.classification?.fundamentacaoLegal,
      totalRtcBrl: danfseSample.data.calculation?.rtc?.totalImpostosRtc,
      economiaBrl: danfseSample.data.calculation?.rtc?.economiaReducaoLegal?.totalBrl,
    });

    const nfeSample = await callJson(`${NFE_BASE}/sample`);
    console.log("3) Procurement & Fleet CBS/IBS Credit Audit Sample:", {
      severity: nfeSample.data.output?.rtcCreditAudit?.severity,
      creditAtRiskBrl: nfeSample.data.output?.rtcCreditAudit?.creditAtRiskBrl,
      overchargedTaxBrl: nfeSample.data.output?.rtcCreditAudit?.overchargedTaxBrl,
      supplierAlertSubject: nfeSample.data.output?.supplierAlert?.emailDraft?.subject,
    });
    return;
  }

  // Agent 1 & 3: Procurement & Fleet Credit Audit
  const auditRes = await callJson(`${NFE_BASE}/audit`, {
    referenceYear: 2027,
    supplierEmail: "fiscal@fornecedor-exemplo.com.br",
    items: [
      { descricao: "Oleo Diesel S10 Frota", ncm: "27101921", valor: 15000, vCBS: 0, vIBS: 0 },
      { descricao: "Pneu Caminhao 295/80", ncm: "40112090", valor: 24000, vCBS: 0, vIBS: 0 },
    ],
  });
  console.log("Agent 1 & 3 (Procurement/Fleet):", auditRes.status, auditRes.data.rtcCreditAudit?.severity, "Credit at risk R$", auditRes.data.rtcCreditAudit?.creditAtRiskBrl);

  // Agent 2: Construction Civil Measurement (50% reduction)
  const calcRes = await callJson(`${DANFSE_BASE}/calculate`, {
    ano: 2027,
    setor: "construcao_civil",
    valorServico: 100000,
    discriminacao: "Medicao de Obra Civil Etapa 03",
  });
  console.log("Agent 2 (Construction 50%):", calcRes.status, calcRes.data.rtcCalculation?.rtc?.classification?.cClassTrib, "Saved R$", calcRes.data.rtcCalculation?.rtc?.economiaReducaoLegal?.totalBrl);

  // Agent 4: Billing DANFSe -> dryRun Email
  if (auditRes.data.supplierAlert?.actionRequired) {
    const emailRes = await callJson(`${EMAIL_BASE}/send`, {
      ...auditRes.data.supplierAlert.emailDraft.suggestedPayloadTemplate,
      dryRun: true,
    });
    console.log("Agent 4 (Email dispatch dryRun):", emailRes.status, emailRes.data.success);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
