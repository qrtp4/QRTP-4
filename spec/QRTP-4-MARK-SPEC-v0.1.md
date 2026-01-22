# QRTP-4 MARK SPEC v0.1 (Visual Standard)

## 1. Purpose
QRTP-4 Mark is the **visual passport seal** for QRTP-4 protocol.
It is designed to make a QRTP-4 passport instantly recognizable and harder to counterfeit,
while keeping full QR scan compatibility.

**Rule:** The QRTP-4 Mark MUST NOT break standard QR readability.

---

## 2. Definitions
- **Base QR**: a standard ISO/IEC 18004 QR code that stores QRTP-4 payload or URL.
- **QRTP-4 Frame**: the visual overlay around the Base QR.
- **Center Atom (DNA Core)**: the central identity symbol that represents the signed passport core.
- **4 Data Squares**: four corner squares representing 4 dimensions of information.

---

## 3. Mandatory Structure
A valid QRTP-4 Mark MUST include:

### 3.1 Base QR (Mandatory)
- A fully scannable QR code
- Must work in common camera scanners (iOS/Android)
- Must remain readable at low light and low resolution

### 3.2 4 Data Squares (Mandatory)
The QRTP-4 Mark MUST contain four labeled squares:

1) **A-Z Square**
   - Meaning: text / type / identity class
   - Examples: `WALLET`, `TOKEN`, `DOC`, `TICKET`

2) **$-$ Square**
   - Meaning: finance layer / chain / currency class
   - Examples: `BTC`, `ETH`, `USDT`, `XRP`, `SOL`

3) **1-999 Square**
   - Meaning: serial / tier / batch / level
   - Examples: `001`, `042`, `777`

4) **Action Square**
   - Meaning: action intent of the passport
   - Examples: `VERIFY`, `PAY`, `OPEN`, `MINT`

These squares are part of the **QRTP-4 identity language**.

### 3.3 Center Atom / DNA Core (Mandatory)
The center MUST contain a core identity symbol:
- DNA / fingerprint / atom / seal icon
- Represents: **signed identity core**
- Must not fully cover QR data modules (see S5 Safety)

---

## 4. Placement Rules
### 4.1 Square Placement (Recommended)
QRTP-4 squares SHOULD be placed near the four corners of the mark:

- Top-left: **A-Z**
- Top-right: **$-$**
- Bottom-left: **1-999**
- Bottom-right: **Action**

> Note: This is a recommended layout, not a QR encoding requirement.

### 4.2 Visual Hierarchy
The Base QR MUST remain the primary scannable element.
The Mark MUST support, not replace, the Base QR.

---

## 5. Scan Safety Rules (Critical)
To keep scan compatibility:

### 5.1 Quiet Zone
- Maintain a clear margin ("quiet zone") around the Base QR
- Recommended: 4 modules minimum clear space

### 5.2 Overlay Limits
The QRTP-4 Mark MAY overlay QR modules only if:
- error correction level is at least **M**
- the overlay is limited to a safe % of the total QR area

Recommended maximum overlay:
- **<= 15%** of QR module area

### 5.3 Contrast Rules
- High contrast is REQUIRED (black on white or equivalent)
- Avoid low-contrast gray-on-gray designs

### 5.4 Minimum Size
For reliable scanning:
- Print: >= 30 mm x 30 mm
- Screen: >= 220 px x 220 px

---

## 6. QRTP-4 Mark Modes
QRTP-4 Mark can be used in 2 modes:

### Mode A - "Passport Seal" (Recommended)
- Base QR is clean and standard
- QRTP-4 Frame is drawn outside QR area
- Best scan reliability

### Mode B - "Art QR" (Advanced)
- DNA Core may be integrated inside QR area
- Requires careful testing
- Best visual branding, riskier scanning

---

## 7. Compliance Levels (Optional)
A QRTP-4 passport can advertise a Mark compliance level:

- **MARK-L1**: Base QR + 4 squares (no center overlay)
- **MARK-L2**: Base QR + 4 squares + center core (safe overlay)
- **MARK-L3**: Artistic / branded QRTP-4 mark (advanced)

---

## 8. Standard Statement
QRTP-4 Mark is a **visual identity standard**.
The security standard is defined by QRTP-4 protocol specification (signatures + registry):

**Security = Signature + Registry**
**Brand/Seal = QRTP-4 Mark**

---

## 9. Motto
**No Passport = No Trust.**
