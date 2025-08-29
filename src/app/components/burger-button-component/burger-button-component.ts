import { Component, Input, Signal } from "@angular/core";

@Component({
	selector: "app-burger-button-component",
	standalone: true,
	templateUrl: "./burger-button-component.html",
	styleUrl: "./burger-button-component.css",
})
export class BurgerButtonComponent {
	@Input() isOpen!: Signal<boolean>; 
	@Input() toggle!: () => void; 
}
