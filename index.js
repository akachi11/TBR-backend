import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import book from "./routes/book.mjs"
import auth from "./routes/auth.mjs"

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "*",
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected."))
  .catch((err) => console.log(err));

  app.use(express.json());
  app.use("/api/book", book)
  app.use("/api/auth", auth)

  app.listen(5000, () => {
    console.log("Backend is running")
  })
