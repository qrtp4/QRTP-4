# QRTP-4 — Trust Passport Protocol (v1.0)

QRTP-4 is a passport-layer trust protocol for wallets, assets, and documents.

It provides:
- **Cryptographic authenticity (Ed25519 signatures)**
- **Public verification (GitHub Pages portal)**
- **Registry status control (issued / suspended / revoked)**
- **Scan-safe visual recognition layer (QRTP-4 Mark)**

**No Passport = No Trust.**

---

## Live Portal (Scan → Auto-Verify)

✅ Official portal:
[https://qrtp4.github.io/QRTP-4/](https://qrtp4.github.io/QRTP-4/)

- Works instantly from any QR scan
- Auto-decodes token from URL hash
- Verifies signature + registry status

---

## Quick Start (Issue → Scan → Verify)

### 1) Issue locally (creates signed envelope + QR)
```bash
cd issuer
npm install
node issue-v1.js wallet xrp:rW6mfR5R8PEqY6idUB2Hz7HgvhS72S96k "XRP (Primary)"
```

This outputs:
- A signed QRTP-4 envelope (JSON)
- A scannable QR code that opens the portal link:
  ```
  https://qrtp4.github.io/QRTP-4/#<token>
  ```

### 2) Verify (public)
Scan the QR with any phone camera.

Result shows:
- ✅ VERIFIED
- ⚠️ SUSPENDED
- ❌ REVOKED
- ❌ INVALID SIGNATURE

---

## Envelope Format (v1.0)

Canonical signed message format:
```
v|iss|kid|pid|iat|exp|nonce|data
```

Envelope fields:
- `v` — protocol version
- `iss` — issuer ID
- `kid` — key ID
- `pid` — Passport ID
- `iat` — issued-at timestamp
- `exp` — expiration timestamp
- `nonce` — anti-replay salt
- `data` — payload (wallet / asset / document data)
- `sig` — Ed25519 signature (base64)

---

## Trust Data (Source of Truth)

Public trust registry:
- `verifier/issuers.json` — issuer public keys
- `verifier/registry.json` — PID status registry

Status values:
- `issued` (valid)
- `suspended` (valid signature, temporarily blocked)
- `revoked` (permanent rejection)

---

## License
MIT
