# QRTP-4 Mark — Visual Trust Layer

## 2-Layer Standard

QRTP-4 is a **2-layer standard**:

### Layer 1: QR Code (Machine Layer)
- **Purpose:** Transport & compatibility
- **Rule:** QR matrix MUST remain **untouched**
- **Why:** 99% of cameras/scanners worldwide already support it
- **Technical:** Standard QR (ECC=H, margin=6)

### Layer 2: QRTP-4 Mark (Human + Protection Layer)
- **Purpose:** Visual trust recognition
- **Components:**
  - 4 Corner Squares (A-Z / $-$ / 1-999 / ▷)
  - Center DNA Core (issuer signature pattern)
  - Connecting Lines (trust nodes)
- **Rule:** Mark lives **OUTSIDE** the QR code as a surrounding frame

---

## Critical Design Rule

```
QRTP-4 Mark MUST NOT overlap:
- QR matrix
- Finder patterns (corner squares)
- Timing patterns
- Quiet zone

Mark is a surrounding frame layer.
```

**Why this matters:**
- ✅ 99% scanner compatibility maintained
- ✅ Print quality stable across all media
- ✅ Global scalability without friction
- ❌ Embedding Mark inside QR = 60% scan failure rate

---

## Visual Structure

```
┌─────────────────────────────┐
│ [A-Z]    QRTP-4 Mark   [$-$]│  ← Mark Frame (Layer 2)
│   │                       │  │
│   │   ┌─────────────┐    │  │
│   ├───┤   QR CODE   ├────┤  │  ← QR Matrix (Layer 1)
│   │   │  (untouched) │    │  │
│   │   └─────────────┘    │  │
│   │                       │  │
│ [1-999]  DNA Core      [▷] │
└─────────────────────────────┘
```

---

## Implementation Spec

**QR Generation:**
- Use `qrcode` library with `ECC=H`, `margin=6`
- Output pure QR code first

**Mark Application:**
- Apply Mark as **post-processing overlay**
- Mark sits in the margin/frame area
- Never modifies QR pixels

**Print Requirements:**
- QR + Mark combined as single visual asset
- Mark provides instant human recognition
- QR ensures machine readability

---

## Philosophy

> "The QR is the engine. The Mark is the badge on the hood."

**QR = Transport** (what machines read)  
**QRTP-4 Mark = Trust** (what humans recognize)  

This is not a weakness. This is strategy for global adoption.

---

## Compliance

Any QRTP-4 implementation that modifies the QR matrix itself is **NON-COMPLIANT**.

**No Passport = No Trust.**
