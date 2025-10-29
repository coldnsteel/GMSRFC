# 🎯 GMSRFC PAYMENT SYSTEM - SIMPLE SETUP

## Location: GMSRFC/Dogpatch-Market

---

## 📁 FILE STRUCTURE

```
GMSRFC/
└── Dogpatch-Market/
    ├── api/
    │   ├── payment-webhook.js    ← ADD THIS
    │   └── validate-serial.js    ← ADD THIS
    ├── activate.html              ← ADD THIS
    ├── .env                       ← ADD THIS (edit with your email)
    ├── package.json              ← ADD THIS
    ├── vercel.json               ← ADD THIS
    └── index.html                ← YOUR EXISTING FILE (keep it)
```

---

## ⚡ SETUP (5 steps)

### 1. Create api folder
```bash
cd GMSRFC/Dogpatch-Market
mkdir api
```

### 2. Add files
- Put `payment-webhook.js` in `/api/`
- Put `validate-serial.js` in `/api/`
- Put `activate.html` in root (next to index.html)
- Put `package.json` in root
- Put `vercel.json` in root
- Put `.env` in root

### 3. Edit .env
```bash
nano .env
```
Change to YOUR Gmail:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

**Get Gmail app password**: https://myaccount.google.com/security → App Passwords

### 4. Deploy
```bash
npm install
vercel --prod
```

Copy your Vercel URL (like: `https://gmsrfc-dogpatch.vercel.app`)

### 5. Update activate.html
Edit line 264 in `activate.html`:
```javascript
const API_URL = 'https://YOUR-URL.vercel.app/api/validate-serial';
```
Replace with YOUR actual Vercel URL.

Then commit and push.

---

## ✅ DONE!

Your URLs:
- Activation: `https://YOUR-URL.vercel.app/activate.html`
- Webhook: `https://YOUR-URL.vercel.app/api/payment-webhook`

---

## 🎯 WHAT THIS HANDLES

ALL GMSRFC products:
- ✅ HackerWatch Fortress ($47)
- ✅ GMSRFC Academy Edition ($97)
- ✅ KOZMIC KASINO ($27)
- ✅ Little X Books ($15)
- ✅ CTOK Whitepaper (Free)
- ✅ Any future products

---

## 🧪 TEST IT

```bash
curl -X POST https://YOUR-URL.vercel.app/api/payment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentType": "crypto",
    "productId": "hackerwatch-fortress",
    "customerEmail": "test@example.com",
    "transactionId": "test-123",
    "amount": 47
  }'
```

Should return a serial number.

---

## 📞 SUPPORT

Lexalytics@yahoo.com

Include:
- Error message
- What you tried
- Your Vercel URL

---

**Emmanuel - God With Us! ψΩ§∞**
