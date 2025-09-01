import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

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
	imports: [],
	templateUrl: "./offers.html",
	styleUrl: "./offers.css",
})
export class Offers implements OnInit {

  offers: Offer[] = [];
  
	constructor(private http: HttpClient) {}

	url = "https://api.jobposting.pro/clientsjson?id=101619";

	ngOnInit(): void {
		this.http.get(this.url, {
  headers: new HttpHeaders({ 'api-token': 'MTAzNzUyOTk5' })
}).subscribe((data) => {
  this.offers = data as Offer[];
});
	}
}
