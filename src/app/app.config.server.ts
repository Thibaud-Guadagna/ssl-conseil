// src/app/app.config.server.ts
import { ApplicationConfig, inject, TransferState } from "@angular/core";
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

		{
			provide: PUBLIC_RUNTIME_CONFIG,
			useFactory: (): PublicRuntimeConfig => {
				const cfg: PublicRuntimeConfig = {
					jobPostingUrl: (process.env["JOB_POSTING_URL"] ?? "").trim(),
					emailjsServiceId: (process.env["EMAILJS_SERVICE_ID"] ?? "").trim(),
					emailjsTemplateId: (process.env["EMAILJS_TEMPLATE_ID"] ?? "").trim(),
					emailjsPublicKey: (process.env["EMAILJS_PUBLIC_KEY"] ?? "").trim(),
					apiToken: (process.env["API_TOKEN"] ?? "").trim(),
				};

				return cfg;
			},
		},

		{
			// Transfert vers le client
			provide: "TRANSFER_CONFIG",
			useFactory: () => {
				const ts = inject(TransferState);
				const cfg = inject(PUBLIC_RUNTIME_CONFIG);
				ts.set(CONFIG_KEY, cfg);
				return cfg;
			},
		},
	],
};
