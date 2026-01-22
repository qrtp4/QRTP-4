# 🛡️ QRTP-4 Production Polish Pack

> **Финальные изменения для мирового стандарта без багов**

Дата: 2026-01-22
Версия: v0.1 → v0.2 (Production Ready)

---

## ✅ ЧТО УЖЕ СДЕЛАНО

- [x] `issuer/issue.js` - base64url hash token format
- [x] `.gitignore` - защита ключей
- [x] `issuer/revoke.js` - защита revoked статуса
- [x] `verifier/verifier.js` - исправлены CSS классы badges

---

## 🔧 ОСТАЛОСЬ ПРИМЕНИТЬ (локально)

### 1) `index.html` - Добавить auto-verify из hash

**Где:** после функции `b64urlToBytes()` (строка ~61)

**Добавить:**
```javascript
// Decode envelope from URL hash (supports base64url + legacy JSON)
function decodeEnvelopeFromHash() {
  const h = (location.hash || '').slice(1).trim();
  if (!h) return null;
  // Backward-compat: raw JSON
  if (h.startsWith('{')) {
    try { return JSON.parse(decodeURIComponent(h)); } catch { return null; }
  }
  // New: base64url token
  try {
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(h)));
  } catch { return null; }
}
```

**В `main()` заменить:**
```javascript
// БЫЛО:
const hash = location.hash.slice(1);
if (hash) {
  try { const env = JSON.parse(decodeURIComponent(hash)); ...

// СТАЛО:
const envFromHash = decodeEnvelopeFromHash();
if (envFromHash) {
  $('qr').value = JSON.stringify(envFromHash);
  render(envFromHash);
}
```

---

### 2) `README.md` - Обновить Quick Start

**Заменить секцию Quick Start на:**

```markdown
## ⚡ Quick Start (Issue → Verify)

### 1) Install issuer dependencies
```bash
cd issuer
npm install
```

### 2) Issue a passport
```bash
node issue.js wallet "xrp:rW6mfR5R8PEqY6idUB2Hz7HgvhS72S96k" "XRP (Primary)"
```

### 3) Scan the QR
Scan `issuer/out/<pid>.png` → it opens:
https://qrtp4.github.io/QRTP-4/ and auto-verifies ✅

### 4) Revoke (optional)
```bash
node revoke.js <pid>
```

> **No Passport = No Trust**
```

---

## 📋 ФИНАЛЬНАЯ ПРОВЕРКА (Чеклист "без багов")

### Шаг 1: Выпусти тестовый паспорт
```bash
cd issuer
npm install
node issue.js wallet "demo:ref001" "Demo Passport"
```

### Шаг 2: Проверь что обновилось
- `verifier/issuers.json` - реальный публичный ключ (не placeholder)
- `verifier/registry.json` - есть PID со статусом "issued"

### Шаг 3: Закоммить и пуш
```bash
cd ..
git add verifier/issuers.json verifier/registry.json issuer/out/
git commit -m "Add first passport and issuer key"
git push
```

### Шаг 4: Проверь на GitHub Pages

1. Открой прямые файлы:
   - https://qrtp4.github.io/QRTP-4/verifier/issuers.json (должен быть ключ)
   - https://qrtp4.github.io/QRTP-4/verifier/registry.json (должен быть PID)

2. Скан QR:
   - Отсканируй `issuer/out/<pid>.png`
   - Должен открыться verifier → показать ✅ **VERIFIED (issued)**

### Шаг 5: Проверь отзыв
```bash
cd issuer
node revoke.js <pid>
cd ..
git add verifier/registry.json
git commit -m "Revoke test passport"
git push
```

Подожди 1-2 минуты → повторно скан QR → должен показать ❌ **Not valid: revoked**

---

## 🎯 КРИТЕРИИ "МИРОВОЙ СТАНДАРТ"

✅ **Security** = signature (Ed25519) + registry (JSON)
✅ **Mark** = 4 squares + core
✅ **Link** = base64url hash (неубиваемый)
✅ **QR** = URL (камера открывает сразу)
✅ **Verifier** = auto-проверка из hash
✅ **Revoked** = навсегда (нельзя reinstate)

---

## 🚀 ПОСЛЕ ВЫПОЛНЕНИЯ

Закрой этот чеклист коммитом:
```bash
git rm PRODUCTION_CHECKLIST.md
git commit -m "Complete production polish - v0.2 ready"
git push
```

Протокол готов! 🔥
