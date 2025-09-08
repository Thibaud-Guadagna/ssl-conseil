// api/offres.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Forcer la runtime Node (évite tout edge involontaire)
export const config = { runtime: "nodejs20.x" };

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		return res.status(405).json({ error: "Method Not Allowed" });
	}

	try {
		const apiToken = process.env["API_TOKEN"];
		if (!apiToken) {
			return res.status(500).json({ error: "API_TOKEN manquant." });
		}

		const targetUrl = "https://api.jobposting.pro/clientsjson?id=101619";

		// Timeout pour éviter de pendre en prod
		const controller = new AbortController();
		const to = setTimeout(() => controller.abort(), 10_000);

		const response = await fetch(targetUrl, {
			method: "GET",
			// Pas de Content-Type sur un GET
			headers: {
				// Le nom d’en-tête est insensible à la casse, on garde celui documenté
				"api-token": apiToken,
				"User-Agent": "ssl-conseil-vercel/1.0",
				Accept: "application/json",
			},
			signal: controller.signal,
		}).catch((e) => {
			// Erreurs réseau/timeout
			throw new Error(
				`Fetch failed: ${e instanceof Error ? e.message : String(e)}`,
			);
		});
		clearTimeout(to);

		if (!response.ok) {
			const text = await response.text().catch(() => "");
			// On journalise côté serveur pour le debug Vercel, mais on renvoie un message propre au client
			console.error("JobPosting API error", {
				status: response.status,
				statusText: response.statusText,
				bodySample: text?.slice(0, 500),
			});
			return res.status(response.status).json({
				error: "Upstream API error",
				upstreamStatus: response.status,
				upstreamStatusText: response.statusText,
			});
		}

		const data = await response.json();
		return res.status(200).json(data);
	} catch (err) {
		console.error("Erreur API /offres :", err);
		return res.status(500).json({ error: "Erreur interne du serveur" });
	}
}
