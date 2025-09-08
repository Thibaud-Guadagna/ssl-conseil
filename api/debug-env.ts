// api/debug-env.js  (CommonJS, aucune dépendance)
module.exports = (req, res) => {
	const env = process.env.VERCEL_ENV || "unknown";
	const hasToken = Boolean(process.env.API_TOKEN);
	res.status(200).json({ env, hasToken, now: new Date().toISOString() });
};

// Force la runtime Node
module.exports.config = { runtime: "nodejs" };
