import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export default fp(async (app) => {
  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  const RESET_SECRET = process.env.JWT_PASS_RESET_SECRET;

  if (!ACCESS_SECRET || !REFRESH_SECRET || !RESET_SECRET) {
    throw new Error("JWT secrets missing");
  }

  app.register(fastifyJwt, {
    secret: ACCESS_SECRET,
    namespace: "access",
    sign: { expiresIn: "15m" },
  });

  app.register(fastifyJwt, {
    secret: REFRESH_SECRET,
    namespace: "refresh",
    sign: { expiresIn: "7d" },
  });

  app.register(fastifyJwt, {
    secret: RESET_SECRET,
    namespace: "reset",
    sign: { expiresIn: "2m" },
  });

  app.decorate("verifyAccess", async (request:FastifyRequest, reply:FastifyReply) => {
    try {
      let token = null;

      const auth = request.headers.authorization;
      if (auth?.startsWith("Bearer ")) {
        token = auth.slice(7);
      }

      if (!token && request.cookies?.accessToken) {
        token = request.cookies.accessToken;
      }

      if (!token) {
        return reply.code(401).send({ message: "Missing access token" });
      }
      const payload = (app.jwt as any).access.verify(token);
      request.user = payload;
    } catch (err) {
      return reply.code(401).send({ message: "Unauthorized" });
    }
  });
});
