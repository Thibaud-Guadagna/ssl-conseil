// src/app/app.config.server.ts
import {
	ApplicationConfig,
	TransferState,
	PLATFORM_ID,
	inject,
	provideEnvironmentInitializer,
} from "@angular/core";
import { isPlatformServer } from "@angular/common";
import { provideServerRendering } from "@angular/ssr";
import { provideHttpClient, withFetch } from "@angular/common/http";
import {
	PUBLIC_RUNTIME_CONFIG,
	CONFIG_KEY,
	type PublicRuntimeConfig,
} from "./runtime-config.token";

export const appConfig: ApplicationConfig = {
	providers: [
		provideServerRendering(),
		provideHttpClient(withFetch()),

		// Config publique lue côté serveur depuis process.env
		{
			provide: PUBLIC_RUNTIME_CONFIG,
			useFactory: (): PublicRuntimeConfig => ({
				jobPostingUrl: (process.env["JOB_POSTING_URL"] ?? "").trim(),
				emailjsServiceId: (process.env["EMAILJS_SERVICE_ID"] ?? "").trim(),
				emailjsTemplateId: (process.env["EMAILJS_TEMPLATE_ID"] ?? "").trim(),
				emailjsPublicKey: (process.env["EMAILJS_PUBLIC_KEY"] ?? "").trim(),
				apiToken: (process.env["API_TOKEN"] ?? "").trim(),
			}),
		},

		// Initializer moderne (v19+) exécuté lors de la création de l'injecteur d'environnement
		provideEnvironmentInitializer(() => {
			const platformId = inject(PLATFORM_ID);
			if (!isPlatformServer(platformId)) return; // garde-fou SSR

			const ts = inject(TransferState);
			const cfg = inject(PUBLIC_RUNTIME_CONFIG);
			ts.set(CONFIG_KEY, cfg);
		}),
	],
};
