import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./constants.js";

const dataLimit = "16Kb";

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: dataLimit }));

app.use(express.urlencoded({ extended: true, limit: dataLimit }));

app.use(express.static("public"));

app.use(cookieParser());

export { app };
