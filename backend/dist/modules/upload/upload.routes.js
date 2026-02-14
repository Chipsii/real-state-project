import { uploadImages } from "./upload.controller.js";
export default async function uploadRoutes(app) {
    app.post("/", { preHandler: [app.verifyAccess] }, async (request, reply) => {
        await uploadImages(request, reply);
    });
}
