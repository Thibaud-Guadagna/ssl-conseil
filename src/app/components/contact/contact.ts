import { Component, OnInit } from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
} from "@angular/forms";
import emailjs from "@emailjs/browser";
import Toastify from "toastify-js";
import { environment } from "../../../environnement/environnement"

@Component({
	selector: "app-contact",
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: "./contact.html",
	styleUrls: ["./contact.css"],
})
export class Contact implements OnInit {
	contactForm!: FormGroup;
	sending = false;
	sent = false;
	errorMsg = "";

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		this.contactForm = this.fb.group({
			firstName: ["", Validators.required],
			lastName: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			tel: ["", [Validators.required]],
			message: ["", Validators.required],
		});
	}

	onSubmit(): void {
		if (this.contactForm.invalid || this.sending) return;

		const { firstName, lastName, email, tel, message } = this.contactForm.value;

		const templateParams = {
			firstName: firstName as string,
			lastName: lastName as string,
			email: email as string,
			tel: (tel ?? "") as string,
			message: message as string,
		};

		this.sending = true;
		this.sent = false;
		this.errorMsg = "";

		emailjs
			.send(
				environment.emailjsServiceId,
				environment.emailjsTemplateId,
				templateParams,
				{ publicKey: environment.emailjsPublicKey },
			)
			.then(() => {
			
				this.sending = false;
				this.sent = true;
				this.contactForm.reset();

				Toastify({
					text: "Message envoyé ✅",
					duration: 4000,
					gravity: "bottom",
					position: "right",
					close: true,
					style: { background: "#FF8F3A" }, // ta couleur bouton
				}).showToast();
			})
			.catch((err) => {
			
				this.sending = false;
				this.errorMsg = "Échec de l’envoi. Réessaie.";

				console.error("EmailJS error:", err);
				Toastify({
					text: "Oups… envoi impossible 😕",
					duration: 5000,
					gravity: "bottom",
					position: "right",
					close: true,
					style: { background: "#dc2626" }, // rouge erreur
				}).showToast();
			});
	}
}
