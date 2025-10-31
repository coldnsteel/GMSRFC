export default function handler(req, res) {
  const key = req.headers["x-admin-key"];
  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ authorized: false });
  }
  return res.status(200).json({ authorized: true });
}
