# QRTP-4 Standard Statement v0.1 🌍

## What is QRTP-4?
QRTP-4 (QR Token Passport Registry) is an **open passport-layer standard** designed to make
digital and physical assets verifiable by anyone, anywhere.

QRTP-4 turns a QR code into a **signed identity passport** backed by a public registry.

**No Passport = No Trust.**

---

## Problem
QR codes are widely used, but traditional QR usage has a weakness:

- A QR image can be copied or reprinted
- A link can be replaced
- Visual trust can be forged

Without cryptographic proof and revocation, a QR is only a container — not a guarantee.

---

## Solution
QRTP-4 introduces a minimal and practical trust model:

1) **A Passport ID (PID)** identifies the asset passport  
2) **A digital signature** proves the passport was issued by a known issuer  
3) **A registry status** determines if the passport is valid, suspended, or revoked  
4) **A visual mark** makes QRTP-4 passports instantly recognizable in real life

---

## QRTP-4 Components
QRTP-4 is defined by two public standards:

### 1) QRTP-4 Protocol Specification (Security Standard)
- Passport payload format (v0.1)
- Ed25519 signature verification
- Registry status rules

Reference: `spec/QRTP-4-SPEC-v0.1.md`

### 2) QRTP-4 Mark Specification (Visual Standard)
- 4 data squares (A–Z, $–$, 1–999, ▷ Action)
- Center Atom / DNA Core seal
- Scan safety rules and compliance levels

Reference: `spec/QRTP-4-MARK-SPEC-v0.1.md`

---

## Trust Model
QRTP-4 does not require trust in design, screenshots, or claims.

Trust is defined by:

**Security = Signature + Registry**  
**Recognition = QRTP-4 Mark**

Any verifier can validate a QRTP-4 passport by checking:
- the issuer public key
- the signature
- the registry status

---

## Implementation & Adoption
QRTP-4 provides a reference implementation:
- Issuer tools (passport generation)
- Verifier page (scan → verify)
- Registry status control (issue / suspend / revoke)

Additionally, QRTP-4 aims to support:
- multi-issuer governance
- public registry API
- conformance test vectors for verification correctness

---

## Use Cases
QRTP-4 can be applied to:
- crypto wallets and trusted donation addresses
- token authenticity and on-chain identity references
- product anti-counterfeit labeling
- digital documents and certificates
- ticket verification and anti-scalping systems

---

## Status
QRTP-4 is currently released as **v0.1** and evolves through a public roadmap.

Reference: `spec/QRTP-4-MANIFEST-v0.1.md`

---

## Motto
**No Passport = No Trust.**
