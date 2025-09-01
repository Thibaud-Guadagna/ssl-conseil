import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
	PLATFORM_ID,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

type Logo = { src: string; alt: string };

@Component({
	selector: "app-carousel",
	standalone: true,
	imports: [],
	templateUrl: "./carousel.html",
	styleUrls: ["./carousel.css"],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Carousel {
	isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	logos: Logo[] = [
		{ src: "/heliaq.png", alt: "logoHeliaq" },
		{ src: "/decasoft.png", alt: "logo Decasoft" },
		{ src: "/connektica.png", alt: "logo connektica" },
		{ src: "/essp.png", alt: "logo essp" },
		{ src: "/jeanlarnaudie.png", alt: "logo jeanlarnaudie" },
		{ src: "/spacebel.png", alt: "logo spacebel" },
		{ src: "/septeo.png", alt: "logo septeo" },
	];
}
