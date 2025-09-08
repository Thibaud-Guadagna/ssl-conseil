import {
	Component,
	OnInit,
	signal,
	computed,
	HostListener,
	inject,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { PUBLIC_RUNTIME_CONFIG, CONFIG_KEY } from "../../runtime-config.token";
import type { PublicRuntimeConfig } from "../../runtime-config.token";
import { makeStateKey, TransferState } from "@angular/core";

interface Offer {
	offre_id: string;
	titre: string;
	codepostal: string;
	ville: string;
	sal_min: string;
	sal_max: string;
	apply_url: string;
}

const OFFERS_KEY = makeStateKey<Offer[]>("OFFERS_SSR_CACHE");

@Component({
	selector: "app-offers",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./offers.html",
	styleUrl: "./offers.css",
})
export class Offers implements OnInit {
	private platformId = inject(PLATFORM_ID);
	private isBrowser = isPlatformBrowser(this.platformId);
	private ts = inject(TransferState);
	private fallbackCfg = inject(PUBLIC_RUNTIME_CONFIG);
	private cfg: PublicRuntimeConfig = this.ts.get(CONFIG_KEY, this.fallbackCfg);
	private http = inject(HttpClient);

	offers: Offer[] = [];
	loading = signal(true);
	errorMsg = signal<string | null>(null);

	expanded = signal(false);
	private visibleCount = signal(8);

	displayedOffers = computed(() =>
		this.offers.slice(
			0,
			this.expanded() ? this.offers.length : this.visibleCount(),
		),
	);

	ngOnInit(): void {
		// règle d’affichage côté client
		if (this.isBrowser) {
			this.setVisibleCountFromWidth(window.innerWidth);
		} else {
			// défaut SSR : on rend 8 pour éviter l’écran vide
			this.visibleCount.set(8);
		}

		const rawUrl = "/api/offres";
		const token = this.cfg.apiToken?.trim() || "";
		const { url, headers, params } = this.buildRequest(rawUrl, token);

		// 1) Regarder d’abord si on a déjà un cache (navigations suivantes)
		const cached = this.ts.get(OFFERS_KEY, null as unknown as Offer[]);
		if (cached && Array.isArray(cached) && cached.length > 0) {
			this.offers = cached;
			this.loading.set(false);
			return;
		}

		// 2) SSR : on FECH côté serveur pour avoir un 1er paint non vide
		if (!this.isBrowser) {
			this.loading.set(true);
			this.http.get<Offer[]>(url, { headers, params }).subscribe({
				next: (data) => {
					this.offers = data ?? [];
					this.ts.set(OFFERS_KEY, this.offers); // hydratation côté client
					this.loading.set(false);
				},
				error: (err) => {
					console.error("Offers SSR fetch failed:", err);
					this.offers = [];
					this.loading.set(false);
					// pas d’UI d’erreur agressive côté SSR, on laisse le client retenter
				},
			});
			return;
		}

		// 3) Client : chargement classique (si pas déjà en cache)
		this.loading.set(true);
		this.errorMsg.set(null);

		this.http.get<Offer[]>(url, { headers, params }).subscribe({
			next: (data) => {
				this.offers = data ?? [];
				this.loading.set(false);
				this.ts.set(OFFERS_KEY, this.offers);
			},
			error: (err) => {
				console.error("Offers fetch failed:", err);
				this.offers = [];
				this.loading.set(false);
				this.errorMsg.set("Impossible de charger les offres pour le moment.");
			},
		});
	}

	@HostListener("window:resize", ["$event"])
	onResize(ev: UIEvent) {
		if (!this.isBrowser) return;
		const w = (ev.target as Window).innerWidth;
		this.setVisibleCountFromWidth(w);
	}

	private setVisibleCountFromWidth(width: number) {
		if (this.expanded()) return;
		if (width < 768)
			this.visibleCount.set(4); // mobile
		else if (width < 1024)
			this.visibleCount.set(6); // tablette
		else this.visibleCount.set(8); // desktop
	}

	toggle() {
		this.expanded.update((v) => !v);
		if (!this.expanded() && this.isBrowser) {
			this.setVisibleCountFromWidth(window.innerWidth);
		}
	}

	openWithoutHash(event: MouseEvent, url: string): void {
		event.preventDefault();
		const clean = this.stripHash(url);
		if (this.isBrowser) window.open(clean, "_blank", "noopener");
	}

	private stripHash(url: string): string {
		try {
			const u = new URL(url);
			u.hash = "";
			return u.toString();
		} catch {
			return url.split("#")[0];
		}
	}

	// -------- utils req --------
	private buildRequest(rawUrl: string, token?: string) {
		let url = rawUrl;
		let params = new HttpParams();
		let headers = new HttpHeaders();

		// Si l’URL commence par /api/, ne pas ajouter d’en-tête (le proxy s’en charge)
		const isLocalApi = url.startsWith("/api/");

		if (!isLocalApi && token) {
			headers = headers.set("api-token", token);
		} else if (!isLocalApi && !token) {
			console.warn("[Offers] apiToken manquant. Le SSR devrait l’injecter.");
		}

		return { url, headers, params };
	}
}
