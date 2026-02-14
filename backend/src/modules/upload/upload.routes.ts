import type { FastifyInstance } from "fastify";
import { uploadImages } from "./upload.controller.js";

export default async function uploadRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { preHandler: [(app as any).verifyAccess] },
    async (request, reply) => {
        await uploadImages(request, reply)
    }
  );
}
