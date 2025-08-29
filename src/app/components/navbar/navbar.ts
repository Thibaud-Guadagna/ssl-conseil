import { Component, signal } from "@angular/core";
import { BurgerButtonComponent } from "../burger-button-component/burger-button-component";

@Component({
	selector: "app-navbar",
	imports: [BurgerButtonComponent],
	standalone: true,
	templateUrl: "./navbar.html",
	styleUrl: "./navbar.css",
})


export class Navbar {

  isOpen = signal(false);

  toggleMenu() {
    this.isOpen.update(v => !v);
  }
}


