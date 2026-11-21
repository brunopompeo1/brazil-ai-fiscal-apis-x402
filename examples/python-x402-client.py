"""
Minimalist Python client for Global + LATAM AI & x402 API Suite (10 Edge APIs).
Zero external dependencies (uses Python stdlib urllib).

Supports:
  - Free discovery & /sample preview
  - Automatic HTTP 402 PAYMENT-REQUIRED Base64 decoding
  - B2B API Key authentication via BRAZIL_AI_API_KEY env var
  - Pre-signed x402 v2 PAYMENT-SIGNATURE header via X402_PAYMENT_SIGNATURE env var
    (or pair with Coinbase x402 Python SDK / httpx middleware for automatic EIP-712 signing)
"""

import base64
import json
import os
import urllib.error
import urllib.request
from typing import Any, Dict, Optional

BASE_URL = os.getenv("X402_BASE_URL", "https://api.brunopompeo.com.br").rstrip("/")
B2B_API_KEY = os.getenv("BRAZIL_AI_API_KEY", "").strip()
PAYMENT_SIGNATURE = os.getenv("X402_PAYMENT_SIGNATURE", "").strip()


def call_x402_api(
    path: str,
    payload: Optional[Dict[str, Any]] = None,
    method: str = "POST",
) -> Dict[str, Any]:
    url = f"{BASE_URL}{path}"
    headers = {
        "Accept": "application/json",
        "User-Agent": "x402-python-agent/2.5",
    }
    if B2B_API_KEY:
        headers["X-API-Key"] = B2B_API_KEY
    if PAYMENT_SIGNATURE:
        headers["PAYMENT-SIGNATURE"] = PAYMENT_SIGNATURE

    body_bytes = None
    if method.upper() == "POST":
        headers["Content-Type"] = "application/json"
        body_bytes = json.dumps(payload or {}).encode("utf-8")

    req = urllib.request.Request(url, data=body_bytes, headers=headers, method=method.upper())
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read().decode("utf-8")
            result = json.loads(raw)
            receipt = resp.headers.get("PAYMENT-RESPONSE")
            if receipt:
                result["_x402Settlement"] = json.loads(base64.b64decode(receipt).decode("utf-8"))
            return {"status": resp.status, "data": result}
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        if exc.code == 402:
            pr_header = exc.headers.get("PAYMENT-REQUIRED")
            requirements = (
                json.loads(base64.b64decode(pr_header).decode("utf-8"))
                if pr_header
                else json.loads(body)
            )
            return {
                "status": 402,
                "paymentRequired": True,
                "requirements": requirements,
                "hint": "Sign accepts[0] via EIP-712 (USDC on Base eip155:8453) and retry with PAYMENT-SIGNATURE header, or set BRAZIL_AI_API_KEY.",
            }
        return {"status": exc.code, "error": body}


if __name__ == "__main__":
    print("1) Checking unified gateway health (free):")
    print(json.dumps(call_x402_api("/health", method="GET"), indent=2))

    print("\n2) Calling POST /latam (7-country validator + live FX):")
    latam_response = call_x402_api(
        "/latam",
        payload={
            "items": [
                {"value": "SAT970701NN3", "country": "MX", "type": "RFC"},
                {"value": "002010077777777771", "country": "MX", "type": "CLABE"},
                {"value": "30-50001091-2", "country": "AR", "type": "CUIT"},
                {"value": "60.803.000-K", "country": "CL", "type": "RUT"},
                {"value": "890.903.938-8", "country": "CO", "type": "NIT"},
                {"value": "20131312955", "country": "PE", "type": "RUC"},
                {"value": "211003420017", "country": "UY", "type": "RUT"},
            ],
            "fx": {"amount": 1000, "from": "USD", "to": ["MXN", "ARS", "CLP", "COP", "PEN", "UYU", "BRL"]},
        },
        method="POST",
    )
    print(json.dumps(latam_response, indent=2, ensure_ascii=False))
