# QRTP-4 Specification v0.1 (MVP)

## 1. Purpose
QRTP-4 defines a minimal "passport" format for verifying authenticity of a referenced asset
(token / product / document / ticket) using digital signatures.

**Principle:** No Passport = No Trust.

## 2. Entities
- **Issuer**: entity that creates and signs passports.
- **Verifier**: app/page that validates passports (signature + status).
- **Registry**: public source of passport status and issuer public keys.

## 3. Passport Object (JSON)
A passport is a JSON object with these required fields:

- `v`   : string, protocol version (must be "0.1")
- `pid` : string, passport id (ULID or UUID)
- `typ` : string, asset type (e.g. "token" | "product" | "document" | "ticket")
- `ref` : string, reference identifier (e.g. contract+tokenId, serial number, doc hash)
- `iss` : string, issuer id (stable identifier, e.g. "qrtp4")
- `iat` : number, issued-at unix timestamp (seconds)
- `exp` : number|null, optional expiry unix timestamp (seconds) or null
- `sig` : string, base64url signature of the canonical payload (see S4)

Optional fields:
- `meta`: object, arbitrary metadata (name, chain, url, etc.)

## 4. Signing & Canonical Payload
To sign, build a **canonical payload JSON** WITHOUT the `sig` field, then encode it as UTF-8 bytes.

Canonical payload fields order for v0.1 MUST be:
`v, pid, typ, ref, iss, iat, exp, meta`

Signature algorithm (v0.1):
- Ed25519
- `sig = base64url(Ed25519.sign(payload_bytes, issuer_private_key))`

Issuer public key distribution:
- Published in `issuers.json` (registry) keyed by `iss`.

## 5. QR Encoding
Two allowed QR modes (MVP supports both):

### Mode A - URL mode (recommended UX)
QR contains:
`https://<host>/verify#<token>`

Where `<token>` is `base64url(payload_json_bytes) + "." + sig_base64url`
(or a compact JSON envelope).

### Mode B - Inline mode (offline-friendly)
QR contains a compact JSON envelope:
`{"t":"QRTP4","v":"0.1","p":"<payload_b64url>","s":"<sig_b64url>"}`

## 6. Registry (MVP)
Registry publishes:
- `issuers.json`: map of issuer id -> public key (base64url)
- `registry.json`: map of pid -> status object

Status object (minimal):
- `pid`: string
- `status`: "issued" | "revoked" | "suspended"
- `iss`: string
- `iat`: number
- `ref`: string

## 7. Verification Procedure
A verifier MUST:
1) Extract payload + signature from QR.
2) Decode payload JSON, ensure `v == "0.1"`.
3) Fetch issuer public key using `iss`.
4) Verify signature (Ed25519).
5) Optionally fetch registry status for `pid`.
6) Display result:
   - Verified (signature ok + status "issued")
   - Unknown (signature ok but pid not found)
   - Revoked/Suspended (signature ok but status not issued)
   - Invalid (signature invalid / malformed)

## 8. Security Notes (MVP)
- QR images can be copied. Trust comes from signature + registry status.
- Private keys must never be committed to the repository.
- If `exp` is set and current time > exp, verifier should warn or fail depending on policy.
