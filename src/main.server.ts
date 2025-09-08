// src/main.server.ts
import "dotenv/config"; 

import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";
import { appConfig } from "./app/app.config.server";

const bootstrap = () => bootstrapApplication(App, appConfig);
export default bootstrap;
