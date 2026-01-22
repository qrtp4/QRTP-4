# QRTP-4 Governance (v0.1)

QRTP-4 is an open standard with a public reference implementation.
This document defines how protocol changes and issuer onboarding are handled.

---

## 1) Guiding Principles
- **Security first**
- **Backward compatibility when possible**
- **Public verification for everyone**
- **Issuer accountability through public keys**
- **No Passport = No Trust**

---

## 2) Specification Authority
QRTP-4 has two official specifications:

1) **Protocol Spec** (security): `spec/QRTP-4-SPEC-v0.1.md`
2) **Mark Spec** (visual standard): `spec/QRTP-4-MARK-SPEC-v0.1.md`

If a change conflicts with either spec, the spec MUST be updated with a new version.

---

## 3) Change Process (Standard Updates)
All changes MUST happen through a public pull request.

### Required for acceptance
- Clear description of change
- Motivation (why it matters)
- Compatibility notes (breaking or non-breaking)
- Updated spec docs (if applicable)
- Updated conformance tests (if applicable)
- CI must pass

---

## 4) Versioning Rules
QRTP-4 uses semantic versioning principles:

- **Patch (0.1.x)**: bug fixes, no breaking changes
- **Minor (0.x)**: new features, should remain backward compatible
- **Major (1.x)**: breaking changes require migration plan

Protocol versions are encoded in the passport payload as:
- `v: "0.1"`

---

## 5) Issuer Governance
QRTP-4 supports multiple issuers.
Issuers are identified by:
- issuer id: `iss` (example: `qrtp4`)
- public key (Ed25519)

Issuers MUST be accountable for every issued passport by signature verification.

---

## 6) Security & Key Compromise
If an issuer key is compromised:
1) Rotate keys immediately
2) Mark affected passports as revoked/suspended (policy-based)
3) Publish a clear incident statement
4) Update issuer registry with new public key (new version)

---

## 7) Registry as Source of Truth
Registry status MUST be treated as authoritative:

- `issued` — valid
- `suspended` — temporarily blocked
- `revoked` — permanently invalid

**Revoked passports MUST NOT be reinstated.**

---

## 8) Official Statement
QRTP-4 aims to be a global passport-layer standard.

**Security = Signature + Registry**  
**Recognition = QRTP-4 Mark**  
**No Passport = No Trust**
