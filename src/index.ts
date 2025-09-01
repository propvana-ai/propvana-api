import express from "express";
import { Client } from "pg";
import Redis from "ioredis";

const app = express();
const port = process.env.PORT || 3000;

const pg = new Client({ connectionString: process.env.DATABASE_URL });
const redis = new Redis(process.env.REDIS_URL!);

app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/readyz", async (_req, res) => {
  try { await pg.query("SELECT 1"); await redis.ping(); res.send("ready"); }
  catch { res.status(503).send("not-ready"); }
});

app.listen(port, async () => {
  try { await pg.connect(); console.log(`api up on :${port}`); }
  catch (e) { console.error("pg connect failed", e); process.exit(1); }
});
