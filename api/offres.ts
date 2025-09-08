// D:\gtdeveloppement\sslconseil\api\offre.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const apiToken = process.env.API_TOKEN;
		if (!apiToken) {
			res.status(500).json({
				error: "API_TOKEN manquant dans les variables d'environnement.",
			});
			return;
		}

		const targetUrl = "https://api.jobposting.pro/clientsjson?id=101619";

		const response = await fetch(targetUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"api-token": process.env.API_TOKEN as string,
			},
		});

		if (!response.ok) {
			const text = await response.text();
			res.status(response.status).json({ error: text });
			return;
		}

		const data = await response.json();
		res.status(200).json(data);
	} catch (err: any) {
		console.error("Erreur API /offre :", err);
		res.status(500).json({ error: "Erreur interne du serveur" });
	}
}
