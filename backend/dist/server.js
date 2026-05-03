"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const application_js_1 = require("./application.js");
let appPromise = null;
function getApp() {
    if (!appPromise) {
        appPromise = (0, application_js_1.buildApp)();
    }
    return appPromise;
}
async function startServer() {
    const app = await getApp();
    // Webuzo/Passenger passes the port dynamically via process.env.PORT.
    // Fallback to 8000 for local development.
    const PORT = process.env.PORT || 8000;
    try {
        // Passenger sometimes passes a Unix named pipe string instead of a number
        if (typeof PORT === 'string' && isNaN(Number(PORT))) {
            await app.listen({ path: PORT });
            console.log(`Server listening on socket: ${PORT}`);
        }
        else {
            // Standard port binding. Host 0.0.0.0 is crucial for shared hosting!
            await app.listen({ port: Number(PORT), host: "0.0.0.0" });
            console.log(`Server started at ${PORT}`);
        }
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
void startServer();
// You can keep this here if you plan to deploy to Vercel later, 
// but Webuzo will ignore it.
async function handler(req, res) {
    const app = await getApp();
    await app.ready();
    app.server.emit("request", req, res);
}
