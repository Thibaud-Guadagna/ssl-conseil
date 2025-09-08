// api/debug-env.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
export const config = { runtime: "nodejs" };

export default function handler(_req: VercelRequest, res: VercelResponse) {
	const env = process.env["VERCEL_ENV"] || "unknown";
	const hasToken = Boolean(process.env["API_TOKEN"]);
	res.status(200).json({ env, hasToken });
}
