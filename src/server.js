import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { ProfilingIntegration } from "@sentry/profiling-node";
import mongoose from "mongoose";
import compression from "compression";
import sanitize from "express-mongo-sanitize";

import posts from "./routes/posts.js";
import comments from "./routes/comments.js";
import sync from "./routes/sync.js";
import search from "./routes/search.js";

dotenv.config({ debug: process.env.NODE_ENV !== "production" ? true : false });

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN_URI,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.75 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.75 : 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use(cors());
app.use(compression());
app.use(sanitize({ allowDots: true }));
app.use((_req, res, next) => {
  res.header("Connection", "keep-alive");
  next();
});

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_URI, { dbName: "confessionsDB" }).then(
  () => {
    console.log("Connected to MongoDB");
  },
  (err) => {
    console.log(err);
  }
);

app.get("/", (_req, res) => {
  res.status(200).send("Hello Confessions API");
});

app.get("/api", (_req, res) => {
  res.redirect(303, "/");
});

app.use("/api/posts", posts);
app.use("/api/comments", comments);
app.use("/api/sync", sync);
app.use("/api/search", search);

app.all("*", (_req, res) => {
  res
    .status(404)
    .json({ status: "error", message: "404 - Not Found", data: null });
});

app.use(Sentry.Handlers.errorHandler());

app.listen(process.env.PORT || 8000, () => {
  console.log("server started");
});
