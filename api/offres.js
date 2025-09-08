// api/offres.js  — version CommonJS robuste
module.exports = async (req, res) => {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		return res.status(405).json({ error: "Method Not Allowed" });
	}

	const apiToken = process.env.API_TOKEN;
	if (!apiToken) {
		return res.status(500).json({
			error: "API token absent",
			env: process.env.VERCEL_ENV || "unknown",
		});
	}

	const url = "https://api.jobposting.pro/clientsjson?id=101619";

	try {
		const controller = new AbortController();
		const to = setTimeout(() => controller.abort(), 10_000);

		const r = await fetch(url, {
			headers: { Accept: "application/json", "api-token": apiToken },
			signal: controller.signal,
		});
		clearTimeout(to);

		if (!r.ok) {
			const text = await r.text().catch(() => "");
			console.error("JobPosting upstream error", {
				status: r.status,
				statusText: r.statusText,
				bodySample: text.slice(0, 500),
			});
			return res
				.status(502)
				.json({
					error: "Upstream API error",
					upstreamStatus: r.status,
					upstreamStatusText: r.statusText,
				});
		}

		const data = await r.json();
		res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=60");
		return res.status(200).json(data);
	} catch (e) {
		console.error("Erreur API /offres :", e);
		return res.status(500).json({ error: "Unhandled", message: String(e) });
	}
};

// Force la runtime Node.js (pas edge)
module.exports.config = { runtime: "nodejs" };
