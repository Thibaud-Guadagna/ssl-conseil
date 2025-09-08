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
import { PUBLIC_RUNTIME_CONFIG } from "../../runtime-config.token";
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
	private cfg: PublicRuntimeConfig = inject(PUBLIC_RUNTIME_CONFIG);
	private http = inject(HttpClient);
	private ts = inject(TransferState);

	offers: Offer[] = [];
	expanded = signal(false);
	private visibleCount = signal(8);

	displayedOffers = computed(() =>
		this.offers.slice(
			0,
			this.expanded() ? this.offers.length : this.visibleCount(),
		),
	);

	ngOnInit(): void {
		const rawUrl =
			this.cfg.jobPostingUrl?.trim() ||
			"https://api.jobposting.pro/clientsjson?id=101619";

		const token = this.cfg.apiToken?.trim() || "";

		const { url, headers, params } = this.buildRequest(rawUrl, token);


		if (this.isBrowser) {
			const cached = this.ts.get(OFFERS_KEY, null as unknown as Offer[]);
			if (cached && Array.isArray(cached)) {
				this.offers = cached;
				this.setVisibleCountFromWidth(window.innerWidth);
				return;
			}

			this.http.get<Offer[]>(url, { headers, params }).subscribe({
				next: (data) => {
					this.offers = data ?? [];
				},
				error: (err) => {
					console.error("Offers fetch failed:", err);
					this.offers = [];
				},
			});

			this.setVisibleCountFromWidth(window.innerWidth);
			return;
		}

		this.visibleCount.set(8);

		this.http.get<Offer[]>(url, { headers, params }).subscribe({
			next: (data) => {
				this.offers = data ?? [];
				this.ts.set(OFFERS_KEY, this.offers);
			},
			error: (err) => {
				console.error("[SSR] Offers fetch failed:", err);
				this.offers = [];
				this.ts.set(OFFERS_KEY, this.offers);
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
		if (width < 768) this.visibleCount.set(4);
		else if (width < 1024) this.visibleCount.set(6);
		else this.visibleCount.set(8);
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

		if (token) {
			headers = headers.set("api-token", token);
		} else {
			console.warn("[Offers] apiToken manquant. Le SSR devrait l’injecter.");
		}

		return { url, headers, params };
	}
}
