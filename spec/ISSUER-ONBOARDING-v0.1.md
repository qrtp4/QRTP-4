# QRTP-4 Issuer Onboarding v0.1

This document explains how a new issuer is added to the QRTP-4 ecosystem.

---

## 1) What is an Issuer?
An issuer is an entity that can create and sign QRTP-4 passports.

Each issuer has:
- issuer id (`iss`)
- Ed25519 keypair:
  - private key (issuer-side only, never shared)
  - public key (published for verification)

---

## 2) Issuer Requirements
A valid issuer MUST:
- keep private keys secure
- publish the public key for verification
- support passport revocation if needed
- follow QRTP-4 SPEC v0.1 rules

---

## 3) Issuer ID Rules
Issuer IDs MUST:
- be lowercase
- be stable and unique
- contain only: `a-z`, `0-9`, `-`

Example:
- `qrtp4`
- `brand-x`
- `issuer-01`

---

## 4) Public Key Publication
Issuer public keys are published in `verifier/issuers.json`:

Example:
```json
{
  "qrtp4": "<base64url_public_key>",
  "brand-x": "<base64url_public_key>"
}
```

---

## 5) Adding a New Issuer (Process)
1. Generate Ed25519 keypair securely
2. Choose an issuer id (`iss`)
3. Submit a pull request that adds the issuer to `issuers.json`
4. Provide a test passport (conformance vector) proving verification works
5. CI must pass

---

## 6) Key Rotation
If an issuer rotates keys:
- a new key MUST be published
- a rotation notice SHOULD be recorded (version + timestamp)
- old passports remain valid unless policy requires re-issuing

---

## 7) Trust & Verification
Any verifier should validate:
- issuer exists in issuer registry
- signature is valid
- registry status is `issued`

If any check fails:

**No Passport = No Trust**
