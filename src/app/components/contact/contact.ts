import { Component, OnInit } from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
} from "@angular/forms";

@Component({
	selector: "app-contact",
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: "./contact.html",
	styleUrls: ["./contact.css"], // <- 'styleUrls' (pluriel)
})
export class Contact implements OnInit {
	contactForm!: FormGroup;

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.contactForm = this.fb.group({
			firstName: ["", Validators.required],
			lastName: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			message: ["", Validators.required],
		});
	}

	onSubmit(): void {
		if (this.contactForm.invalid) return;
		console.log(this.contactForm.value);
	}
}
