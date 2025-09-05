// CommonJS: pas de "import", on utilise require()
const { writeFileSync, mkdirSync } = require("fs");
const { dirname } = require("path");

// ⚠️ chemins avec "environnement" (orthographe FR)
const targetPath = "./src/environnement/environnement.prod.ts";

// Construit le fichier TS à partir des variables d'env Vercel
const envFile = `export const environment = {
  production: true,
  jobPostingUrl: "${process.env.JOB_POSTING_URL ?? ""}",
  emailjsServiceId: "${process.env.EMAILJS_SERVICE_ID ?? ""}",
  emailjsTemplateId: "${process.env.EMAILJS_TEMPLATE_ID ?? ""}",
  emailjsPublicKey: "${process.env.EMAILJS_PUBLIC_KEY ?? ""}",
  apiToken: "${process.env.API_TOKEN ?? ""}"
};\n`;

mkdirSync(dirname(targetPath), { recursive: true });
writeFileSync(targetPath, envFile);
console.log("✅ Généré :", targetPath);
