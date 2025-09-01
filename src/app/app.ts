import { Component, signal } from "@angular/core";
import { Navbar } from "./components/navbar/navbar";
import { Header } from "./components/header/header";
import { Prestations } from "./components/prestations/prestations";

@Component({
	selector: "app-root",
	imports: [Navbar,Header,Prestations],
	standalone: true,
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("sslconseil");
}
