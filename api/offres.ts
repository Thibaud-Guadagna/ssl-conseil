// api/offres.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = { runtime: "nodejs" };

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		return res.status(405).json({ error: "Method Not Allowed" });
	}

	try {
		// token déjà présent dans l'env, on l'utilise tel quel
		const apiToken = process.env["API_TOKEN"]!;
		const url = "https://api.jobposting.pro/clientsjson?id=101619";

		const controller = new AbortController();
		const to = setTimeout(() => controller.abort(), 10_000);

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"api-token": apiToken, // <- conforme au mail du provider
			},
			signal: controller.signal,
		}).catch((e) => {
			throw new Error(
				`Network/timeout: ${e instanceof Error ? e.message : String(e)}`,
			);
		});
		clearTimeout(to);

		if (!response.ok) {
			const body = await response.text().catch(() => "");
			// On log côté serveur et on renvoie un diagnostic côté client (utile pour toi dans l’onglet Network)
			console.error("JobPosting upstream error", {
				status: response.status,
				statusText: response.statusText,
				bodySample: body.slice(0, 500),
			});
			return res.status(502).json({
				error: "Upstream API error",
				upstreamStatus: response.status,
				upstreamStatusText: response.statusText,
				upstreamBodySample: body.slice(0, 500),
			});
		}

		const data = await response.json();
		return res.status(200).json(data);
	} catch (err) {
		console.error("Erreur API /offres :", err);
		return res.status(500).json({ error: "Erreur interne du serveur" });
	}
}
