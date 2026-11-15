/**
 * Exemplo TypeScript/Node 18+ para consultar os requisitos x402
 * e enviar chamadas para a Suíte Brasil IA.
 *
 * Para pagamentos automáticos em produção com carteira Base:
 * npm install @x402/fetch viem
 */

const SERVICES = {
  nfeAudit: "https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/audit",
  docsParser: "https://br-docs-parser-x402.architect-x402.workers.dev/parse",
  taxPayroll: "https://br-tax-payroll-calc-x402.architect-x402.workers.dev/calc",
  businessIntel: "https://br-business-intel-x402.architect-x402.workers.dev/intel",
  finCalc: "https://br-fin-calculators-x402.architect-x402.workers.dev/fin",
};

async function inspectPaymentChallenge(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 402) {
    const paymentHeader = res.headers.get("PAYMENT-REQUIRED");
    const details = paymentHeader
      ? JSON.parse(Buffer.from(paymentHeader, "base64").toString("utf8"))
      : await res.json();

    console.log(`[402 Payment Required] ${url}`);
    console.log(JSON.stringify(details, null, 2));
    return details;
  }

  console.log(`[${res.status}]`, await res.text());
}

async function main() {
  // Exemplo 1: Cálculo de Simples Nacional com otimização de Fator R (28%)
  await inspectPaymentChallenge(SERVICES.taxPayroll, {
    simples: {
      rbt12: 960000,
      monthlyRevenue: 85000,
      anexo: "auto",
      payroll12m: 280000,
    },
    aiSummary: true,
  });

  // Exemplo 2: Decodificação de Boleto FEBRABAN ou Guia DARF/FGTS
  await inspectPaymentChallenge(SERVICES.docsParser, {
    code: "23793381286008301352856000063307789840000015000",
    documentType: "auto",
    aiSummary: true,
  });
}

main().catch(console.error);
