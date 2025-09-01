import { register } from "swiper/element/bundle";
register();
import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";
import { appConfig } from "./app/app.config";

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
