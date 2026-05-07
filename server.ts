import express from "express";
import { createServer as createViteServer } from "vite";
import { setupDb } from "./db.js";
import { apiRouter } from "./api.js";

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT ?? 3000);

  app.use(express.json());
  setupDb();

  app.use("/api", apiRouter);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(port, "0.0.0.0", () => {
    console.info(`Server running on http://localhost:${port}`);
  });
}

void startServer();
