// src/app/app.config.ts
import {
	type ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZoneChangeDetection,
	TransferState,
} from "@angular/core";
import {
	provideClientHydration,
	withEventReplay,
} from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient, withFetch } from "@angular/common/http";

import {
	PUBLIC_RUNTIME_CONFIG,
	CONFIG_KEY,
	type PublicRuntimeConfig,
} from "./runtime-config.token";

function providePublicRuntimeConfigClient() {
	return {
		provide: PUBLIC_RUNTIME_CONFIG,
		useFactory: (ts: TransferState): PublicRuntimeConfig => {
			// 1) Essayer d'utiliser la config poussée par le SSR
			const fromServer = ts.get(
				CONFIG_KEY,
				null as unknown as PublicRuntimeConfig,
			);

			if (fromServer) {
				const safe = {
					...fromServer,
					apiToken: fromServer.apiToken ? "***" : "",
				};
			} else {
				console.warn("[Client] TransferState is null/undefined");
			}

			if (fromServer?.jobPostingUrl?.trim()) {
				return fromServer;
			}

			// 2) Fallback Vite (CSR/dev) — inclut le token côté client si tu as défini VITE_API_TOKEN
			const env = (import.meta as any).env ?? {};
			const cfg: PublicRuntimeConfig = {
				jobPostingUrl: env.VITE_JOB_POSTING_URL ?? "",
				emailjsServiceId: env.VITE_EMAILJS_SERVICE_ID ?? "",
				emailjsTemplateId: env.VITE_EMAILJS_TEMPLATE_ID ?? "",
				emailjsPublicKey: env.VITE_EMAILJS_PUBLIC_KEY ?? "",
				apiToken: env.VITE_API_TOKEN ?? "", 
			};

			console.warn("[Client] Using Vite fallback.", {
				...cfg,
				apiToken: cfg.apiToken ? "***" : "",
			});

			return cfg;
		},
		deps: [TransferState],
	};
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		provideHttpClient(withFetch()),
		providePublicRuntimeConfigClient(),
	],
};
