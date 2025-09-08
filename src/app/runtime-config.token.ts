// src/app/runtime-config.token.ts
import { InjectionToken, makeStateKey } from "@angular/core";

export interface PublicRuntimeConfig {
	jobPostingUrl: string;
	emailjsServiceId?: string;
	emailjsTemplateId?: string;
	emailjsPublicKey?: string;
	apiToken?: string;  
}

export const PUBLIC_RUNTIME_CONFIG = new InjectionToken<PublicRuntimeConfig>(
	"PUBLIC_RUNTIME_CONFIG",
);

export const CONFIG_KEY = makeStateKey<PublicRuntimeConfig>(
	"PUBLIC_RUNTIME_CONFIG",
);
