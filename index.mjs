// api/ssr/index.mjs
import { app as createApp } from "../../dist/sslconseil/server/server.mjs";

// Angular Universal exporte une factory `app()` -> instance Express
const server = createApp();

// Vercel attend un export default compatible handler
export default server;
