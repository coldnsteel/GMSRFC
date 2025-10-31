const crypto = require('crypto');
const nodemailer = require('nodemailer');

const PRODUCTS = {
    'hackerwatch-fortress': { name: 'HackerWatch Fortress', price: 47, prefix: 'HWF', downloadUrl: 'https://github.com/coldnsteel/HackerWatch-Fortress/archive/refs/heads/main.zip' },
    'gmsrfc-academy': { name: 'GMSRFC Academy', price: 97, prefix: 'GAE', downloadUrl: 'https://github.com/coldnsteel/GMSRFC/archive/refs/heads/main.zip' },
    'kozmic-kasino': { name: 'KOZMIC KASINO', price: 27, prefix: 'KKA', downloadUrl: 'https://github.com/coldnsteel/KOZMIC-KASINO/archive/refs/heads/main.zip' }
};

let serialDatabase = new Map();

function generateSerial(productId, customerEmail, txId) {
    const p = PRODUCTS[productId];
    const hash = crypto.createHash('sha256').update(`${productId}${customerEmail}${txId}${Date.now()}`).digest('hex').substring(0,8).toUpperCase();
    const serial = `${p.prefix}-${new Date().getFullYear()}-${hash}`;
    serialDatabase.set(serial, { serial, productId, productName: p.name, customerEmail, purchaseDate: new Date().toISOString(), downloadCount: 0, maxDownloads: 5 });
    return serial;
}

async function sendEmail(email, serial, productId) {
    const p = PRODUCTS[productId];
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }});
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `${p.name} - Serial: ${serial}`,
        text: `Your serial: ${serial}\nActivate: https://coldnsteel.github.io/GMSRFC/Dogpatch-Market/activate.html?serial=${serial}`
    });
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const { productId, customerEmail, transactionId, amount } = req.body;
        const product = PRODUCTS[productId];
        if (!product || amount < product.price) return res.status(400).json({ error: 'Invalid' });
        const serial = generateSerial(productId, customerEmail, transactionId);
        await sendEmail(customerEmail, serial, productId);
        return res.status(200).json({ success: true, serial });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
