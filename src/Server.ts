// TS
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import Droid from "./controllers/Droid"


dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();

// Middlewares
process.env.NODE_ENV === "development"
  ? app.use(morgan("dev"))
  : app.use(morgan("tiny"));

app.use(cors());
app.use(helmet());
app.use(express.json())

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(res.statusCode).json({
    error: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : "☕️",
  });
});

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("API server is working");
});

// Placeholder response
app.post("/radar", async (req: Request, res: Response, next: NextFunction) => {
  const response = new Droid().nextPosition(req.body.protocols, req.body.scan);
  // const response = { x: 0, y: 40 };
  res.status(200).json(response);
});

app.listen(process.env.PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server listening at htt://localhost:${process.env.PORT}`);
});
