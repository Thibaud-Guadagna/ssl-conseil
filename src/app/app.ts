import { Component, signal } from "@angular/core";
import { Navbar } from "./components/navbar/navbar";
import { Header } from "./components/header/header";
import { Prestations } from "./components/prestations/prestations";
import { Offers } from "./components/offers/offers";
import { Choice } from "./components/choice/choice";
import { Carousel } from "./components/carousel/carousel";
import { Contact } from "./components/contact/contact";
import { Footer } from "./components/footer/footer";

@Component({
	selector: "app-root",
	imports: [Navbar, Header, Prestations, Offers, Choice, Carousel, Contact,Footer],
	standalone: true,
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("sslconseil");
}
