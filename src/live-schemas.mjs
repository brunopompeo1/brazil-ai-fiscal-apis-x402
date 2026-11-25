// AUTO-GENERATED from the live /mcp manifests of fin, guard, latam, intel and danfse
// (*.brunopompeo.com.br, TDQS manifest v2.7.1). Do not edit by hand; regenerate instead.
// Metadata only: it never changes prices, endpoints or the x402 v2 payment contract.
export const LIVE_SCHEMAS = {
  "outputProperties": {
    "br_fin_calculators": {
      "success": {
        "type": "boolean",
        "description": "false when the call was rejected before any calculation ran. Absent on success paths that return success:true."
      },
      "monetaryCorrection": {
        "type": "object",
        "description": "The correction result. Check its ok field before reading the amounts.",
        "properties": {
          "ok": {
            "type": "boolean",
            "description": "true when the BCB SGS series answered for the requested window; false when BCB was unreachable or the index was rejected."
          },
          "error": {
            "type": "string",
            "description": "Portuguese reason, present only when ok is false (invalid index or BCB SGS HTTP failure)."
          },
          "index": {
            "type": "string",
            "description": "Index actually applied; echoes the index argument."
          },
          "indexDescription": {
            "type": "string",
            "description": "Human-readable name of the BCB series applied."
          },
          "sgsSeriesId": {
            "type": "number",
            "description": "Numeric BCB SGS series identifier used, for example 433 for IPCA."
          },
          "startDate": {
            "type": "string",
            "description": "Start of the window actually applied, YYYY-MM-DD."
          },
          "endDate": {
            "type": "string",
            "description": "End of the window actually applied, YYYY-MM-DD."
          },
          "originalAmountBRL": {
            "type": "number",
            "description": "Nominal input amount in BRL."
          },
          "correctedAmountBRL": {
            "type": "number",
            "description": "Restated amount in BRL, rounded to 2 decimals."
          },
          "correctionDeltaBRL": {
            "type": "number",
            "description": "Difference between corrected and original amount in BRL."
          },
          "accumulatedFactor": {
            "type": "number",
            "description": "Compounded multiplier applied to the original amount (1.09452 means +9.452%)."
          },
          "accumulatedPct": {
            "type": "number",
            "description": "Accumulated variation over the window in percent (9.452 means +9.452%)."
          },
          "monthsCount": {
            "type": "number",
            "description": "Number of monthly observations compounded; lower than expected means BCB has not published the tail months yet."
          },
          "monthlyBreakdown": {
            "type": "array",
            "description": "Month-by-month detail, present only when includeBreakdown is true."
          }
        }
      },
      "aiExecutiveBrief": {
        "type": "string",
        "description": "One-sentence Portuguese summary of the result. Omitted when aiSummary is false."
      },
      "suggestedNextSteps": {
        "type": "array",
        "description": "Chaining hints for autonomous agents: sibling paid APIs in the same suite that are commonly called right after this one. Purely advisory, never required.",
        "items": {
          "type": "object"
        }
      },
      "processingTimeMs": {
        "type": "number",
        "description": "Edge processing time in milliseconds, excluding payment settlement."
      },
      "error": {
        "type": "string",
        "description": "Stable machine-readable failure code. Common values: 'bad_request' (malformed JSON or missing operation), 'invalid_payment' / 'settlement_failed' (x402 verification or settlement refused, returned with HTTP 402), 'B2B_KEY_INVALID' and 'B2B_QUOTA_EXCEEDED' (B2B X-API-Key path)."
      },
      "message": {
        "type": "string",
        "description": "Human-readable explanation of the failure, in Portuguese. Safe to log or surface to a human operator."
      },
      "ptaxConversion": {
        "type": "object",
        "description": "The conversion result. Check its ok field before reading the amounts.",
        "properties": {
          "ok": {
            "type": "boolean",
            "description": "true when every required PTAX bulletin was found; false when BCB had no quote for the window."
          },
          "error": {
            "type": "string",
            "description": "Portuguese reason, present only when ok is false (no published quote, or BCB Olinda HTTP failure)."
          },
          "from": {
            "type": "string",
            "description": "Source currency actually applied."
          },
          "to": {
            "type": "string",
            "description": "Target currency actually applied."
          },
          "inputAmount": {
            "type": "number",
            "description": "Amount received in the source currency."
          },
          "convertedAmount": {
            "type": "number",
            "description": "Result in the target currency, rounded to 2 decimals."
          },
          "brlEquivalent": {
            "type": "number",
            "description": "Intermediate value of the operation in BRL, rounded to 2 decimals."
          },
          "ptaxQuotes": {
            "type": "object",
            "description": "Map keyed by currency code holding the exact bulletin used for each non-BRL leg.",
            "additionalProperties": {
              "type": "object",
              "description": "Official PTAX bulletin actually applied for one currency leg.",
              "properties": {
                "currency": {
                  "type": "string",
                  "description": "ISO 4217 code of the quoted currency (USD, EUR or GBP)."
                },
                "buyRate": {
                  "type": "number",
                  "description": "PTAX buy rate (cotacao de compra) in BRL per unit of the quoted currency."
                },
                "sellRate": {
                  "type": "number",
                  "description": "PTAX sell rate (cotacao de venda) in BRL per unit; this is the rate used for conversion."
                },
                "bulletinType": {
                  "type": "string",
                  "description": "BCB bulletin the quote came from. 'Fechamento PTAX' is the official closing bulletin and is preferred; intraday bulletins are used only when no closing bulletin exists yet."
                },
                "timestamp": {
                  "type": "string",
                  "description": "Bulletin publication timestamp as returned by BCB Olinda (Brasilia local time)."
                }
              }
            }
          }
        }
      },
      "loanSimulation": {
        "type": "object",
        "description": "Simulation result. The price and sac blocks appear only for the requested system.",
        "properties": {
          "principal": {
            "type": "number",
            "description": "Financed amount actually applied, in BRL."
          },
          "monthlyInterestRatePct": {
            "type": "number",
            "description": "Monthly interest rate actually applied, in percent."
          },
          "months": {
            "type": "number",
            "description": "Term actually applied, in months, after flooring and clamping."
          },
          "price": {
            "type": "object",
            "description": "Price system result (constant installment). Present when system is PRICE or BOTH."
          },
          "sac": {
            "type": "object",
            "description": "SAC system result (constant principal). Present when system is SAC or BOTH."
          }
        }
      }
    },
    "agent_guard_sanitize": {
      "isSafe": {
        "type": "boolean",
        "description": "Convenience flag, true only when threatLevel is 'clean'. This is the single boolean to branch on when deciding whether to forward the text to a model."
      },
      "threatLevel": {
        "type": "string",
        "enum": [
          "clean",
          "suspicious",
          "critical"
        ],
        "description": "Verdict band. 'clean' means no rule fired and the semantic pass did not object; 'suspicious' means riskScore reached 40 or exactly one rule fired, which warrants human review; 'critical' means riskScore reached 75 or at least two rules fired, which should block the text."
      },
      "riskScore": {
        "type": "number",
        "minimum": 0,
        "maximum": 100,
        "description": "Aggregate risk from 0 to 100, capped at 100. It sums the weight of each matched injection rule, plus 85 for a hostile Base64 payload and 75 for an 'unsafe' model verdict."
      },
      "detectedPatterns": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Identifiers of every signal that fired, for example 'ignore_previous_instructions', 'system_prompt_override', 'dan_or_jailbreak_persona', 'safety_guardrail_bypass', 'special_token_delimiter_injection', 'secret_or_prompt_exfiltration', 'unauthorized_tool_execution' and 'llama_guard_semantic_unsafe'. Empty on clean text."
      },
      "aiAudit": {
        "type": "object",
        "description": "Outcome of the Llama Guard 3 8B semantic pass. Always present; when the deep pass did not run, executed is false and verdict is 'skipped'.",
        "properties": {
          "executed": {
            "type": "boolean",
            "description": "true when the model actually returned a verdict. It is false both when the deep pass was disabled and when the model call failed, which is a soft degradation, not an error."
          },
          "model": {
            "type": "string",
            "description": "Model identifier used for the semantic pass, currently '@cf/meta/llama-guard-3-8b'."
          },
          "verdict": {
            "type": "string",
            "enum": [
              "safe",
              "unsafe",
              "skipped"
            ],
            "description": "'unsafe' means the model classified the text as a policy violation or injection attempt and added 75 points to riskScore; 'safe' means it cleared the text; 'skipped' means no model verdict was obtained, so riskScore reflects the pattern engine alone."
          },
          "flaggedCategories": {
            "type": "array",
            "description": "Llama Guard hazard codes (S1 to S13) when the model returned them, otherwise the fallback label 'PROMPT_INJECTION_OR_POLICY_VIOLATION'. Empty when the verdict is 'safe' or 'skipped'."
          }
        }
      },
      "sanitizedText": {
        "type": "string",
        "description": "The text with every PII and secret match swapped for a stable placeholder such as [REDACTED_EMAIL], [REDACTED_CPF], [REDACTED_CNPJ], [REDACTED_CARD], [REDACTED_API_KEY] or [REDACTED_PRIVATE_KEY]. When masking is off it is byte-identical to the input. Injection wording itself is never rewritten, only reported, so a 'critical' verdict must still be blocked rather than forwarded."
      },
      "piiMaskedCount": {
        "type": "number",
        "description": "Number of individual PII or secret occurrences replaced. Zero when masking is off or nothing matched."
      },
      "estimatedTokensSaved": {
        "type": "number",
        "description": "Rough token count avoided downstream by the redaction, derived from characters removed and the number of placeholders. Advisory only."
      },
      "processingTimeMs": {
        "type": "number",
        "description": "Edge processing time in milliseconds, excluding payment settlement. Mirrored in the x-processing-time-ms response header."
      },
      "suggestedNextSteps": {
        "type": "array",
        "description": "Chaining hints for autonomous agents: sibling paid APIs in the same suite that are commonly called right after this one. Purely advisory, never required.",
        "items": {
          "type": "object"
        }
      },
      "success": {
        "type": "boolean",
        "description": "Present and false only on a rejected call. A successful scan omits this field entirely and returns the analysis fields instead."
      },
      "error": {
        "type": "string",
        "description": "Stable machine-readable failure code. Common values: 'bad_request' (malformed JSON, or 'text' missing, empty or not a string), 'invalid_payment' / 'settlement_failed' (x402 verification or settlement refused, returned with HTTP 402), 'B2B_KEY_INVALID' and 'B2B_QUOTA_EXCEEDED' (B2B X-API-Key path), 'invalid_wafermap_signature' (marketplace HMAC path)."
      },
      "message": {
        "type": "string",
        "description": "Human-readable explanation of the failure, in Portuguese. Safe to log or surface to a human operator."
      }
    },
    "latam_validate_and_fx": {
      "ok": {
        "type": "boolean",
        "description": "true when the request was processed and paid for. It does not mean the documents were valid: read results[].valid for that."
      },
      "results": {
        "type": "array",
        "maxItems": 0,
        "description": "Always empty for this tool, since no identifier was submitted.",
        "items": {
          "type": "object",
          "description": "One checked identifier. The array is in input order, so you can zip it to your request."
        }
      },
      "summary": {
        "type": "object",
        "description": "Aggregate counters, so a batch can be triaged without walking the results array.",
        "properties": {
          "total": {
            "type": "number",
            "description": "How many identifiers were checked."
          },
          "valid": {
            "type": "number",
            "description": "How many passed."
          },
          "invalid": {
            "type": "number",
            "description": "How many failed."
          },
          "countriesDetected": {
            "type": "array",
            "description": "Distinct country codes found across the results."
          },
          "fxIncluded": {
            "type": "boolean",
            "description": "Whether an FX block is present in this response."
          }
        }
      },
      "warnings": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Non-fatal notes, such as a batch truncated at 100 items or a request that carried nothing to check."
      },
      "suggestedNextSteps": {
        "type": "array",
        "description": "Chaining hints for autonomous agents: sibling paid APIs commonly called right after this one, selected from what was actually found in the results. Purely advisory, never required.",
        "items": {
          "type": "object"
        }
      },
      "meta": {
        "type": "object",
        "description": "Provenance of the call, worth logging.",
        "properties": {
          "service": {
            "type": "string",
            "description": "Service identifier that produced the result."
          },
          "version": {
            "type": "string",
            "description": "Service version."
          },
          "authMode": {
            "type": "string",
            "enum": [
              "x402",
              "b2b-api-key"
            ],
            "description": "How the call was paid for: a per-call x402 settlement on Base, or a B2B X-API-Key quota."
          },
          "processingTimeMs": {
            "type": "number",
            "description": "Edge processing time in milliseconds, excluding payment settlement."
          }
        }
      },
      "error": {
        "type": "string",
        "description": "Stable machine-readable failure code, present only on a rejected call. Common values: 'invalid_payment' and 'settlement_failed' (x402 verification or settlement refused, returned with HTTP 402), 'B2B_KEY_INVALID' and 'B2B_QUOTA_EXCEEDED' (B2B X-API-Key path). An invalid document is NOT an error: the call succeeds with valid false and a populated errors array."
      },
      "message": {
        "type": "string",
        "description": "Human-readable explanation of the failure. Safe to log or surface to a human operator."
      },
      "fx": {
        "type": "object",
        "description": "Live FX conversion result.",
        "properties": {
          "ok": {
            "type": "boolean",
            "description": "true when rates were resolved, including from the reference fallback."
          },
          "base": {
            "type": "string",
            "description": "Source currency actually used, ISO 4217."
          },
          "amount": {
            "type": "number",
            "description": "Source amount actually converted."
          },
          "conversions": {
            "type": "object",
            "description": "Map keyed by target currency code. Each entry carries amount (the converted value), rate (target units per one base unit) and inverseRate (base units per one target unit)."
          },
          "supportedCurrencies": {
            "type": "array",
            "description": "Every currency this endpoint can convert."
          },
          "source": {
            "type": "string",
            "enum": [
              "live-edge-cache",
              "live-upstream",
              "fallback-reference"
            ],
            "description": "Provenance of the rates. 'fallback-reference' means every live upstream timed out and static reference rates were used, so the figures are indicative only and should not settle a payment. Check this field before booking anything."
          },
          "updatedAt": {
            "type": "string",
            "description": "ISO 8601 timestamp of the rate set."
          },
          "warnings": {
            "type": "array",
            "description": "Non-fatal notes, such as an unsupported currency code that was replaced by the default."
          }
        }
      }
    },
    "br_business_intel": {
      "success": {
        "type": "boolean",
        "description": "true when the request was processed and paid for, independently of the checksum verdict."
      },
      "companyDossier": {
        "type": "object",
        "description": "Corporate dossier assembled from the public Receita Federal CNPJ base. Always check valid and found before reading the remaining fields.",
        "properties": {
          "valid": {
            "type": "boolean",
            "description": "false when the CNPJ fails the Mod-11 check digits, in which case no lookup was attempted."
          },
          "found": {
            "type": "boolean",
            "description": "false when the CNPJ is mathematically valid but absent from the public base or the upstream lookup returned a non-200 status."
          },
          "error": {
            "type": "string",
            "description": "Portuguese reason, present only when valid is false or found is false."
          },
          "cnpj": {
            "type": "string",
            "description": "The 14 digits of the CNPJ, stripped of punctuation."
          },
          "razaoSocial": {
            "type": "string",
            "description": "Registered legal name of the company. Null when the base omits it."
          },
          "nomeFantasia": {
            "type": "string",
            "description": "Trade name. Null when the company never registered one."
          },
          "situacaoCadastral": {
            "type": "string",
            "description": "Registration status in upper case, for example ATIVA, BAIXADA, SUSPENSA or INAPTA. Anything other than ATIVA drives the recommendation to DO_NOT_TRANSACT_INACTIVE_CNPJ."
          },
          "dataInicioAtividade": {
            "type": "string",
            "description": "Date operations began, YYYY-MM-DD."
          },
          "companyAgeYears": {
            "type": "number",
            "description": "Whole years between the start year and the current year."
          },
          "capitalSocialBRL": {
            "type": "number",
            "description": "Declared share capital in BRL."
          },
          "porte": {
            "type": "string",
            "description": "Size bracket declared to Receita Federal, for example 'MICRO EMPRESA' or 'DEMAIS'."
          },
          "naturezaJuridica": {
            "type": "string",
            "description": "Legal nature description, for example 'Sociedade Empresária Limitada'."
          },
          "cnaePrincipal": {
            "type": "object",
            "description": "Primary economic activity code."
          },
          "cnaesSecundariosCount": {
            "type": "number",
            "description": "How many secondary CNAE codes the company registered."
          },
          "regimeTributario": {
            "type": "object",
            "description": "Tax-regime flags as recorded in the public base."
          },
          "endereco": {
            "type": "object",
            "description": "Registered head-office address."
          },
          "quadroSocietarioCount": {
            "type": "number",
            "description": "Total number of partners and officers in the registered cap table."
          },
          "sociosPrincipais": {
            "type": "array",
            "description": "Up to the first five partners or officers."
          },
          "b2bRiskAssessment": {
            "type": "object",
            "description": "Deterministic credit-and-compliance score computed at the edge from registration status, share capital and tenure. It is a rules-based triage signal, not a credit bureau score."
          }
        }
      },
      "aiExecutiveBrief": {
        "type": "string",
        "description": "Portuguese executive opinion on transacting with this company. Omitted when the CNPJ was not found."
      },
      "suggestedNextSteps": {
        "type": "array",
        "description": "Chaining hints for autonomous agents: sibling paid APIs in the same suite that are commonly called right after this one. Purely advisory, never required.",
        "items": {
          "type": "object"
        }
      },
      "processingTimeMs": {
        "type": "number",
        "description": "Edge processing time in milliseconds, excluding payment settlement. Mirrored in the X-Processing-Time-Ms response header."
      },
      "error": {
        "type": "string",
        "description": "Stable machine-readable failure code, present only when the call itself was rejected. Common values: 'bad_request' (malformed JSON or no operation supplied), 'invalid_payment' / 'settlement_failed' (x402 verification or settlement refused, returned with HTTP 402), 'B2B_KEY_INVALID' and 'B2B_QUOTA_EXCEEDED' (B2B X-API-Key path), 'invalid_wafermap_signature' (marketplace HMAC path). A document that simply fails validation is NOT an error: the call returns success:true with valid:false inside the result block."
      },
      "message": {
        "type": "string",
        "description": "Human-readable explanation of the failure, in Portuguese. Safe to log or surface to a human operator."
      },
      "locationIntel": {
        "type": "object",
        "description": "Postal-code intelligence. The primary source is ViaCEP; on failure it falls back to a second public base, and the fallback payload carries coordinates but omits regiao, siafiCode, ddd and complemento.",
        "properties": {
          "valid": {
            "type": "boolean",
            "description": "false when the input did not contain exactly 8 digits, in which case no lookup was attempted."
          },
          "found": {
            "type": "boolean",
            "description": "Present and false only when both sources failed to resolve an otherwise well-formed CEP."
          },
          "error": {
            "type": "string",
            "description": "Portuguese reason, present only when valid is false or found is false."
          },
          "cep": {
            "type": "string",
            "description": "The postal code as returned by the source, usually formatted NNNNN-NNN."
          },
          "logradouro": {
            "type": "string",
            "description": "Street name. Null for codes that cover a whole municipality."
          },
          "complemento": {
            "type": "string",
            "description": "Range or side-of-street complement, when the source provides one."
          },
          "bairro": {
            "type": "string",
            "description": "District."
          },
          "cidade": {
            "type": "string",
            "description": "Municipality name."
          },
          "uf": {
            "type": "string",
            "description": "Two-letter state code."
          },
          "regiao": {
            "type": "string",
            "description": "Macro-region, for example Sudeste or Sul. Primary source only."
          },
          "ibgeCode": {
            "type": "string",
            "description": "IBGE municipality code, the key to join with any Brazilian public statistical dataset. Primary source only."
          },
          "ddd": {
            "type": "string",
            "description": "Telephone area code. Primary source only."
          },
          "siafiCode": {
            "type": "string",
            "description": "SIAFI municipality code used by federal accounting systems. Primary source only."
          },
          "coordinates": {
            "type": "object",
            "description": "Latitude and longitude, returned by the fallback source only."
          }
        }
      },
      "documentValidation": {
        "type": "object",
        "description": "The audit verdict.",
        "properties": {
          "type": {
            "type": "string",
            "enum": [
              "CPF",
              "CNPJ",
              "UNKNOWN"
            ],
            "description": "Document kind inferred from the digit count. 'UNKNOWN' means the input had neither 11 nor 14 digits."
          },
          "document": {
            "type": "string",
            "description": "The input reduced to digits only."
          },
          "isValid": {
            "type": "boolean",
            "description": "true only when the Mod-11 check digits match and the number is not a repeated-digit sequence."
          },
          "error": {
            "type": "string",
            "description": "Portuguese explanation, present only when type is 'UNKNOWN'."
          }
        }
      },
      "pixPayload": {
        "type": "object",
        "description": "The generated PIX payload.",
        "properties": {
          "brcode": {
            "type": "string",
            "description": "The complete copy-and-paste string, checksum included. Paste it into a banking app or encode it as a QR code."
          },
          "crc16": {
            "type": "string",
            "description": "The four hexadecimal CRC16-CCITT digits appended to the payload."
          },
          "crcValid": {
            "type": "boolean",
            "description": "Always true here, because the checksum was computed rather than read."
          },
          "merchantName": {
            "type": "string",
            "description": "Receiver name as actually encoded, after accent stripping and truncation to 25 characters."
          },
          "merchantCity": {
            "type": "string",
            "description": "Receiver city as actually encoded, after accent stripping and truncation to 15 characters."
          },
          "txid": {
            "type": "string",
            "description": "Transaction reference as actually encoded, after cleaning and truncation to 25 characters."
          },
          "amountFormatted": {
            "type": "string",
            "description": "The amount rendered in Brazilian format, for example 'R$ 149,90', or the literal 'Valor Aberto' when the code carries no fixed amount."
          }
        }
      },
      "pixDecoded": {
        "type": "object",
        "description": "The decoded payload. Check valid before trusting any extracted field.",
        "properties": {
          "valid": {
            "type": "boolean",
            "description": "true only when the recomputed checksum matches the one carried by the code. On a malformed payload this is the only field present besides error."
          },
          "error": {
            "type": "string",
            "description": "Portuguese reason, present only when the string was too short or lacked the '6304' tag."
          },
          "crcValid": {
            "type": "boolean",
            "description": "Same verdict as valid, exposed separately for callers that branch on checksum integrity alone."
          },
          "providedCrc": {
            "type": "string",
            "description": "The four hexadecimal checksum digits carried by the code, upper-cased."
          },
          "calculatedCrc": {
            "type": "string",
            "description": "The checksum recomputed from the payload. Differing from providedCrc is the signature of a tampered or truncated code."
          },
          "pixKey": {
            "type": "string",
            "description": "Receiver PIX key from EMVCo subtag 26-01. Null when the code omits it."
          },
          "description": {
            "type": "string",
            "description": "Free-text note from EMVCo subtag 26-02. Null when absent."
          },
          "merchantName": {
            "type": "string",
            "description": "Receiver name from EMVCo tag 59. Null when absent."
          },
          "merchantCity": {
            "type": "string",
            "description": "Receiver city from EMVCo tag 60. Null when absent."
          },
          "amountBRL": {
            "type": "number",
            "description": "Charge amount in BRL from EMVCo tag 54. Null for an open-value code the payer fills in."
          },
          "countryCode": {
            "type": "string",
            "description": "Country code from EMVCo tag 58, defaulting to 'BR'."
          }
        }
      }
    },
    "br_danfse_rtc_generate": {
      "success": {
        "type": "boolean",
        "description": "Present and false only on a rejected call."
      },
      "status": {
        "type": "string",
        "enum": [
          "GENERATED",
          "CALCULATED"
        ],
        "description": "'GENERATED' when the HTML document is included, 'CALCULATED' when generateHtml was set to false."
      },
      "meta": {
        "type": "object",
        "description": "Provenance of the calculation, worth logging for audit purposes.",
        "properties": {
          "service": {
            "type": "string",
            "description": "Service identifier that produced the result."
          },
          "version": {
            "type": "string",
            "description": "Service version."
          },
          "processingTimeMs": {
            "type": "number",
            "description": "Edge processing time in milliseconds, excluding payment settlement."
          },
          "rfbDbVersion": {
            "type": "string",
            "description": "Version of the official Receita Federal table set applied, for example 'V0073'."
          },
          "legalSource": {
            "type": "string",
            "description": "Normative reference and licence of the official tables."
          },
          "zeroJavaServer": {
            "type": "boolean",
            "description": "Always true: the official RTC engine runs entirely at the edge, with no Java service behind it."
          }
        }
      },
      "danfse": {
        "type": "object",
        "description": "The printable document. Present only when generateHtml is true.",
        "properties": {
          "chaveAcesso": {
            "type": "string",
            "description": "Access key printed on the document, echoing the input or the demonstration placeholder."
          },
          "numero": {
            "type": "string",
            "description": "Document number printed on the document."
          },
          "codigoVerificacao": {
            "type": "string",
            "description": "Verification code printed on the document."
          },
          "html": {
            "type": "string",
            "description": "Complete self-contained HTML of the DANFSe, with inline styles and no external assets. Render it, print it to PDF, or email it as-is."
          }
        }
      },
      "rtcCalculation": {
        "type": "object",
        "description": "The full RTC and ISS calculation for the main service line.",
        "properties": {
          "baseCalculo": {
            "type": "number",
            "description": "Tax base in BRL: valorServico minus descontoIncondicionado, floored at zero."
          },
          "iss": {
            "type": "object",
            "description": "Municipal ISS, including the LC 214/2025 phase-down."
          },
          "rtc": {
            "type": "object",
            "description": "CBS and IBS block computed from the official Receita Federal tables."
          },
          "valorLiquidoEstimado": {
            "type": "number",
            "description": "Estimated net amount to receive in BRL: valorServico less withheld ISS when retencaoIss is true."
          }
        }
      },
      "batchRtcCalculation": {
        "type": "object",
        "description": "Per-line results and consolidated totals. Present only when itens was supplied.",
        "properties": {
          "itemsCount": {
            "type": "number",
            "description": "How many lines were actually priced, at most 50."
          },
          "ano": {
            "type": "number",
            "description": "Transition year applied to every line."
          },
          "regime": {
            "type": "string",
            "description": "Regime applied to every line."
          },
          "dbVersion": {
            "type": "string",
            "description": "Version of the official table set applied."
          },
          "totals": {
            "type": "object",
            "description": "Consolidated totals across all lines, using the official Receita Federal field names."
          },
          "items": {
            "type": "array",
            "description": "One entry per priced line, in input order."
          }
        }
      },
      "suggestedNextSteps": {
        "type": "array",
        "description": "Chaining hints for autonomous agents: sibling paid APIs in the same suite that are commonly called right after this one. Purely advisory, never required.",
        "items": {
          "type": "object"
        }
      },
      "error": {
        "type": "string",
        "description": "Stable machine-readable failure code. Common values: 'invalid_payment' / 'settlement_failed' (x402 verification or settlement refused, returned with HTTP 402), 'B2B_KEY_INVALID' and 'B2B_QUOTA_EXCEEDED' (B2B X-API-Key path). A classification that cannot be resolved is NOT an error: the call succeeds with full taxation applied and rtcCalculation.rtc.warning set."
      },
      "message": {
        "type": "string",
        "description": "Human-readable explanation of the failure, in Portuguese. Safe to log or surface to a human operator."
      }
    }
  },
  "inputProperties": {
    "br_danfse_rtc_generate": {
      "prestador": {
        "type": "object",
        "description": "Service provider identification, printed on the DANFSe. Required for a document that is meant to be issued or archived.",
        "properties": {
          "cnpjCpf": {
            "type": "string",
            "description": "Provider CNPJ (14 digits) or CPF (11 digits), digits only."
          },
          "razaoSocial": {
            "type": "string",
            "description": "Provider registered legal name."
          },
          "nomeFantasia": {
            "type": "string",
            "description": "Provider trade name, optional."
          },
          "municipio": {
            "type": "string",
            "description": "Provider municipality, which is the ISS levy location for most LC 116 services."
          },
          "uf": {
            "type": "string",
            "description": "Provider two-letter state code."
          },
          "inscricaoMunicipal": {
            "type": "string",
            "description": "Provider municipal taxpayer registration, optional."
          },
          "simplesNacional": {
            "type": "boolean",
            "description": "When true and no explicit regime is supplied, the calculation switches to 'simples_nacional'."
          }
        },
        "required": [
          "cnpjCpf",
          "razaoSocial",
          "municipio",
          "uf"
        ]
      },
      "tomador": {
        "type": "object",
        "description": "Service taker identification, printed on the DANFSe and relevant to the buyer's CBS/IBS credit.",
        "properties": {
          "cnpjCpf": {
            "type": "string",
            "description": "Taker CNPJ (14 digits) or CPF (11 digits), digits only."
          },
          "razaoSocial": {
            "type": "string",
            "description": "Taker registered legal name."
          },
          "municipio": {
            "type": "string",
            "description": "Taker municipality, optional."
          },
          "uf": {
            "type": "string",
            "description": "Taker two-letter state code, optional."
          }
        },
        "required": [
          "cnpjCpf",
          "razaoSocial"
        ]
      },
      "servico": {
        "type": "object",
        "description": "The service line itself. Values supplied here take precedence over their top-level equivalents, so prefer this object when issuing a document and use the flat fields only for a quick calculation.",
        "properties": {
          "discriminacao": {
            "type": "string",
            "description": "Full description of the service rendered, printed verbatim on the DANFSe."
          },
          "valorServico": {
            "type": "number",
            "minimum": 0,
            "description": "Gross service amount in BRL, before unconditional discounts."
          },
          "descontoIncondicionado": {
            "type": "number",
            "minimum": 0,
            "description": "Unconditional discount in BRL, subtracted from valorServico to form the CBS/IBS/ISS tax base. Defaults to 0."
          },
          "codigoTributacaoNacional": {
            "type": "string",
            "description": "LC 116 national service code, for example '07.02.01'. Used to resolve cClassTrib when no fiscal code or sector is supplied."
          },
          "cClassTrib": {
            "type": "string",
            "description": "Service-level cClassTrib override, taking precedence over the top-level field."
          },
          "nbs": {
            "type": "string",
            "description": "Service-level NBS code, taking precedence over the top-level field."
          },
          "ncm": {
            "type": "string",
            "description": "Service-level NCM code, taking precedence over the top-level field."
          },
          "setor": {
            "type": "string",
            "description": "Service-level sector alias, taking precedence over the top-level field."
          },
          "issAliquota": {
            "type": "number",
            "minimum": 0,
            "maximum": 5,
            "description": "Municipal ISS rate in percent, defaulting to 5. It is automatically phased down from 2029 and reaches zero in 2033 under LC 214/2025. Alias accepted: aliqIss."
          },
          "retencaoIss": {
            "type": "boolean",
            "description": "When true, ISS is withheld by the taker and subtracted from valorLiquidoEstimado."
          },
          "cbsAliquota": {
            "type": "number",
            "minimum": 0,
            "description": "Service-level manual nominal CBS rate override, in percent. Alias accepted: aliqCbs."
          },
          "ibsAliquota": {
            "type": "number",
            "minimum": 0,
            "description": "Service-level manual nominal total IBS rate override, in percent. Alias accepted: aliqIbs."
          }
        },
        "required": [
          "discriminacao",
          "valorServico"
        ]
      }
    },
    "latam_validate_and_fx": {
      "country": {
        "type": "string",
        "enum": [
          "MX",
          "AR",
          "CL",
          "CO",
          "PE",
          "UY",
          "BR"
        ],
        "description": "ISO 3166-1 alpha-2 country code. Supplying it narrows auto-detection to that country's standards and avoids an ambiguous match between same-length documents."
      },
      "items": {
        "type": "array",
        "minItems": 1,
        "maxItems": 100,
        "description": "The identifiers to check, in any mix of countries and types. Anything beyond the 100th item is ignored and reported in warnings.",
        "items": {
          "type": "object",
          "description": "One identifier to check. A plain string is also accepted and is treated as { value } with full auto-detection.",
          "properties": {
            "value": {
              "type": "string",
              "description": "The identifier itself, with or without punctuation. Dots, dashes and slashes are stripped before the checksum is computed."
            },
            "country": {
              "type": "string",
              "enum": [
                "MX",
                "AR",
                "CL",
                "CO",
                "PE",
                "UY",
                "BR"
              ],
              "description": "ISO 3166-1 alpha-2 country code, which narrows auto-detection to that country's standards."
            },
            "type": {
              "type": "string",
              "description": "Document type for this line, from the same set the single-document tools accept, including CLABE and CBU. Omit to auto-detect."
            },
            "label": {
              "type": "string",
              "description": "Your own correlation key, echoed back verbatim on the matching result so you can join the response to your records. Use a row id or a column name."
            }
          },
          "required": [
            "value"
          ]
        }
      },
      "fx": {
        "type": "object",
        "description": "Optional live FX conversion bundled into the same paid call, useful when the batch feeds a cross-border payout run. Leave it out if you only need validation.",
        "properties": {
          "amount": {
            "type": "number",
            "default": 1,
            "description": "Amount to convert, in the source currency, as a plain number. Defaults to 1, which gives you the raw rates."
          },
          "from": {
            "type": "string",
            "enum": [
              "USD",
              "EUR",
              "MXN",
              "ARS",
              "CLP",
              "COP",
              "PEN",
              "UYU",
              "BRL"
            ],
            "default": "USD",
            "description": "Source currency, ISO 4217. Defaults to USD. An unsupported code falls back to USD and adds a warning instead of failing."
          },
          "to": {
            "oneOf": [
              {
                "type": "string",
                "enum": [
                  "USD",
                  "EUR",
                  "MXN",
                  "ARS",
                  "CLP",
                  "COP",
                  "PEN",
                  "UYU",
                  "BRL"
                ]
              },
              {
                "type": "array",
                "items": {
                  "type": "string",
                  "enum": [
                    "USD",
                    "EUR",
                    "MXN",
                    "ARS",
                    "CLP",
                    "COP",
                    "PEN",
                    "UYU",
                    "BRL"
                  ]
                }
              }
            ],
            "description": "Target currency or array of target currencies, ISO 4217. Omit it to receive every supported currency except the source in a single call, which costs the same as one target."
          }
        }
      }
    }
  }
};
