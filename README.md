# QRTP-4 👑
**QR Token Passport Registry**

Identity • Verification • Anti-Fake • Trust Layer

![Views](https://komarev.com/ghpvc/?username=qrtp4&label=Profile%20Views&color=blue&style=flat)
![GitHub stars](https://img.shields.io/github/stars/qrtp4/QRTP-4?style=social)


---

## ⚡ Quick Start (Issue → Verify)

### 1) Install issuer dependencies
```bash
cd issuer
npm install
```

### 2) Issue a passport (creates QR + updates registry)
```bash
node issue.js wallet "xrp:rW6mfR5R8PEqY6idUB2Hz7HgvhS72S96k" "XRP (Primary)"
```

### 3) Open the Verifier (GitHub Pages)
[https://qrtp4.github.io/QRTP-4/](https://qrtp4.github.io/QRTP-4/)

### 4) Scan the generated QR
Scan `issuer/out/<pid>.png` with your camera → get ✅ VERIFIED.

### 5) Revoke a passport (optional)
```bash
node revoke.js <pid>
```

> **No Passport = No Trust.**
> **No Passport = No Trust.**

---

## 🧬 What is QRTP-4?

QRTP-4 is a verification protocol and registry system designed to give every token a **passport** —
a unique identity layer that protects authenticity, origin, and trust.

---

## 🛡️ Core Features

- ✅ Token identity & passport issuance
- ✅ Authenticity validation
- ✅ Anti-fake protection layer
- ✅ Registry logic and proof levels

---

## 📁 Structure

| File | Description |
|------|-------------|
| `QRTP-4.md` | Main protocol logic |
| `CHANGELOG.md` | Version history |
| `LICENSE` | MIT License |

---

## 📜 License

MIT — Open and free to use.

---

## 📡 Links

- GitHub: [github.com/qrtp4](https://github.com/qrtp4)

---

## 🚧 Roadmap

- [x] QRTP-4 Core Logic
- [x] Passport Issuance Module
- [x] Verification API
- [x] Anti-Fake Scanner
- [ ] Public Registry Explorer

---

**QRTP-4** — *No Passport = No Trust.*
