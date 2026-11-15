"""
Exemplo Python para inspecionar os catálogos e requisitos de pagamento x402
da Suíte Brasil IA (ERPs, sistemas contábeis e scripts Python).

Dependência: pip install requests
"""

import json
import requests

CATALOG_ENDPOINTS = [
    "https://br-nfe-xml-auditor-x402.architect-x402.workers.dev/.well-known/x402",
    "https://br-docs-parser-x402.architect-x402.workers.dev/.well-known/x402",
    "https://br-tax-payroll-calc-x402.architect-x402.workers.dev/.well-known/x402",
    "https://br-business-intel-x402.architect-x402.workers.dev/.well-known/x402",
    "https://br-fin-calculators-x402.architect-x402.workers.dev/.well-known/x402",
    "https://web-enrichment-x402.architect-x402.workers.dev/.well-known/x402",
    "https://agent-guard-x402.architect-x402.workers.dev/.well-known/x402",
]


def discover_suite():
    for url in CATALOG_ENDPOINTS:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        print(f"=== {data.get('serviceName', url)} ===")
        print(json.dumps(data, indent=2, ensure_ascii=False)[:500], "\n")


if __name__ == "__main__":
    discover_suite()
