let serialDatabase = new Map();
const PRODUCTS = {
    'hackerwatch-fortress': { downloadUrl: 'https://github.com/coldnsteel/HackerWatch-Fortress/archive/refs/heads/main.zip' },
    'gmsrfc-academy': { downloadUrl: 'https://github.com/coldnsteel/GMSRFC/archive/refs/heads/main.zip' },
    'kozmic-kasino': { downloadUrl: 'https://github.com/coldnsteel/KOZMIC-KASINO/archive/refs/heads/main.zip' }
};

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const { serial } = req.body;
        const data = serialDatabase.get(serial);
        if (!data) return res.status(404).json({ valid: false, error: 'Invalid serial' });
        if (data.downloadCount >= data.maxDownloads) return res.status(403).json({ valid: false, error: 'Limit reached' });
        data.downloadCount++;
        return res.status(200).json({ valid: true, productName: data.productName, downloadUrl: PRODUCTS[data.productId].downloadUrl, downloadsRemaining: data.maxDownloads - data.downloadCount });
    } catch (error) {
        return res.status(500).json({ valid: false, error: error.message });
    }
};
