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
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environnement/environnement";

interface Offer {
	offre_id: string;
	titre: string;
	codepostal: string;
	ville: string;
	sal_min: string;
	sal_max: string;
	apply_url: string;
}

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
	private readonly url = environment.jobPostingUrl;

	offers: Offer[] = [];
	expanded = signal(false);
	private visibleCount = signal(8);

	displayedOffers = computed(() =>
		this.offers.slice(
			0,
			this.expanded() ? this.offers.length : this.visibleCount(),
		),
	);

	constructor(private http: HttpClient) {}


	ngOnInit(): void {
		this.http
			.get(this.url, {
				headers: new HttpHeaders({ "api-token": environment.apiToken }),
			})
			.subscribe((data) => {
				this.offers = data as Offer[];
			});

		// ⚠️ Ne lire window que dans le navigateur
		if (this.isBrowser) {
			this.setVisibleCountFromWidth(window.innerWidth);
		} else {
			// valeur par défaut côté serveur (pour le rendu initial)
			this.visibleCount.set(8);
		}
	}

	@HostListener("window:resize", ["$event"])
	onResize(ev: UIEvent) {
		if (!this.isBrowser) return; // évite toute exécution SSR
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
}
