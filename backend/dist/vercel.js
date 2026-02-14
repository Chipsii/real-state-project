import { buildApp } from "./application.js";
let appPromise = null;
async function getApp() {
    if (!appPromise)
        appPromise = buildApp();
    const app = await appPromise;
    await app.ready();
    return app;
}
export default async function handler(req, res) {
    const app = await getApp();
    app.server.emit("request", req, res);
}
